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

package xin.crypto;

public enum HashFunction {

    /**
     * Use Java implementation of SHA256 (code 2)
     */
    SHA256((byte) 2) {
        public byte[] hash(byte[] input) {
            return Crypto.sha256().digest(input);
        }
    },
    /**
     * Use Bouncy Castle implementation of SHA3 (code 3). As of Bouncy Castle 1.53, this has been renamed to Keccak.
     */
    SHA3((byte) 3) {
        public byte[] hash(byte[] input) {
            return Crypto.sha3().digest(input);
        }
    },
    /**
     * Use Java implementation of Scrypt
     */
    SCRYPT((byte) 5) {
        public byte[] hash(byte[] input) {
            return threadLocalScrypt.get().hash(input);
        }
    },
    /**
     * Use proprietary token implementation of Keccak with 25 rounds (code 25)
     */
    Keccak25((byte) 25) {
        public byte[] hash(byte[] input) {
            return KNV25.hash(input);
        }
    },
    RIPEMD160((byte) 6) {
        public byte[] hash(byte[] input) {
            return Crypto.ripemd160().digest(input);
        }
    },
    RIPEMD160_SHA256((byte) 62) {
        public byte[] hash(byte[] input) {
            return Crypto.ripemd160().digest(Crypto.sha256().digest(input));
        }
    };

    private static final ThreadLocal<Scrypt> threadLocalScrypt = new ThreadLocal<Scrypt>() {
        @Override
        protected Scrypt initialValue() {
            return new Scrypt();
        }
    };

    private final byte id;

    HashFunction(byte id) {
        this.id = id;
    }

    public static HashFunction getHashFunction(byte id) {
        for (HashFunction function : values()) {
            if (function.id == id) {
                return function;
            }
        }
        throw new IllegalArgumentException(String.format("illegal algorithm %d", id));
    }

    public byte getId() {
        return id;
    }

    public abstract byte[] hash(byte[] input);
}
