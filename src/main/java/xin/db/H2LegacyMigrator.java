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

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
        fixGeneratedColumns(scriptFile);
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

    /**
     * Fix generated column issue: H2 2.x does not allow INSERT into generated columns.
     * This method scans the SQL dump, identifies tables with generated columns (e.g.,
     * ALIAS_NAME_LOWER AS LOWER(ALIAS_NAME)), and removes those columns from INSERT statements.
     */
    private static void fixGeneratedColumns(File scriptFile) {
        Logger.logMessage("Fixing generated columns in migration script...");

        Map<String, List<String>> generatedColumns = new HashMap<>();
        Pattern createTablePattern = Pattern.compile("CREATE\\s+(?:CACHED\\s+)?TABLE\\s+(\\S+)\\s*\\(", Pattern.CASE_INSENSITIVE);
        Pattern generatedColPattern = Pattern.compile("^\\s*(\\w+)\\s+\\w+\\s+AS\\s+", Pattern.CASE_INSENSITIVE);
        Pattern insertPattern = Pattern.compile("INSERT\\s+INTO\\s+(\\S+)\\s*\\(([^)]+)\\)", Pattern.CASE_INSENSITIVE);
        // H2 2.x zero-pads fixed BINARY(n); the 32-byte generation_signature in a
        // BINARY(64) column would pad to 64 on re-import and overflow BlockImpl.bytes()
        // when a peer parses the served block. Rewrite the dumped DDL to VARBINARY(64)
        // (group 1 = identifier+space, group 2 = the (64)). See XinDbVersion case 1.
        Pattern genSigBinaryPattern = Pattern.compile("(?i)(\"?generation_signature\"?\\s+)BINARY(\\s*\\(\\s*64\\s*\\))");

        File tempFile = new File(scriptFile.getAbsolutePath() + ".tmp");

        try (BufferedReader reader = new BufferedReader(new FileReader(scriptFile, StandardCharsets.UTF_8));
             BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile, StandardCharsets.UTF_8))) {

            String line;
            String currentTable = null;
            boolean inCreateTable = false;

            // First pass: identify generated columns
            while ((line = reader.readLine()) != null) {
                Matcher createMatcher = createTablePattern.matcher(line);
                if (createMatcher.find()) {
                    currentTable = createMatcher.group(1);
                    inCreateTable = true;
                } else if (inCreateTable) {
                    Matcher genMatcher = generatedColPattern.matcher(line);
                    if (genMatcher.find()) {
                        String colName = genMatcher.group(1).toUpperCase();
                        generatedColumns.computeIfAbsent(currentTable, k -> new ArrayList<>()).add(colName);
                        Logger.logDebugMessage("Found generated column: " + currentTable + "." + colName);
                    }
                    if (line.trim().endsWith(");")) {
                        inCreateTable = false;
                        currentTable = null;
                    }
                }
            }

            if (!generatedColumns.isEmpty()) {
                Logger.logMessage("Found " + generatedColumns.size() + " table(s) with generated columns");
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to analyze generated columns in " + scriptFile.getAbsolutePath(), e);
        }

        // Second pass: rewrite INSERT statements
        try (BufferedReader reader = new BufferedReader(new FileReader(scriptFile, StandardCharsets.UTF_8));
             BufferedWriter writer = new BufferedWriter(new FileWriter(tempFile, StandardCharsets.UTF_8))) {

            String line;
            int fixedInserts = 0;
            int genSigRewrites = 0;
            boolean inInsertValues = false;
            List<Integer> currentGenColPositions = null;
            StringBuilder valuesBlock = new StringBuilder();

            while ((line = reader.readLine()) != null) {
                if (inInsertValues) {
                    // Collect and fix VALUES lines until we hit a line that doesn't start with '('
                    if (line.trim().startsWith("(")) {
                        // Fix this row and write it
                        String fixedRow = fixValuesRow(line, currentGenColPositions);
                        writer.write(fixedRow);
                        writer.newLine();
                        continue;
                    } else {
                        // End of VALUES block
                        inInsertValues = false;
                        currentGenColPositions = null;
                        // Fall through to write the current line
                    }
                }

                Matcher insertMatcher = insertPattern.matcher(line);
                if (insertMatcher.find()) {
                    String tableName = insertMatcher.group(1);
                    List<String> genCols = generatedColumns.get(tableName);

                    if (genCols != null && !genCols.isEmpty()) {
                        String columnList = insertMatcher.group(2);
                        String[] columns = columnList.split(",");

                        // Find positions of generated columns
                        List<Integer> genColPositions = new ArrayList<>();
                        for (int i = 0; i < columns.length; i++) {
                            String col = columns[i].trim().toUpperCase();
                            if (genCols.contains(col)) {
                                genColPositions.add(i);
                            }
                        }

                        if (!genColPositions.isEmpty()) {
                            // Remove generated columns from column list
                            StringBuilder newColumnList = new StringBuilder();
                            for (int i = 0; i < columns.length; i++) {
                                if (!genColPositions.contains(i)) {
                                    if (newColumnList.length() > 0) newColumnList.append(",");
                                    newColumnList.append(columns[i].trim());
                                }
                            }

                            // Write the INSERT header with fixed column list
                            writer.write("INSERT INTO " + tableName + "(" + newColumnList.toString() + ") VALUES");
                            writer.newLine();

                            // Prepare to collect VALUES lines
                            inInsertValues = true;
                            currentGenColPositions = genColPositions;
                            valuesBlock = new StringBuilder();
                            fixedInserts++;
                            continue;
                        }
                    }
                }

                // Rewrite the generation_signature column type in the dumped DDL
                // (BINARY(64) -> VARBINARY(64)) so H2 2.x does not zero-pad it on import.
                Matcher genSigMatcher = genSigBinaryPattern.matcher(line);
                if (genSigMatcher.find()) {
                    line = genSigMatcher.replaceAll("$1VARBINARY$2");
                    genSigRewrites++;
                }

                writer.write(line);
                writer.newLine();
            }

            if (fixedInserts > 0) {
                Logger.logMessage("Fixed " + fixedInserts + " INSERT statement(s) to exclude generated columns");
            }
            if (genSigRewrites > 0) {
                Logger.logMessage("Rewrote " + genSigRewrites + " generation_signature column DDL: BINARY(64) -> VARBINARY(64)");
            } else {
                Logger.logMessage("WARNING: no generation_signature BINARY(64) DDL found to rewrite — "
                        + "verify the dump's column type; an un-rewritten BINARY(64) padding will break peer sync");
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to fix generated columns in " + scriptFile.getAbsolutePath(), e);
        }

        // Replace original file with fixed version
        try {
            Files.move(tempFile.toPath(), scriptFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to replace migration script with fixed version", e);
        }
    }

    /**
     * Fix a single VALUES row by removing values at specified positions.
     * Example: "(1, 'text', 'remove_me', 'keep', TRUE)," with position [2]
     * Returns: "(1, 'text', 'keep', TRUE),"
     */
    private static String fixValuesRow(String rowLine, List<Integer> positions) {
        if (positions == null || positions.isEmpty()) return rowLine;

        String trimmed = rowLine.trim();
        if (!trimmed.startsWith("(")) return rowLine;

        // Extract the row content (between parentheses)
        int openParen = trimmed.indexOf('(');
        int closeParen = trimmed.lastIndexOf(')');
        if (closeParen <= openParen) return rowLine;

        String rowContent = trimmed.substring(openParen + 1, closeParen);
        String trailing = trimmed.substring(closeParen + 1); // Preserves "," or ");", etc.

        // Parse values, respecting quoted strings
        List<String> values = new ArrayList<>();
        StringBuilder currentValue = new StringBuilder();
        boolean inString = false;
        char stringDelim = 0;
        int parenDepth = 0;

        for (int i = 0; i < rowContent.length(); i++) {
            char c = rowContent.charAt(i);

            if (inString) {
                currentValue.append(c);
                if (c == stringDelim) {
                    // Check if escaped by looking for preceding single quotes (H2 uses '' for escaping)
                    if (i + 1 < rowContent.length() && rowContent.charAt(i + 1) == stringDelim) {
                        currentValue.append(rowContent.charAt(i + 1));
                        i++; // Skip next char
                    } else {
                        inString = false;
                    }
                }
            } else {
                if (c == '\'' || c == '"') {
                    inString = true;
                    stringDelim = c;
                    currentValue.append(c);
                } else if (c == '(') {
                    parenDepth++;
                    currentValue.append(c);
                } else if (c == ')') {
                    parenDepth--;
                    currentValue.append(c);
                } else if (c == ',' && parenDepth == 0) {
                    // End of value
                    values.add(currentValue.toString().trim());
                    currentValue = new StringBuilder();
                } else {
                    currentValue.append(c);
                }
            }
        }

        // Add last value
        if (currentValue.length() > 0) {
            values.add(currentValue.toString().trim());
        }

        // Remove values at specified positions (in descending order to avoid index shift)
        List<Integer> sortedPositions = new ArrayList<>(positions);
        sortedPositions.sort((a, b) -> b - a);
        for (int pos : sortedPositions) {
            if (pos < values.size()) {
                values.remove(pos);
            }
        }

        // Rebuild the row
        StringBuilder result = new StringBuilder("(");
        for (int i = 0; i < values.size(); i++) {
            if (i > 0) result.append(", ");
            result.append(values.get(i));
        }
        result.append(')').append(trailing);

        return result.toString();
    }

    /**
     * Remove values at specified positions from a VALUES clause.
     * Handles multi-row inserts like: (val1, val2, val3), (val4, val5, val6)
     */
    private static String removeValuesAtPositions(String valuesClause, List<Integer> positions) {
        if (positions.isEmpty()) return valuesClause;

        // Sort positions in descending order for easier removal
        List<Integer> sortedPositions = new ArrayList<>(positions);
        sortedPositions.sort((a, b) -> b - a);

        StringBuilder result = new StringBuilder();
        boolean inRow = false;
        int depth = 0;
        List<String> currentRow = new ArrayList<>();
        StringBuilder currentValue = new StringBuilder();
        boolean inString = false;
        char stringDelim = 0;

        for (int i = 0; i < valuesClause.length(); i++) {
            char c = valuesClause.charAt(i);

            if (inString) {
                currentValue.append(c);
                if (c == stringDelim) {
                    // Check if it's escaped
                    int backslashCount = 0;
                    for (int j = i - 1; j >= 0 && valuesClause.charAt(j) == '\\'; j--) {
                        backslashCount++;
                    }
                    if (backslashCount % 2 == 0) {
                        inString = false;
                    }
                }
            } else {
                if (c == '\'' || c == '"') {
                    inString = true;
                    stringDelim = c;
                    currentValue.append(c);
                } else if (c == '(') {
                    if (depth == 0) {
                        // Start of a row
                        inRow = true;
                        currentRow.clear();
                        currentValue = new StringBuilder();
                    } else {
                        currentValue.append(c);
                    }
                    depth++;
                } else if (c == ')' && depth > 0) {
                    depth--;
                    if (depth == 0) {
                        // End of row - add last value and process the row
                        currentRow.add(currentValue.toString());

                        // Remove values at specified positions
                        for (int pos : sortedPositions) {
                            if (pos < currentRow.size()) {
                                currentRow.remove(pos);
                            }
                        }

                        // Write the row
                        result.append('(');
                        for (int j = 0; j < currentRow.size(); j++) {
                            if (j > 0) result.append(',');
                            result.append(currentRow.get(j));
                        }
                        result.append(')');

                        inRow = false;
                        currentValue = new StringBuilder();
                    } else {
                        currentValue.append(c);
                    }
                } else if (c == ',' && depth == 1) {
                    // End of value within the row
                    currentRow.add(currentValue.toString());
                    currentValue = new StringBuilder();
                } else {
                    currentValue.append(c);
                }
            }
        }

        return result.toString();
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
