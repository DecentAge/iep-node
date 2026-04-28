/******************************************************************************
 * One-shot migration of an H2 1.4.x PageStore database to H2 2.x MVStore.    *
 *                                                                            *
 * H2 2.x cannot open 1.4.x storage files, so the upgrade must run before     *
 * any H2 2.x JDBC connection is opened. This class is invoked from           *
 * xin.Db#init() and is a no-op on fresh installs and on already-migrated    *
 * databases. The legacy h2-1.4.x jar must be packaged in legacy_libs/ and    *
 * is invoked out-of-process so its classes never share a classloader with   *
 * the bundled H2 2.x.                                                       *
 ******************************************************************************/

package xin.db;

import xin.util.Logger;

import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;

public final class H2LegacyMigrator {

    private static final String LEGACY_JAR_PROPERTY = "xin.legacyH2Jar";
    private static final String DEFAULT_LEGACY_JAR = "legacy_libs/h2-1.4.191.jar";
    private static final String DUMP_TIMEOUT_PROPERTY = "xin.legacyH2DumpTimeoutMinutes";
    private static final long DEFAULT_DUMP_TIMEOUT_MINUTES = 60;

    private H2LegacyMigrator() {}

    /**
     * @param dbDir   resolved DB path prefix (e.g. {@code /var/iep/db/xin}); the legacy
     *                file is expected at {@code dbDir + ".h2.db"}.
     * @param username DB user (typically "sa" for embedded H2).
     * @param password DB password (may be empty/null).
     */
    public static void migrateIfNeeded(String dbDir, String username, String password) {
        File legacyDb = new File(dbDir + ".h2.db");
        File newDb = new File(dbDir + ".mv.db");

        if (!legacyDb.exists()) {
            return;
        }

        if (newDb.exists()) {
            throw new RuntimeException(
                    "Aborting startup: both legacy (" + legacyDb.getAbsolutePath()
                            + ") and new (" + newDb.getAbsolutePath() + ") H2 database files exist. "
                            + "This indicates an aborted prior migration. Move one aside before retrying.");
        }

        Logger.logMessage("Detected legacy H2 1.4 database at " + legacyDb.getAbsolutePath()
                + " - migrating to H2 2.x. This may take several minutes; do not interrupt.");

        File legacyJar = locateLegacyJar();
        File scriptFile = new File(dbDir + "-migration.sql");

        runLegacyDump(legacyJar, dbDir, username, password, scriptFile);
        archiveLegacyFiles(dbDir);
        runImport(dbDir, username, password, scriptFile);
        verifyImport(dbDir, username, password);

        Logger.logMessage("H2 1.4 -> 2.x migration complete. Legacy files retained with "
                + ".legacy-backup-* suffix; migration SQL kept at " + scriptFile.getAbsolutePath());
    }

    private static File locateLegacyJar() {
        String configured = System.getProperty(LEGACY_JAR_PROPERTY);
        if (configured != null) {
            File jar = new File(configured);
            if (jar.isFile()) return jar;
            throw new RuntimeException("Configured legacy H2 jar not found at " + jar.getAbsolutePath());
        }
        File cwd = new File(DEFAULT_LEGACY_JAR);
        if (cwd.isFile()) return cwd;
        try {
            File codeLoc = new File(H2LegacyMigrator.class.getProtectionDomain()
                    .getCodeSource().getLocation().toURI());
            File anchor = codeLoc.isFile() ? codeLoc.getParentFile() : codeLoc;
            for (int i = 0; i < 4 && anchor != null; i++, anchor = anchor.getParentFile()) {
                File candidate = new File(anchor, DEFAULT_LEGACY_JAR);
                if (candidate.isFile()) return candidate;
            }
        } catch (Exception ignore) {
        }
        throw new RuntimeException("Legacy H2 jar not found. Place h2-1.4.191.jar in legacy_libs/ "
                + "in the install directory, or set -D" + LEGACY_JAR_PROPERTY + "=<absolute-path>.");
    }

    private static void runLegacyDump(File legacyJar, String dbDir, String user, String pwd, File scriptFile) {
        String javaBin = System.getProperty("java.home") + File.separator + "bin" + File.separator + "java";
        String legacyUrl = "jdbc:h2:" + new File(dbDir).getAbsolutePath();

        ProcessBuilder pb = new ProcessBuilder(
                javaBin,
                "-cp", legacyJar.getAbsolutePath(),
                "org.h2.tools.Script",
                "-url", legacyUrl,
                "-user", user == null ? "" : user,
                "-password", pwd == null ? "" : pwd,
                "-script", scriptFile.getAbsolutePath()
        );
        pb.redirectErrorStream(true);

        Logger.logMessage("Dumping legacy database to " + scriptFile.getAbsolutePath());
        Process proc;
        try {
            proc = pb.start();
        } catch (IOException e) {
            throw new RuntimeException("Failed to spawn legacy H2 dump process: " + e, e);
        }

        StringBuilder out = new StringBuilder();
        try (Reader r = new InputStreamReader(proc.getInputStream())) {
            char[] buf = new char[4096];
            int n;
            while ((n = r.read(buf)) != -1) out.append(buf, 0, n);
        } catch (IOException e) {
            proc.destroyForcibly();
            throw new RuntimeException("Failed reading legacy dump output: " + e, e);
        }

        long timeout = Long.getLong(DUMP_TIMEOUT_PROPERTY, DEFAULT_DUMP_TIMEOUT_MINUTES);
        boolean finished;
        try {
            finished = proc.waitFor(timeout, TimeUnit.MINUTES);
        } catch (InterruptedException e) {
            proc.destroyForcibly();
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted while waiting for legacy H2 dump.", e);
        }
        if (!finished) {
            proc.destroyForcibly();
            throw new RuntimeException("Legacy H2 dump timed out after " + timeout + " minutes."
                    + " Increase via -D" + DUMP_TIMEOUT_PROPERTY + "=<minutes>.");
        }
        int exit = proc.exitValue();
        if (exit != 0) {
            throw new RuntimeException("Legacy H2 dump exited with code " + exit
                    + ". Output:\n" + out
                    + "\nLegacy database files left untouched at " + dbDir + ".h2.db");
        }
        if (!scriptFile.isFile() || scriptFile.length() == 0) {
            throw new RuntimeException("Legacy H2 dump produced no output at " + scriptFile.getAbsolutePath());
        }
        if (out.length() > 0) Logger.logDebugMessage("Legacy dump output:\n" + out);
    }

    private static void archiveLegacyFiles(String dbDir) {
        String stamp = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")
                .withZone(ZoneOffset.UTC).format(Instant.now());
        for (String suffix : new String[]{".h2.db", ".trace.db", ".lock.db"}) {
            File f = new File(dbDir + suffix);
            if (!f.exists()) continue;
            File backup = new File(dbDir + suffix + ".legacy-backup-" + stamp);
            try {
                Files.move(f.toPath(), backup.toPath(), StandardCopyOption.ATOMIC_MOVE);
                Logger.logMessage("Archived " + f.getName() + " -> " + backup.getName());
            } catch (IOException e) {
                throw new RuntimeException("Failed to archive legacy file " + f.getAbsolutePath()
                        + ": " + e, e);
            }
        }
    }

    private static void runImport(String dbDir, String user, String pwd, File scriptFile) {
        String url = "jdbc:h2:" + new File(dbDir).getAbsolutePath()
                + ";NON_KEYWORDS=VALUE;DB_CLOSE_ON_EXIT=FALSE";
        Logger.logMessage("Importing dump into new H2 2.x database (" + new File(dbDir + ".mv.db").getAbsolutePath() + ")");
        // FROM_1X tells the H2 2.x parser this dump came from a 1.x database, enabling
        // compatibility handling for legacy idioms (untyped ARRAY, etc.). This is what
        // org.h2.tools.Upgrade does internally; RunScript.execute() does not set it.
        String quotedPath = scriptFile.getAbsolutePath().replace("'", "''");
        String runscript = "RUNSCRIPT FROM '" + quotedPath + "' FROM_1X";
        try (Connection con = DriverManager.getConnection(url, user, pwd);
             Statement stmt = con.createStatement()) {
            stmt.execute(runscript);
            stmt.execute("SHUTDOWN");
        } catch (SQLException e) {
            throw new RuntimeException("Import of legacy dump into H2 2.x failed: " + e
                    + ". Legacy backup files retained for recovery.", e);
        }
    }

    private static void verifyImport(String dbDir, String user, String pwd) {
        String url = "jdbc:h2:" + new File(dbDir).getAbsolutePath() + ";DB_CLOSE_ON_EXIT=FALSE";
        try (Connection con = DriverManager.getConnection(url, user, pwd);
             Statement stmt = con.createStatement()) {
            try (ResultSet rs = stmt.executeQuery("SELECT next_update FROM version")) {
                if (!rs.next()) {
                    throw new RuntimeException("Imported database has an empty version table.");
                }
                Logger.logMessage("Imported database: version.next_update = " + rs.getInt(1));
            }
            try (ResultSet rs = stmt.executeQuery(
                    "SELECT COUNT(*), COALESCE(MAX(height), -1) FROM block")) {
                rs.next();
                Logger.logMessage("Imported database: block count = " + rs.getLong(1)
                        + ", max height = " + rs.getInt(2));
            }
            stmt.execute("SHUTDOWN");
        } catch (SQLException e) {
            throw new RuntimeException("Verification of imported database failed: " + e
                    + ". Legacy backup files retained for recovery.", e);
        }
    }
}
