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


package xin.db;

import com.google.common.collect.ImmutableMap;

import java.util.Map;
import java.util.TreeMap;

public enum SortType {

    ASSET("ASC", new String[]{"name", "decimals", "quantity", "height"}, "name"),
    CURRENCY("ASC", new String[]{"name", "decimals", "code", "issuance_height"}, "code"),
    ALIAS_PUBLIC_OFFERS("DESC", new String[]{"name", "height", "price"}, "height", ImmutableMap.<String,
            String>builder().put("name", "ALIAS.alias_name").
            put("height", "ALIAS_OFFER.height").
            put("price", "ALIAS_OFFER.price").build());


    public static final String[] ALLOWED_SORT_VALUES = new String[]{"DESC", "ASC"};

    private String defaultOrder;
    private String[] allowedColumns;
    private String defaultColumn;
    private Map<String, String> columnMappings;

    SortType(String defaultOrder, String[] allowedColumns, String defaultColumn) {
        this(defaultOrder, allowedColumns, defaultColumn, new TreeMap<>(String.CASE_INSENSITIVE_ORDER));
    }

    SortType(String defaultOrder, String[] allowedColumns, String defaultColumn, Map<String, String> columnMappings) {
        this.defaultOrder = defaultOrder;
        this.allowedColumns = allowedColumns;
        this.defaultColumn = defaultColumn;
        this.columnMappings = columnMappings;
    }

    public String getDefaultOrder() {
        return defaultOrder;
    }

    public String[] getAllowedColumns() {
        return allowedColumns;
    }


    public String getDefaultColumn() {
        return getActualColumnName(defaultColumn);
    }

    public String getActualColumnName(String columnApiName) {
        if (columnMappings.containsKey(columnApiName)) {
            return columnMappings.get(columnApiName);
        }
        return columnApiName;
    }

}
