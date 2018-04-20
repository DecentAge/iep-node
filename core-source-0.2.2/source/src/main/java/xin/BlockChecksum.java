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

public class BlockChecksum {

    private int from;
    private int to;
    private byte[] checksum;

    public BlockChecksum(int from, int to, byte[] checksum) {
        this.from = from;
        this.to = to;
        this.checksum = checksum;
    }

    public int getFrom() {
        return from;
    }

    public int getTo() {
        return to;
    }

    public byte[] getChecksum() {
        return checksum;
    }
}
