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

import java.io.IOException;

public abstract class XinException extends Exception {

    protected XinException() {
        super();
    }

    protected XinException(String message) {
        super(message);
    }

    protected XinException(String message, Throwable cause) {
        super(message, cause);
    }

    protected XinException(Throwable cause) {
        super(cause);
    }

    public static abstract class ValidationException extends XinException {

        private ValidationException(String message) {
            super(message);
        }

        private ValidationException(String message, Throwable cause) {
            super(message, cause);
        }

    }

    public static class NotCurrentlyValidException extends ValidationException {

        public NotCurrentlyValidException(String message) {

            super(message);

        }

        public NotCurrentlyValidException(String message, Throwable cause) {

            super(message, cause);

        }

    }

    public static class ExistingTransactionException extends NotCurrentlyValidException {

        public ExistingTransactionException(String message) {
            super(message);
        }

    }

    public static final class NotYetEnabledException extends NotCurrentlyValidException {

        public NotYetEnabledException(String message) {
            super(message);
        }

        public NotYetEnabledException(String message, Throwable throwable) {
            super(message, throwable);
        }

    }

    public static final class NotValidException extends ValidationException {

        public NotValidException(String message) {
            super(message);
        }

        public NotValidException(String message, Throwable cause) {
            super(message, cause);
        }

    }

    public static class AccountControlException extends NotCurrentlyValidException {

        public AccountControlException(String message) {
            super(message);
        }

        public AccountControlException(String message, Throwable cause) {
            super(message, cause);
        }

    }

    public static class InsufficientBalanceException extends NotCurrentlyValidException {

        public InsufficientBalanceException(String message) {
            super(message);
        }

        public InsufficientBalanceException(String message, Throwable cause) {
            super(message, cause);
        }

    }

    public static final class NotYetEncryptedException extends IllegalStateException {

        public NotYetEncryptedException(String message) {
            super(message);
        }

        public NotYetEncryptedException(String message, Throwable cause) {
            super(message, cause);
        }

    }

    public static final class StopException extends RuntimeException {

        public StopException(String message) {
            super(message);
        }

        public StopException(String message, Throwable cause) {
            super(message, cause);
        }

    }

    public static final class XinIOException extends IOException {

        public XinIOException(String message) {
            super(message);
        }

        public XinIOException(String message, Throwable cause) {
            super(message, cause);
        }

    }

    public static class XinProxyServiceException extends RuntimeException {
        public XinProxyServiceException() {
        }

        public XinProxyServiceException(String message) {
            super(message);
        }

        public XinProxyServiceException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    public static class XinGatewayServiceException extends RuntimeException {
        public XinGatewayServiceException() {
        }

        public XinGatewayServiceException(String message) {
            super(message);
        }

        public XinGatewayServiceException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    public static class XinStorageException extends RuntimeException {
        public XinStorageException() {
        }

        public XinStorageException(String message) {
            super(message);
        }

        public XinStorageException(String message, Throwable cause) {
            super(message, cause);
        }
    }

}
