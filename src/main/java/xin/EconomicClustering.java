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

public final class EconomicClustering {

    private static final Blockchain blockchain = BlockchainImpl.getInstance();

    public static Block getECBlock(int timestamp) {
        Block block = blockchain.getLastBlock();
        if (timestamp < block.getTimestamp() - Constants.MAX_TIMEDRIFT) {
            throw new IllegalArgumentException("Timestamp cannot be more than 15 s earlier than last block timestamp: " + block.getTimestamp());
        }
        int distance = 0;
        while (block.getTimestamp() > timestamp - Constants.EC_RULE_TERMINATOR && distance < Constants.EC_BLOCK_DISTANCE_LIMIT) {
            block = blockchain.getBlock(block.getPreviousBlockId());
            distance += 1;
        }
        return block;
    }

    public static boolean verifyFork(Transaction transaction) {
        if (transaction.getReferencedTransactionFullHash() != null) {
            return true;
        }
        if (blockchain.getHeight() - transaction.getECBlockHeight() > Constants.EC_BLOCK_DISTANCE_LIMIT) {
            return false;
        }
        Block ecBlock = blockchain.getBlock(transaction.getECBlockId());
        return ecBlock != null && ecBlock.getHeight() == transaction.getECBlockHeight();
    }

}
