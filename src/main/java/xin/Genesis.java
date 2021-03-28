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

package xin;

public final class Genesis {

    public static final long GENESIS_BLOCK_ID = Long.parseUnsignedLong(
            (String) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_GENESIS_BLOCK_ID));
    public static final long CREATOR_ID = Long.parseUnsignedLong(
            (String) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_CREATOR_ID));

    public static final byte[] CREATOR_PUBLIC_KEY =
            (byte[]) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_CREATOR_PUBLIC_KEY);

    public static final long[] GENESIS_RECIPIENTS =
            (long[]) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_GENESIS_RECIPIENTS);

    public static final long[] GENESIS_AMOUNTS =
            (long[]) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_GENESIS_AMOUNTS);

    public static final byte[][] GENESIS_SIGNATURES =
            (byte[][]) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_GENESIS_SIGNATURES);

    public static final byte[] GENESIS_BLOCK_SIGNATURE =
            (byte[]) ConstantsConfigHelper.getProperty(ConstantsConfigHelper.PROPERTY_GENESIS_BLOCK_SIGNATURE);

    private Genesis() {
    } // never

}
