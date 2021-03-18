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

package xin.util;

import org.apache.log4j.Level;
import xin.Xin;
import xin.env.RuntimeEnvironment;

import java.util.Properties;

/**
 * Handle logging for the xin node server
 */
public final class Logger {

    /**
     * Log event types
     */
    public enum Event {
        MESSAGE, EXCEPTION
    }

    /**
     * Log levels
     */
    public enum Level {
        DEBUG, INFO, WARN, ERROR
    }

    /**
     * Message listeners
     */
    private static final Listeners<String, Event> messageListeners = new Listeners<>();

    /**
     * Exception listeners
     */
    private static final Listeners<Throwable, Event> exceptionListeners = new Listeners<>();

    /**
     * Our logger instance
     */
    private static final org.slf4j.Logger log;

    /**
     * Enable stack traces
     */
    private static final boolean enableStackTraces;

    /**
     * Enable log traceback
     */
    private static final boolean enableLogTraceback;

    /**
     * No constructor
     */
    private Logger() {
    }

    /**
     * Logger initialization
     *
     * The existing Java logging configuration will be used if the Java logger has already
     * been initialized.  Otherwise, we will configure our own log manager and log handlers.
     * The xin/conf/log4j.properties and xin/conf/log4j.properties configuration
     * files will be used.  Entries in logging.properties will override entries in
     * logging.properties.
     */

    static {
        Properties logginProperites = Xin.loadProperties(new Properties(), "log4j.properties", true);
        RuntimeEnvironment.getDirProvider().updateLogFileHandler(logginProperites);
        log = org.slf4j.LoggerFactory.getLogger(Xin.class);
        enableStackTraces = Xin.getBooleanProperty("xin.enableStackTraces");
        enableLogTraceback = Xin.getBooleanProperty("xin.enableLogTraceback");
        logInfoMessage("logging enabled");
    }

    /**
     * Logger initialization
     */
    public static void init() {
    }

    /**
     * Logger shutdown
     */
    public static void shutdown() {

    }

    /**
     * Set the log level
     *
     * @param level Desired log level
     */
    public static void setLevel(Level level) {
        org.apache.log4j.Logger log4jLogger = org.apache.log4j.Logger.getLogger(log.getName());
        switch (level) {
            case DEBUG:
                log4jLogger.setLevel(org.apache.log4j.Level.DEBUG);
                break;
            case INFO:
                log4jLogger.setLevel(org.apache.log4j.Level.INFO);
                break;
            case WARN:
                log4jLogger.setLevel(org.apache.log4j.Level.WARN);
                break;
            case ERROR:
                log4jLogger.setLevel(org.apache.log4j.Level.ERROR);
                break;
        }
    }

    /**
     * Add a message listener
     *
     * @param listener  Listener
     * @param eventType Notification event type
     * @return TRUE if listener added
     */
    public static boolean addMessageListener(Listener<String> listener, Event eventType) {
        return messageListeners.addListener(listener, eventType);
    }

    /**
     * Add an exception listener
     *
     * @param listener  Listener
     * @param eventType Notification event type
     * @return TRUE if listener added
     */
    public static boolean addExceptionListener(Listener<Throwable> listener, Event eventType) {
        return exceptionListeners.addListener(listener, eventType);
    }

    /**
     * Remove a message listener
     *
     * @param listener  Listener
     * @param eventType Notification event type
     * @return TRUE if listener removed
     */
    public static boolean removeMessageListener(Listener<String> listener, Event eventType) {
        return messageListeners.removeListener(listener, eventType);
    }

    /**
     * Remove an exception listener
     *
     * @param listener  Listener
     * @param eventType Notification event type
     * @return TRUE if listener removed
     */
    public static boolean removeExceptionListener(Listener<Throwable> listener, Event eventType) {
        return exceptionListeners.removeListener(listener, eventType);
    }

    /**
     * Log a message (map to INFO)
     *
     * @param message Message
     */
    public static void logMessage(String message) {
        doLog(Level.INFO, message, null);
    }

    /**
     * Log an exception (map to ERROR)
     *
     * @param message Message
     * @param exc     Exception
     */
    public static void logMessage(String message, Exception exc) {
        doLog(Level.ERROR, message, exc);
    }

    public static void logShutdownMessage(String message) {
        logMessage(message);

    }

    public static void logShutdownMessage(String message, Exception e) {
        logMessage(message, e);

    }

    public static boolean isErrorEnabled() {
        return log.isErrorEnabled();
    }

    /**
     * Log an ERROR message
     *
     * @param message Message
     */
    public static void logErrorMessage(String message) {
        doLog(Level.ERROR, message, null);
    }

    /**
     * Log an ERROR exception
     *
     * @param message Message
     * @param exc     Exception
     */
    public static void logErrorMessage(String message, Throwable exc) {
        doLog(Level.ERROR, message, exc);
    }

    public static boolean isWarningEnabled() {
        return log.isWarnEnabled();
    }

    /**
     * Log a WARNING message
     *
     * @param message Message
     */
    public static void logWarningMessage(String message) {
        doLog(Level.WARN, message, null);
    }

    /**
     * Log a WARNING exception
     *
     * @param message Message
     * @param exc     Exception
     */
    public static void logWarningMessage(String message, Throwable exc) {
        doLog(Level.WARN, message, exc);
    }

    public static boolean isInfoEnabled() {
        return log.isInfoEnabled();
    }

    /**
     * Log an INFO message
     *
     * @param message Message
     */
    public static void logInfoMessage(String message) {
        doLog(Level.INFO, message, null);
    }

    /**
     * Log an INFO message
     *
     * @param format Message format
     * @param args   Message args
     */
    public static void logInfoMessage(String format, Object... args) {
        doLog(Level.INFO, String.format(format, args), null);
    }

    /**
     * Log an INFO exception
     *
     * @param message Message
     * @param exc     Exception
     */
    public static void logInfoMessage(String message, Throwable exc) {
        doLog(Level.INFO, message, exc);
    }

    public static boolean isDebugEnabled() {
        return log.isDebugEnabled();
    }

    /**
     * Log a debug message
     *
     * @param message Message
     */
    public static void logDebugMessage(String message) {
        doLog(Level.DEBUG, message, null);
    }

    /**
     * Log a debug message
     *
     * @param format Message format
     * @param args   Message args
     */
    public static void logDebugMessage(String format, Object... args) {
        doLog(Level.DEBUG, String.format(format, args), null);
    }

    /**
     * Log a debug exception
     *
     * @param message Message
     * @param exc     Exception
     */
    public static void logDebugMessage(String message, Throwable exc) {
        doLog(Level.DEBUG, message, exc);
    }

    /**
     * Log the event
     *
     * @param level   Level
     * @param message Message
     * @param exc     Exception
     */
    private static void doLog(Level level, String message, Throwable exc) {
        String logMessage = message;
        Throwable e = exc;
        //
        // Add caller class and method if enabled
        //
        if (enableLogTraceback) {
            StackTraceElement caller = Thread.currentThread().getStackTrace()[3];
            String className = caller.getClassName();
            int index = className.lastIndexOf('.');
            if (index != -1)
                className = className.substring(index + 1);
            logMessage = className + "." + caller.getMethodName() + ": " + logMessage;
        }
        //
        // Format the stack trace if enabled
        //
        if (e != null) {
            if (!enableStackTraces) {
                logMessage = logMessage + "\n" + exc.toString();
                e = null;
            }
        }
        //
        // Log the event
        //
        switch (level) {
            case DEBUG:
                log.debug(logMessage, e);
                break;
            case INFO:
                log.info(logMessage, e);
                break;
            case WARN:
                log.warn(logMessage, e);
                break;
            case ERROR:
                log.error(logMessage, e);
                break;
        }
        //
        // Notify listeners
        //
        if (exc != null)
            exceptionListeners.notify(exc, Event.EXCEPTION);
        else
            messageListeners.notify(message, Event.MESSAGE);
    }
}
