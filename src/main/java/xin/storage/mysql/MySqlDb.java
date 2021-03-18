/******************************************************************************
 * Copyright © 2017 XIN Community                                             *
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

package xin.storage.mysql;

import xin.Xin;
import xin.XinException;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class MySqlDb {

    private static final String MYSQL_DRIVER_CLASS = Xin.getStringProperty("xin.storage.mysql.driverclass");
    private static final String MYSQL_HOST_URL = Xin.getStringProperty("xin.storage.mysql.url");
    private static final String MYSQL_USER_NAME = Xin.getStringProperty("xin.storage.mysql.username");
    private static final String MYSQL_PASSWORD = Xin.getStringProperty("xin.storage.mysql.password");

    public Connection getMysqlConnection() {
        try {
            Class.forName(MYSQL_DRIVER_CLASS);
            Connection connection = DriverManager.getConnection(MYSQL_HOST_URL, MYSQL_USER_NAME, MYSQL_PASSWORD);
            return connection;
        } catch (ClassNotFoundException | SQLException e) {
            throw new XinException.XinStorageException(e.getMessage(), e);
        }

    }

    public static void closeSilently(AutoCloseable closeable) {
        if (closeable == null) {
            return;
        }
        try {
            closeable.close();
        } catch (Exception e) {
            //Fail silently
        }
    }
}
