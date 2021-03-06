/******************************************************************************
 * Copyright © 2013-2016 The Nxt Core Developers.                             *
 *                                                                            *
 * See the AUTHORS.txt, DEVELOPER-AGREEMENT.txt and LICENSE.txt files at      *
 * the top-level directory of this distribution for the individual copyright  *
 * holder information and the developer policies on copyright and licensing.  *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * Nxt software, including this file, may be copied, modified, propagated,    *
 * or distributed except according to the terms contained in the LICENSE.txt  *
 * file.                                                                      *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

package xin.env;

import java.nio.file.Paths;

public class WindowsUserDirProvider extends DesktopUserDirProvider {

    //private static final String XIN_USER_HOME = Paths.get(System.getProperty("user.home"), "AppData", "Roaming", "XIN").toString();
	private static final String XIN_USER_HOME = Paths.get(System.getProperty("user.home"), ".iep").toString();
	
    @Override
    public String getUserHomeDir() {
        return XIN_USER_HOME;
    }
    
}
