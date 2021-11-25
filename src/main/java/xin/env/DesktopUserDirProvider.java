/*
 * Copyright © 2013-2016 The Nxt Core Developers.
 * Copyright © 2016-2020 Jelurida IP B.V.
 *
 * See the LICENSE.txt file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with Jelurida B.V.,
 * no part of the Nxt software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE.txt file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */

package xin.env;

import java.io.File;
import java.nio.file.Paths;

import xin.util.Logger;



abstract class DesktopUserDirProvider implements DirProvider {

    @Override
    public boolean isLoadPropertyFileFromUserDir() {
        return true;
    }

    @Override
    public File getLogFileDir() {
        return Logger.getLogFileDir();
    }

    @Override
    public String getDbDir(String dbDir) {
        return Paths.get(getUserHomeDir()).resolve(Paths.get(dbDir)).toString();
    }

    @Override
    public File getConfDir() {
        return new File(getUserHomeDir(), "conf");
    }

    @Override
    public abstract String getUserHomeDir();

}
