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

package xin;

import java.lang.invoke.ConstantCallSite;
import java.util.Arrays;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang.ArrayUtils;
import xin.XinException.NotValidException;

import xin.util.Convert;

public class Locked {

    private static int LOCKED_BLOCK_MAX_VALUE = Constants.LOCKED_BLOCK_MAX_VALUE; 
    private static byte[][] locked_max_value_sender_keys = null;

    static {
        locked_max_value_sender_keys = new byte[CollectionUtils.size(Constants.LOCKED_ACCOUNTS_PUBLIC_KEYS)][];
        if (CollectionUtils.isNotEmpty(Constants.LOCKED_ACCOUNTS_PUBLIC_KEYS)) {
            for (int j = 0; j < CollectionUtils.size(Constants.LOCKED_ACCOUNTS_PUBLIC_KEYS); j++) {
                locked_max_value_sender_keys[j] = Convert.parseHexString(Constants.LOCKED_ACCOUNTS_PUBLIC_KEYS.get(j));
            }
        }
    }

    private static boolean hit(byte[] senderPublickey) {
        for (int i = 0; i < locked_max_value_sender_keys.length; i++) {
            if (Arrays.equals(senderPublickey, locked_max_value_sender_keys[i])) {
                return true;
            }
        }
        return false;
    }

    public static void test(int height, byte[] senderPublickey) throws NotValidException {
        if (height > LOCKED_BLOCK_MAX_VALUE && hit(senderPublickey)) {
            throw new XinException.NotValidException("Public key locked for outgoing transactions");
        }
    }

    public static boolean allowedToForge(byte[] senderPublickey) {
        return hit(senderPublickey) == false;
    }

}
