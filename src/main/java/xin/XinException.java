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

	private static final long serialVersionUID = 55106508465134337L;

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

		private static final long serialVersionUID = -949826700299022594L;

		private ValidationException(String message) {
            super(message);
        }

        private ValidationException(String message, Throwable cause) {
            super(message, cause);
        }

    }

    public static class NotCurrentlyValidException extends ValidationException {

		private static final long serialVersionUID = 1905257104530139848L;

		public NotCurrentlyValidException(String message) {

            super(message);

        }

        public NotCurrentlyValidException(String message, Throwable cause) {

            super(message, cause);

        }

    }

    public static class ExistingTransactionException extends NotCurrentlyValidException {

		private static final long serialVersionUID = -3594929132940336037L;

		public ExistingTransactionException(String message) {
            super(message);
        }

    }

    public static final class NotYetEnabledException extends NotCurrentlyValidException {

    	private static final long serialVersionUID = 2959710293420494560L;

		public NotYetEnabledException(String message) {
            super(message);
        }

        public NotYetEnabledException(String message, Throwable throwable) {
            super(message, throwable);
        }

    }

    public static final class NotValidException extends ValidationException {

		private static final long serialVersionUID = -6560880516446605278L;

		public NotValidException(String message) {
            super(message);
        }

        public NotValidException(String message, Throwable cause) {
            super(message, cause);
        }

    }

    public static class AccountControlException extends NotCurrentlyValidException {

		private static final long serialVersionUID = 4525183047625895748L;

		public AccountControlException(String message) {
            super(message);
        }

        public AccountControlException(String message, Throwable cause) {
            super(message, cause);
        }

    }

    public static class InsufficientBalanceException extends NotCurrentlyValidException {

		private static final long serialVersionUID = -7775792875597014167L;

		public InsufficientBalanceException(String message) {
            super(message);
        }

        public InsufficientBalanceException(String message, Throwable cause) {
            super(message, cause);
        }

    }

    public static final class NotYetEncryptedException extends IllegalStateException {

		private static final long serialVersionUID = 6089208566655113266L;

		public NotYetEncryptedException(String message) {
            super(message);
        }

        public NotYetEncryptedException(String message, Throwable cause) {
            super(message, cause);
        }

    }

    public static final class StopException extends RuntimeException {

		private static final long serialVersionUID = 1605459065380812428L;

		public StopException(String message) {
            super(message);
        }

        public StopException(String message, Throwable cause) {
            super(message, cause);
        }

    }

    public static final class XinIOException extends IOException {

		private static final long serialVersionUID = -556535048921497315L;

		public XinIOException(String message) {
            super(message);
        }

        public XinIOException(String message, Throwable cause) {
            super(message, cause);
        }

    }

    public static class XinProxyServiceException extends RuntimeException {

    	private static final long serialVersionUID = 8954131005810763171L;

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

    	private static final long serialVersionUID = 7316720982666227227L;

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
    	
		private static final long serialVersionUID = 6619392358159243052L;

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
