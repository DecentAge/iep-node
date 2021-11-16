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

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Properties;

import org.apache.log4j.LogManager;
import org.apache.log4j.PropertyConfigurator;
import org.slf4j.LoggerFactory;

import xin.Xin;

/**
 * Handle logging for the xin node server
 */
public final class Logger {

    public static final String LOG_FILE_PATTERN = "log4j.appender.file.File";
	
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
    private static org.slf4j.Logger log;

    /**
     * Enable stack traces
     */
    private static boolean enableStackTraces;

    /**
     * Enable log traceback
     */
    private static boolean enableLogTraceback;
    
    /**
     * The directory where the default appender logs to
     */
    private static File logFileDir;

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
    public static void init(String userHomeDir) {

        Properties logginProperites = Xin.loadProperties(new Properties(), "log4j.properties", false);
        updateLogFileHandler(logginProperites, userHomeDir);
        LogManager.resetConfiguration(); 
        PropertyConfigurator.configure(logginProperites); 
        log = LoggerFactory.getLogger(Xin.class);
        enableStackTraces = Xin.getBooleanProperty("xin.enableStackTraces");
        enableLogTraceback = Xin.getBooleanProperty("xin.enableLogTraceback");
        logInfoMessage("logging enabled");
        deleteDuplicateLogDir();

    }

    
    private static void updateLogFileHandler(Properties loggingProperties, String userHomeDir) {      
        File logFile = new File(userHomeDir, loggingProperties.getProperty(LOG_FILE_PATTERN));
        loggingProperties.setProperty(LOG_FILE_PATTERN, logFile.toString());
        
        logFileDir = logFile.getParentFile();
        System.out.printf("Logs dir %s\n", logFileDir.toString());

        if (!logFileDir.exists()) {
            try {
                Files.createDirectory(logFileDir.toPath());
            } catch (IOException e) {
                throw new IllegalArgumentException("Cannot create " + logFileDir, e);
            }
        }   
    }

    private static void deleteDuplicateLogDir() {
	    File duplicateLogsDir = new File(System.getProperty("user.dir"), "logs");
	    System.out.printf("duplicateLogsDir= %s\n", duplicateLogsDir);
		if(duplicateLogsDir.exists()) {
			System.out.printf("Deleting existing log dir %s\n", duplicateLogsDir);
			deleteDirectory(duplicateLogsDir);
		}     
    }
    
    private static boolean deleteDirectory(File directoryToBeDeleted) {
        File[] allContents = directoryToBeDeleted.listFiles();
        if (allContents != null) {
            for (File file : allContents) {
                deleteDirectory(file);
            }
        }
        return directoryToBeDeleted.delete();
    }
    
    /**
     * Logger initialization
     */
    /*public static void init() {
    }*/

    /**
     * Logger shutdown
     */
    public static void shutdown() {

    }

    public static File getLogFileDir() {
    	return logFileDir;
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
