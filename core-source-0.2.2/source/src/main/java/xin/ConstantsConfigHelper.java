/******************************************************************************
 * Copyright © 2017-2018 XIN Community                                             *
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

package xin;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;

public class ConstantsConfigHelper {

    public static final String PROPERTY_CREATOR_ID = "CREATOR_ID";
    public static final String PROPERTY_GENESIS_BLOCK_ID = "GENESIS_BLOCK_ID";
    public static final String PROPERTY_CREATOR_PUBLIC_KEY = "CREATOR_PUBLIC_KEY";
    public static final String PROPERTY_GENESIS_RECIPIENTS = "GENESIS_RECIPIENTS";
    public static final String PROPERTY_GENESIS_AMOUNTS = "GENESIS_AMOUNTS";
    public static final String PROPERTY_GENESIS_SIGNATURES = "GENESIS_SIGNATURE_1";
    public static final String PROPERTY_GENESIS_BLOCK_SIGNATURE = "GENESIS_BLOCK_SIGNATURE";
    public static final String PROPERTY_LAST_KNOWN_BLOCK_HEIGHT = "LAST_KNOWN_BLOCK_HEIGHT";
    public static final String PROPERTY_BAD_BLOCK_MAX_HEIGHT = "BAD_BLOCK_MAX_HEIGHT";
    public static final String PROPERTY_SINGLE_DIVIDEND_PAYMENT_PER_BLOCK_BLOCK =
            "SINGLE_DIVIDEND_PAYMENT_PER_BLOCK_BLOCK";
    public static final String PROPERTY_INCREASED_DIVI_PAYMENT_BLOCK="INCREASED_DIVI_PAYMENT_BLOCK";
    public static final String PROPERTY_SHUFFLING_ACTIVATION_BLOCK="SHUFFLING_ACTIVATION_BLOCK";
    public static final String PROPERTY_ROLLBACK_TAG = "ROLLBACK_TAG";
    public static final String PROPERTY_ROLLBACK_BLOCK = "ROLLBACK_BLOCK";
    public static final String PROPERTY_ROLLBACK_HEIGHT = "ROLLBACK_HEIGHT";
    public static final String PROPERTY_AUTOMATED_TRANSACTION_BLOCK = "AUTOMATED_TRANSACTION_BLOCK";
    public static final String PROPERTY_SUBSCRIPTION_START_BLOCK = "SUBSCRIPTION_START_BLOCK";
    public static final String PROPERTY_ESCROW_START_BLOCK = "ESCROW_START_BLOCK";
    public static final String PROPERTY_SHUFFLING_BLOCK = "SHUFFLING_BLOCK";
    public static final String PROPERTY_MAX_DIVIDEND_PER_BLOCKS = "MAX_DIVIDEND_PER_BLOCKS";
    public static final String PROPERTY_MAX_ACCOUNTS_FOR_DIVIDEND_PAYMENT = "MAX_ACCOUNTS_FOR_DIVIDEND_PAYMENT";
    public static final String PROPERTY_ASSET_FULLDELETE_START_BLOCK = "ASSET_FULLDELETE_START_BLOCK";
    public static final String PROPERTY_SUBSCRIPTION_MIN_FREQ = "SUBSCRIPTION_MIN_FREQ";
    public static final String PROPERTY_SUBSCRIPTION_MAX_FREQ = "SUBSCRIPTION_MAX_FREQ";
    public static final String PROPERTY_BLOCK_CHECKSUMS = "BLOCK_CHECKSUMS";
    public static final String PROPERTY_LOCKED_BLOCK_MAX_VALUE = "BLOCK_MAX_VALUE";
    public static final String PROPERTY_PRUNABLE_MESSAGES_BLOCK = "PRUNABLE_MESSAGES_BLOCK";
    public static final String PROPERTY_CROWD_FUNDING_BLOCK = "CROWD_FUNDING_BLOCK";
    public static final String PROPERTY_FUNDING_MONITOR_BLOCK = "FUNDING_MONITOR_BLOCK";

    private static final List<String> ENVIRONMENT_DIFFER_PROPERTY_NAMES =
            ImmutableList.of(
                    PROPERTY_CREATOR_ID,
                    PROPERTY_CREATOR_PUBLIC_KEY,
                    PROPERTY_GENESIS_AMOUNTS,
                    PROPERTY_GENESIS_BLOCK_ID,
                    PROPERTY_GENESIS_RECIPIENTS,
                    PROPERTY_GENESIS_SIGNATURES,
                    PROPERTY_GENESIS_BLOCK_SIGNATURE,
                    PROPERTY_LAST_KNOWN_BLOCK_HEIGHT,
                    PROPERTY_AUTOMATED_TRANSACTION_BLOCK,
                    PROPERTY_SUBSCRIPTION_START_BLOCK,
                    PROPERTY_ESCROW_START_BLOCK,
                    PROPERTY_SHUFFLING_BLOCK,
                    PROPERTY_MAX_DIVIDEND_PER_BLOCKS,
                    PROPERTY_MAX_ACCOUNTS_FOR_DIVIDEND_PAYMENT,
                    PROPERTY_ASSET_FULLDELETE_START_BLOCK,
                    PROPERTY_SUBSCRIPTION_MIN_FREQ,
                    PROPERTY_SUBSCRIPTION_MAX_FREQ,
                    PROPERTY_BLOCK_CHECKSUMS,
                    PROPERTY_LOCKED_BLOCK_MAX_VALUE,
                    PROPERTY_BAD_BLOCK_MAX_HEIGHT,
                    PROPERTY_ROLLBACK_TAG,
                    PROPERTY_ROLLBACK_HEIGHT,
                    PROPERTY_ROLLBACK_BLOCK,
                    PROPERTY_SINGLE_DIVIDEND_PAYMENT_PER_BLOCK_BLOCK,
                    PROPERTY_INCREASED_DIVI_PAYMENT_BLOCK,
                    PROPERTY_SHUFFLING_ACTIVATION_BLOCK,
                    PROPERTY_PRUNABLE_MESSAGES_BLOCK,
                    PROPERTY_CROWD_FUNDING_BLOCK,
                    PROPERTY_FUNDING_MONITOR_BLOCK
            );

    private static final Map<String, Object> TESTNET_PROPERTIES = ImmutableMap.<String, Object>builder()
            .put(PROPERTY_CREATOR_ID, "9816658139650642618")
            .put(PROPERTY_GENESIS_BLOCK_ID, "2537533802978479559")
            .put(PROPERTY_CREATOR_PUBLIC_KEY, new byte[]{
                    -21, -79, -43, -128, 4, 47, -34, 42, -108, 80, -74, 118, -7, -1, -88, 39, -47, 92, -49,
                    76, -94, 56,
                    16, -86, -20, -123, -97, -53, 112, 14, -28, 8
            })
            .put(PROPERTY_GENESIS_SIGNATURES,
                    new byte[][]{{-7, -66, 76, -50, 69, -78, 13, 21, -125, 46, -98, -83, -46, -84, 71, 126, 16, 28, 61,
                            113, 117,
                            58, 113, 8, -128, -81, -72, -29, 104, -118, 42, 10, -126, -106, 69, -17, -27, -76, -91, 83,
                            38, 52,
                            -103, 108, 92, -97, 66, -39, -25, -11, 107, 61, 123, -80, -11, 127, -78, 31, -67, -69, -11,
                            -91,
                            -43, -66
                    }, {104, -3, 43, -4, -47, 102, 72, -74, -12, -128, 12, 98, 105, 97, -37, -45, -79, 41, 50,
                            89, 30,
                            -120, -76, -127, 36, -36, -32, -48, -43, -124, -117, 2, 74, -50, 85, -61, 51, -6, -101, 68,
                            64, -27,
                            -7, -55, 13, -85, -17, -80, 32, 97, 5, 57, 54, -76, 55, 31, 123, -80, 109, 59, 119, 28, 56,
                            -31}})
            .put(PROPERTY_GENESIS_BLOCK_SIGNATURE, new byte[]{
                    52, -64, -51, -114, -41, 102, -15, 126, -56, 95, 126, 50, 76, -128, -36, -61, 5, 26, 73, 82,
                    -7,
                    101, -64, 65, 17, 58, 60, 56, -90, -93, -109, 4, 35, -42, 104, 76, -34, 41, 67, 109, -54,
                    -57, -84,
                    31, -58, -47, -35, -70, -2, 87, 94, 9, -82, -10, 86, -80, -38, 82, -13, -127, -108, 119,
                    106, 16
            })
            .put(PROPERTY_GENESIS_AMOUNTS, new long[]{
                    4500000000L,
                    4500000000L
            })
            .put(PROPERTY_GENESIS_RECIPIENTS, new long[]{
                    Long.parseUnsignedLong("16388043638115838282"),
                    Long.parseUnsignedLong("9166403121853243813")
            })
            .put(PROPERTY_LAST_KNOWN_BLOCK_HEIGHT, 0)
            .put(PROPERTY_LOCKED_BLOCK_MAX_VALUE, 1)
            .put(PROPERTY_AUTOMATED_TRANSACTION_BLOCK, 1)
            .put(PROPERTY_SUBSCRIPTION_START_BLOCK, 1)
            .put(PROPERTY_ESCROW_START_BLOCK, 1)
            .put(PROPERTY_BAD_BLOCK_MAX_HEIGHT, 0)
            .put(PROPERTY_SHUFFLING_BLOCK, 1)
            .put(PROPERTY_INCREASED_DIVI_PAYMENT_BLOCK, 1)
            .put(PROPERTY_ROLLBACK_TAG, false)
            .put(PROPERTY_ROLLBACK_HEIGHT, 0)
            .put(PROPERTY_ROLLBACK_BLOCK, "0")
            .put(PROPERTY_SINGLE_DIVIDEND_PAYMENT_PER_BLOCK_BLOCK, 1)
            .put(PROPERTY_MAX_DIVIDEND_PER_BLOCKS, 1)
            .put(PROPERTY_MAX_ACCOUNTS_FOR_DIVIDEND_PAYMENT, 50000)
            .put(PROPERTY_ASSET_FULLDELETE_START_BLOCK, 1)
            .put(PROPERTY_SUBSCRIPTION_MIN_FREQ, 5)
            .put(PROPERTY_SUBSCRIPTION_MAX_FREQ, 31536000)
            .put(PROPERTY_SHUFFLING_ACTIVATION_BLOCK, 1)
            .put(PROPERTY_PRUNABLE_MESSAGES_BLOCK, 1)
            .put(PROPERTY_CROWD_FUNDING_BLOCK, 1)
            .put(PROPERTY_FUNDING_MONITOR_BLOCK, 1)
            .put(PROPERTY_BLOCK_CHECKSUMS, ImmutableMap.<Integer, BlockChecksum>builder()
                    .build())
            .build();

    private static final Map<String, Object> MAINNET_PROPERTIES = ImmutableMap.<String, Object>builder()
            .put(PROPERTY_CREATOR_ID, "16362770385693468241")
            .put(PROPERTY_GENESIS_BLOCK_ID, "5886376434652814108")
            .put(PROPERTY_CREATOR_PUBLIC_KEY, new byte[]{
                    87, 60, -29, 27, -121, 26, -65, 50, -11, -36, -23, 37, 98, 21, 63, -16, 53, -124, 71, -95, 113, -95,
                    93, -111, 97, 83, -40, 76, 1, -107, -29, 122
            })
            .put(PROPERTY_GENESIS_SIGNATURES,
                    new byte[][]{
                            {-7, -66, 76, -50, 69, -78, 13, 21, -125, 46, -98, -83, -46, -84, 71, 126, 16, 28, 61, 113,
                                    117, 58, 113, 8, -128, -81, -72, -29, 104, -118, 42, 10, -126, -106, 69, -17, -27,
                                    -76, -91, 83, 38, 52, -103, 108, 92, -97, 66, -39, -25, -11, 107, 61, 123, -80, -11,
                                    127, -78, 31, -67, -69, -11, -91, -43, -66
                            },
                            {104, -3, 43, -4, -47, 102, 72, -74, -12, -128, 12, 98, 105, 97, -37, -45, -79, 41, 50, 89,
                                    30, -120, -76, -127, 36, -36, -32, -48, -43, -124, -117, 2, 74, -50, 85, -61, 51,
                                    -6, -101, 68, 64, -27, -7, -55, 13, -85, -17, -80, 32, 97, 5, 57, 54, -76, 55, 31,
                                    123, -80, 109, 59, 119, 28, 56, -31}})
            .put(PROPERTY_GENESIS_BLOCK_SIGNATURE, new byte[]{
                    52, -64, -51, -114, -41, 102, -15, 126, -56, 95, 126, 50, 76, -128, -36, -61, 5, 26, 73, 82, -7,
                    101, -64, 65, 17, 58, 60, 56, -90, -93, -109, 4, 35, -42, 104, 76, -34, 41, 67, 109, -54, -57, -84,
                    31, -58, -47, -35, -70, -2, 87, 94, 9, -82, -10, 86, -80, -38, 82, -13, -127, -108, 119, 106, 16
            })
            .put(PROPERTY_GENESIS_AMOUNTS, new long[]{
                    8100000000L,
                    900000000L
            })
            .put(PROPERTY_GENESIS_RECIPIENTS, new long[]{
                    Long.parseUnsignedLong("14982570416172345443"),
                    Long.parseUnsignedLong("15099862080523557957")
            })
            .put(PROPERTY_LAST_KNOWN_BLOCK_HEIGHT, 600000)
            .put(PROPERTY_BAD_BLOCK_MAX_HEIGHT, 0)
            .put(PROPERTY_MAX_DIVIDEND_PER_BLOCKS, 43200)
            .put(PROPERTY_MAX_ACCOUNTS_FOR_DIVIDEND_PAYMENT, 5000)
            .put(PROPERTY_SUBSCRIPTION_MIN_FREQ, 86400)
            .put(PROPERTY_SUBSCRIPTION_MAX_FREQ, 31536000)
            .put(PROPERTY_ROLLBACK_TAG, false)
            .put(PROPERTY_ROLLBACK_HEIGHT, 0)
            .put(PROPERTY_ROLLBACK_BLOCK, "0")
            .put(PROPERTY_SHUFFLING_BLOCK, 1)
            .put(PROPERTY_INCREASED_DIVI_PAYMENT_BLOCK, 655230)
            .put(PROPERTY_SINGLE_DIVIDEND_PAYMENT_PER_BLOCK_BLOCK, 655230)
            .put(PROPERTY_LOCKED_BLOCK_MAX_VALUE, 655230)
            .put(PROPERTY_PRUNABLE_MESSAGES_BLOCK, 655230)
            .put(PROPERTY_CROWD_FUNDING_BLOCK, 655230)
            .put(PROPERTY_FUNDING_MONITOR_BLOCK, 655230)
            .put(PROPERTY_SHUFFLING_ACTIVATION_BLOCK, 665400)
            .put(PROPERTY_SUBSCRIPTION_START_BLOCK, 675480)
            .put(PROPERTY_ESCROW_START_BLOCK, 685560)
            .put(PROPERTY_AUTOMATED_TRANSACTION_BLOCK, 695640)
            .put(PROPERTY_ASSET_FULLDELETE_START_BLOCK, Integer.MAX_VALUE)
            .put(PROPERTY_BLOCK_CHECKSUMS, ImmutableMap.<Integer, BlockChecksum>builder()
                    .put(100000, new BlockChecksum(0, 100000, new byte[]{
                            -77, 8, 37, 48, -73, 103, 71, 25, 97, -117, 116, 85, -110, -1, 87, 22, -104, 43, -128, 77,
                            41, -64, 9, -58, -85, 65, 31, 124, -101, 77, -97, -51
                    }))
                    .put(200000, new BlockChecksum(100000, 200000, new byte[]{
                            106, 16, 32, -75, -126, 99, 61, 96, -49, 26, 14, -106, 47, 18, 72, -3, 85, 57, -20, -121,
                            60, 56, -82, 54, 76, 7, 2, 50, -26, -110, 88, -97
                    }))
                    .put(300000, new BlockChecksum(200000, 300000, new byte[]{
                            13, 64, -96, -17, -67, -112, 38, 114, -109, 66, 73, 0, -98, 35, -106, -100, 69, 105, -35,
                            -64, -33, -76, -118, 100, 90, -89, -13, -126, -12, 69, -69, -113
                    }))
                    .put(400000, new BlockChecksum(300000, 400000, new byte[]{
                            -23, 57, -25, 67, 79, -89, 2, 76, 54, -121, 84, 26, 76, -117, -31, 49, -44, 56, 2, -31,
                            -116, 85, -31, -76, -34, -9, 62, 92, 3, -108, -30, -48
                    }))
                    .put(500000, new BlockChecksum(400000, 500000, new byte[]{
                            -62, -112, -58, 57, 123, -24, -27, 25, -56, 67, 37, 59, 58, 119, -105, -119, 120, -106,
                            -119, -11, -128, -9, -108, -121, -13, 101, -92, 70, 40, 106, 25, 26
                    }))
                    .put(600000, new BlockChecksum(500000, 600000, new byte[]{
                            19, 124, 102, -44, 113, 97, 92, -123, 53, -107, -29, -32, -42, 89, -61, 123, -108, 13,
                            34, 115, 91, -72, -92, -71, -115, 88, -102, -61, -53, 14, 73, -55
                    })).build()

            )
            .build();

    private static final Map<String, Object> DEVNET_PROPERTIES = ImmutableMap.<String, Object>builder()
            .put(PROPERTY_CREATOR_ID, "9816658139650642618")
            .put(PROPERTY_GENESIS_BLOCK_ID, "2537533802978479559")
            .put(PROPERTY_CREATOR_PUBLIC_KEY, new byte[]{
                    -21, -79, -43, -128, 4, 47, -34, 42, -108, 80, -74, 118, -7, -1, -88, 39, -47, 92, -49,
                    76, -94, 56,
                    16, -86, -20, -123, -97, -53, 112, 14, -28, 8
            })
            .put(PROPERTY_GENESIS_SIGNATURES,
                    new byte[][]{{-7, -66, 76, -50, 69, -78, 13, 21, -125, 46, -98, -83, -46, -84, 71, 126, 16, 28, 61,
                            113, 117,
                            58, 113, 8, -128, -81, -72, -29, 104, -118, 42, 10, -126, -106, 69, -17, -27, -76, -91, 83,
                            38, 52,
                            -103, 108, 92, -97, 66, -39, -25, -11, 107, 61, 123, -80, -11, 127, -78, 31, -67, -69, -11,
                            -91,
                            -43, -66
                    }, {104, -3, 43, -4, -47, 102, 72, -74, -12, -128, 12, 98, 105, 97, -37, -45, -79, 41, 50,
                            89, 30,
                            -120, -76, -127, 36, -36, -32, -48, -43, -124, -117, 2, 74, -50, 85, -61, 51, -6, -101, 68,
                            64, -27,
                            -7, -55, 13, -85, -17, -80, 32, 97, 5, 57, 54, -76, 55, 31, 123, -80, 109, 59, 119, 28, 56,
                            -31}})
            .put(PROPERTY_GENESIS_BLOCK_SIGNATURE, new byte[]{
                    52, -64, -51, -114, -41, 102, -15, 126, -56, 95, 126, 50, 76, -128, -36, -61, 5, 26, 73, 82,
                    -7,
                    101, -64, 65, 17, 58, 60, 56, -90, -93, -109, 4, 35, -42, 104, 76, -34, 41, 67, 109, -54,
                    -57, -84,
                    31, -58, -47, -35, -70, -2, 87, 94, 9, -82, -10, 86, -80, -38, 82, -13, -127, -108, 119,
                    106, 16
            })
            .put(PROPERTY_GENESIS_AMOUNTS, new long[]{
                    4500000000L,
                    4500000000L
            })
            .put(PROPERTY_GENESIS_RECIPIENTS, new long[]{
                    Long.parseUnsignedLong("16388043638115838282"),
                    Long.parseUnsignedLong("9166403121853243813")
            })
            .put(PROPERTY_LAST_KNOWN_BLOCK_HEIGHT, 0)
            .put(PROPERTY_LOCKED_BLOCK_MAX_VALUE, 1)
            .put(PROPERTY_AUTOMATED_TRANSACTION_BLOCK, 1)
            .put(PROPERTY_SUBSCRIPTION_START_BLOCK, 1)
            .put(PROPERTY_ESCROW_START_BLOCK, 1)
            .put(PROPERTY_BAD_BLOCK_MAX_HEIGHT, 0)
            .put(PROPERTY_SHUFFLING_BLOCK, 1)
            .put(PROPERTY_INCREASED_DIVI_PAYMENT_BLOCK, 1)
            .put(PROPERTY_ROLLBACK_TAG, false)
            .put(PROPERTY_ROLLBACK_HEIGHT, 0)
            .put(PROPERTY_ROLLBACK_BLOCK, "0")
            .put(PROPERTY_SINGLE_DIVIDEND_PAYMENT_PER_BLOCK_BLOCK, 1)
            .put(PROPERTY_MAX_DIVIDEND_PER_BLOCKS, 1)
            .put(PROPERTY_MAX_ACCOUNTS_FOR_DIVIDEND_PAYMENT, 50000)
            .put(PROPERTY_ASSET_FULLDELETE_START_BLOCK, 1)
            .put(PROPERTY_SUBSCRIPTION_MIN_FREQ, 5)
            .put(PROPERTY_SUBSCRIPTION_MAX_FREQ, 31536000)
            .put(PROPERTY_SHUFFLING_ACTIVATION_BLOCK, 1)
            .put(PROPERTY_CROWD_FUNDING_BLOCK, 1)
            .put(PROPERTY_FUNDING_MONITOR_BLOCK, 1)
            .put(PROPERTY_PRUNABLE_MESSAGES_BLOCK, 1)
            .put(PROPERTY_BLOCK_CHECKSUMS, ImmutableMap.<Integer, BlockChecksum>builder()
                    .build())
            .build();

    private static Map<String, Object> getCurrentProperties() {
        String environment = Xin.getStringProperty("xin.env");
        if (StringUtils.isEmpty(environment)) {
            return MAINNET_PROPERTIES;
        }
        if (environment.equalsIgnoreCase("mainnet")) {
            return MAINNET_PROPERTIES;
        }
        if (environment.equalsIgnoreCase("testnet")) {
            return TESTNET_PROPERTIES;
        }
        if (environment.equalsIgnoreCase("devnet")) {
            return DEVNET_PROPERTIES;
        }
        return MAINNET_PROPERTIES;
    }

    public static Object getProperty(String name) {
        Map<String, Object> currentMap = getCurrentProperties();
        if (!ENVIRONMENT_DIFFER_PROPERTY_NAMES.contains(name)) {
            throw new XinException.StopException("required property " + name + " is not in required list");
        }
        if (currentMap.containsKey(name)) {
            return currentMap.get(name);
        }
        throw new XinException.StopException("required property " + name + " not conffigured. Please check");
    }

    public static int getIntProperty(String name) {
        Object value = getProperty(name);
        if (NumberUtils.isNumber(value.toString())) {
            return NumberUtils.createInteger(value.toString());
        }
        throw new XinException.StopException("required property " + name + " is not a valid integer");
    }

    public static long getLongProperty(String name) {
        Object value = getProperty(name);
        if (NumberUtils.isNumber(value.toString())) {
            return NumberUtils.createLong(value.toString());
        }
        throw new XinException.StopException("required property " + name + " is not a valid integer");
    }

    public static byte[] getByteArray(String name) {
        Object value = getProperty(name);
        return (byte[]) value;
    }


}
