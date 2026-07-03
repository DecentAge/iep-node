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

package xin.db;

import xin.util.Logger;

import java.sql.*;
import java.util.Arrays;

public final class DbUtils {

    public static void close(AutoCloseable... closeables) {
        for (AutoCloseable closeable : closeables) {
            if (closeable != null) {
                try {
                    closeable.close();
                } catch (Exception ignore) {
                }
            }
        }
    }

    public static void rollback(Connection con) {
        try {
            if (con != null) {
                con.rollback();
            }
        } catch (SQLException e) {
            Logger.logErrorMessage(e.toString(), e);
        }

    }

    public static void setBytes(PreparedStatement pstmt, int index, byte[] bytes) throws SQLException {
        if (bytes != null) {
            pstmt.setBytes(index, bytes);
        } else {
            pstmt.setNull(index, Types.BINARY);
        }
    }

    public static void setString(PreparedStatement pstmt, int index, String s) throws SQLException {
        if (s != null) {
            pstmt.setString(index, s);
        } else {
            pstmt.setNull(index, Types.VARCHAR);
        }
    }

    public static void setLong(PreparedStatement pstmt, int index, Long l) throws SQLException {
        if (l != null) {
            pstmt.setLong(index, l);
        } else {
            pstmt.setNull(index, Types.BIGINT);
        }
    }

    public static void setShortZeroToNull(PreparedStatement pstmt, int index, short s) throws SQLException {
        if (s != 0) {
            pstmt.setShort(index, s);
        } else {
            pstmt.setNull(index, Types.SMALLINT);
        }
    }

    public static void setIntZeroToNull(PreparedStatement pstmt, int index, int n) throws SQLException {
        if (n != 0) {
            pstmt.setInt(index, n);
        } else {
            pstmt.setNull(index, Types.INTEGER);
        }
    }

    public static void setLongZeroToNull(PreparedStatement pstmt, int index, long l) throws SQLException {
        if (l != 0) {
            pstmt.setLong(index, l);
        } else {
            pstmt.setNull(index, Types.BIGINT);
        }
    }

    public static <T> T[] getArray(ResultSet rs, String columnName, Class<? extends T[]> cls) throws SQLException {
        return getArray(rs, columnName, cls, null);
    }

    @SuppressWarnings("unchecked")
    public static <T> T[] getArray(ResultSet rs, String columnName, Class<? extends T[]> cls, T[] ifNull) throws SQLException {
        Array array = rs.getArray(columnName);
        if (array == null) {
            return ifNull;
        }
        Object[] objects = (Object[]) array.getArray();
        // H2 2.x can return an untyped-ARRAY column as a MIXED Object[] — e.g. the
        // account_control_phasing.whitelist BIGINT array, when a DB is migrated from H2 1.4
        // by H2LegacyMigrator, keeps the 1.4 untyped ARRAY type. H2 2.x then hands the
        // elements back inconsistently typed — as Integer, Long, or even String — so a raw
        // Arrays.copyOf(.., Long[].class) throws ArrayStoreException. Coerce each element to
        // the requested numeric component type (from a Number or from its text form) so
        // migrated arrays read back correctly regardless of how H2 typed them.
        Class<?> componentType = cls.getComponentType();
        T[] result = (T[]) java.lang.reflect.Array.newInstance(componentType, objects.length);
        for (int i = 0; i < objects.length; i++) {
            Object o = objects[i];
            if (o == null || componentType.isInstance(o)) {
                result[i] = (T) o;
            } else if (componentType == Long.class) {
                result[i] = (T) Long.valueOf(coerceToLong(o));
            } else if (componentType == Integer.class) {
                result[i] = (T) Integer.valueOf((int) coerceToLong(o));
            } else {
                result[i] = (T) o; // last resort — fail loudly if genuinely incompatible
            }
        }
        return result;
    }

    // Coerce a value H2 may hand back as Number or (for a migrated untyped ARRAY) String
    // into a long. Account ids are UNSIGNED 64-bit, so a large decimal string can exceed
    // Long.MAX_VALUE — fall back to unsigned parsing rather than throwing.
    private static long coerceToLong(Object o) {
        if (o instanceof Number) {
            return ((Number) o).longValue();
        }
        String s = o.toString().trim();
        try {
            return Long.parseLong(s);
        } catch (NumberFormatException e) {
            return Long.parseUnsignedLong(s);
        }
    }

    public static <T> void setArray(PreparedStatement pstmt, int index, T[] array) throws SQLException {
        if (array != null) {
            pstmt.setObject(index, array);
        } else {
            pstmt.setNull(index, Types.ARRAY);
        }
    }

    public static <T> void setArrayEmptyToNull(PreparedStatement pstmt, int index, T[] array) throws SQLException {
        if (array != null && array.length > 0) {
            pstmt.setObject(index, array);
        } else {
            pstmt.setNull(index, Types.ARRAY);
        }
    }

    public static String limitsClause(int from, int to) {
        int limit = to >= 0 && to >= from && to < Integer.MAX_VALUE ? to - from + 1 : 0;
        if (limit > 0 && from > 0) {
            return " LIMIT ? OFFSET ? ";
        } else if (limit > 0) {
            return " LIMIT ? ";
        } else if (from > 0) {
            return " LIMIT NULL OFFSET ? ";
        } else {
            return "";
        }
    }

    public static int setLimits(int index, PreparedStatement pstmt, int from, int to) throws SQLException {
        int limit = to >= 0 && to >= from && to < Integer.MAX_VALUE ? to - from + 1 : 0;
        if (limit > 0) {
            pstmt.setInt(index++, limit);
        }
        if (from > 0) {
            pstmt.setInt(index++, from);
        }
        return index;
    }

    private DbUtils() {
    } // never

}
