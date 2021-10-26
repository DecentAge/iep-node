/*
 * Copyright © 2013-2016 The Xin Core Developers.
 * Copyright © 2016-2020 Jelurida IP B.V.
 *
 * See the LICENSE.txt file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with Jelurida B.V.,
 * no part of the Xin software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE.txt file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */

package xindesktop;

import javafx.application.Application;
import javafx.application.Platform;
import javafx.concurrent.Worker;
import javafx.geometry.Rectangle2D;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.FileChooser;
import javafx.stage.Screen;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import netscape.javascript.JSObject;
import xin.Block;
import xin.BlockchainProcessor;
import xin.Xin;
import xin.PrunableMessage;
//import xin.TaggedData;
import xin.Transaction;
import xin.TransactionProcessor;
import xin.api.API;
import xin.util.Convert;
import xin.util.Logger;
import xin.util.TrustAllSSLProvider;

import javax.net.ssl.HttpsURLConnection;
import java.awt.Desktop;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class DesktopApplication extends Application {

    private static final Set DOWNLOAD_REQUEST_TYPES = new HashSet<>(Arrays.asList("downloadTaggedData", "downloadPrunableMessage"));
    private static final boolean ENABLE_JAVASCRIPT_DEBUGGER = false;
    private static volatile boolean isLaunched;
    private static volatile Stage stage;
    private static volatile WebEngine webEngine;
    private JSObject nrs;
    private volatile long updateTime;
    private JavaScriptBridge javaScriptBridge;

    public static void launch() {
        if (!isLaunched) {
            isLaunched = true;
            Application.launch(DesktopApplication.class);
            return;
        }
        if (stage != null) {
            Platform.runLater(() -> showStage(false));
        }
    }

    @SuppressWarnings("unused")
    public static void refresh() {
        Platform.runLater(() -> showStage(true));
    }

    private static void showStage(boolean isRefresh) {
        if (isRefresh) {
            webEngine.load(getUrl());
        }
        if (!stage.isShowing()) {
            stage.show();
        } else if (stage.isIconified()) {
            stage.setIconified(false);
        } else {
            stage.toFront();
        }
    }

    public static void shutdown() {
        System.out.println("shutting down JavaFX platform");
        Platform.exit();
        if (ENABLE_JAVASCRIPT_DEBUGGER) {
            try {
                Class<?> aClass = Class.forName("com.mohamnag.fxwebview_debugger.DevToolsDebuggerServer");
                aClass.getMethod("stopDebugServer").invoke(null);
            } catch (Exception e) {
                Logger.logInfoMessage("Error shutting down webview debugger", e);
            }
        }
        System.out.println("JavaFX platform shutdown complete");
    }

    @Override
    public void start(Stage stage) {
        Thread.currentThread().setName("jfx");
        logJavaFxProperties();
        DesktopApplication.stage = stage;
        Rectangle2D primaryScreenBounds = Screen.getPrimary().getVisualBounds();
        WebView browser = new WebView();
        WebView invisible = new WebView();

        int height = (int) Math.min(primaryScreenBounds.getMaxY() - 100, 1000);
        int width = (int) Math.min(primaryScreenBounds.getMaxX() - 100, 1618);
        browser.setMinHeight(height);
        browser.setMinWidth(width);
        webEngine = browser.getEngine();
        webEngine.setUserDataDirectory(Xin.getConfDir());

        Worker<Void> loadWorker = webEngine.getLoadWorker();
        loadWorker.stateProperty().addListener(
                (ov, oldState, newState) -> {
                    Logger.logDebugMessage("loadWorker old state " + oldState + " new state " + newState);
                    if (newState != Worker.State.SUCCEEDED) {
                        Logger.logDebugMessage("loadWorker state change ignored");
                        return;
                    }
                    JSObject window = (JSObject)webEngine.executeScript("window");
                    javaScriptBridge = new JavaScriptBridge(this); // Must be a member variable to prevent gc
                    window.setMember("java", javaScriptBridge);
                    Locale locale = Locale.getDefault();
                    String language = locale.getLanguage().toLowerCase() + "-" + locale.getCountry().toUpperCase();
                    window.setMember("javaFxLanguage", language);
                    webEngine.executeScript("console.log = function(msg) { java.log(msg); };");
                    stage.setTitle("XIN Desktop - " + webEngine.getLocation());
                    nrs = (JSObject) webEngine.executeScript("NRS");
                    updateClientState("Desktop Wallet started");
                    BlockchainProcessor blockchainProcessor = Xin.getBlockchainProcessor();
                    blockchainProcessor.addListener(this::updateClientState, BlockchainProcessor.Event.BLOCK_PUSHED);
                    Xin.getTransactionProcessor().addListener(transaction ->
                            updateClientState(TransactionProcessor.Event.ADDED_UNCONFIRMED_TRANSACTIONS, transaction), TransactionProcessor.Event.ADDED_UNCONFIRMED_TRANSACTIONS);
                    Xin.getTransactionProcessor().addListener(transaction ->
                            updateClientState(TransactionProcessor.Event.REMOVED_UNCONFIRMED_TRANSACTIONS, transaction), TransactionProcessor.Event.REMOVED_UNCONFIRMED_TRANSACTIONS);

                    if (ENABLE_JAVASCRIPT_DEBUGGER) {
                        try {
                            // Add the javafx_webview_debugger and websocket-* test libs to the classpath
                            // For more details, check https://github.com/mohamnag/javafx_webview_debugger
                            Class<?> aClass = Class.forName("com.mohamnag.fxwebview_debugger.DevToolsDebuggerServer");
                            Class webEngineClazz = WebEngine.class;
                            Field debuggerField = webEngineClazz.getDeclaredField("debugger");
                            debuggerField.setAccessible(true);
                            Object debugger = debuggerField.get(webEngine);
                            //noinspection JavaReflectionMemberAccess
                            Method startDebugServer = aClass.getMethod("startDebugServer", debugger.getClass(), int.class);
                            startDebugServer.invoke(null, debugger, 51742);
                        } catch (NoSuchFieldException | ClassNotFoundException | NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                            Logger.logInfoMessage("Cannot start JavaFx debugger", e);
                        }
                    }
               });

        // Invoked by the webEngine popup handler
        // The invisible webView does not show the link, instead it opens a browser window
        invisible.getEngine().locationProperty().addListener((observable, oldValue, newValue) -> popupHandlerURLChange(newValue));

        // Invoked when changing the document.location property, when issuing a download request
        webEngine.locationProperty().addListener((observable, oldValue, newValue) -> webViewURLChange(newValue));

        // Invoked when clicking a link to external site like Help or API console
        webEngine.setCreatePopupHandler(
            config -> {
                Logger.logInfoMessage("popup request from webEngine");
                return invisible.getEngine();
            });

        webEngine.load(getUrl());

        Scene scene = new Scene(browser);
        String address = API.getServerRootUri().toString();
        stage.getIcons().add(new Image(address + "/img/xin-icon-32x32.png"));
        stage.initStyle(StageStyle.DECORATED);
        stage.setScene(scene);
        stage.sizeToScene();
        stage.show();
        Platform.setImplicitExit(false); // So that we can reopen the application in case the user closed it
    }

    private void updateClientState(Block block) {
        if (Xin.getBlockchainProcessor().isDownloading()) {
            if (System.currentTimeMillis() - updateTime < 10000L) {
                return;
            }
        }
        String msg = BlockchainProcessor.Event.BLOCK_PUSHED.toString() + " id " + block.getStringId() + " height " + block.getHeight();
        updateClientState(msg);
    }

    private void updateClientState(TransactionProcessor.Event transactionEvent, List<? extends Transaction> transactions) {
        if (System.currentTimeMillis() - updateTime > 3000L) {
            String msg = transactionEvent.toString() + " ids " + transactions.stream().map(Transaction::getStringId).collect(Collectors.joining(","));
            updateClientState(msg);
        }
    }

    private void updateClientState(String msg) {
        updateTime = System.currentTimeMillis();
        Platform.runLater(() -> webEngine.executeScript("NRS.getState(null, '" + msg + "')"));
    }

    private static String getUrl() {
        String url = API.getWelcomePageUri().toString();
        if (url.startsWith("https")) {
            HttpsURLConnection.setDefaultSSLSocketFactory(TrustAllSSLProvider.getSslSocketFactory());
            HttpsURLConnection.setDefaultHostnameVerifier(TrustAllSSLProvider.getHostNameVerifier());
        }
        String defaultAccount = Xin.getStringProperty("xin.defaultDesktopAccount");
        if (defaultAccount != null && !defaultAccount.equals("")) {
            url += "?account=" + defaultAccount;
        }
        return url;
    }

    @SuppressWarnings("WeakerAccess")
    public void popupHandlerURLChange(String newValue) {
        Logger.logInfoMessage("popup request for " + newValue);
        Platform.runLater(() -> {
            try {
                Desktop.getDesktop().browse(new URI(newValue));
            } catch (Exception e) {
                Logger.logInfoMessage("Cannot open " + newValue + " error " + e.getMessage());
            }
        });
    }

    private void webViewURLChange(String newValue) {
        Logger.logInfoMessage("webview address changed to " + newValue);
        URL url;
        try {
            url = new URL(newValue);
        } catch (MalformedURLException e) {
            Logger.logInfoMessage("Malformed URL " + newValue, e);
            return;
        }
        String query = url.getQuery();
        if (query == null) {
            return;
        }
        String[] paramPairs = query.split("&");
        Map<String, String> params = new HashMap<>();
        for (String paramPair : paramPairs) {
            String[] keyValuePair = paramPair.split("=");
            if (keyValuePair.length == 2) {
                params.put(keyValuePair[0], keyValuePair[1]);
            }
        }
        String requestType = params.get("requestType");
        if (DOWNLOAD_REQUEST_TYPES.contains(requestType)) {
            download(requestType, params);
        } else {
            Logger.logInfoMessage(String.format("requestType %s is not a download request", requestType));
        }
    }

    private void download(String requestType, Map<String, String> params) {
        long transactionId = Convert.parseUnsignedLong(params.get("transaction"));
        boolean retrieve = "true".equals(params.get("retrieve"));
        /*
         TaggedData taggedData = TaggedData.getData(transactionId)
        if (requestType.equals("downloadTaggedData")) {
            if (taggedData == null && retrieve) {
                try {
                    if (Xin.getBlockchainProcessor().restorePrunedTransaction(transactionId) == null) {
                        growl("Pruned transaction data not currently available from any peer");
                        return;
                    }
                } catch (IllegalArgumentException e) {
                    growl("Pruned transaction data cannot be restored using desktop wallet without full blockchain. Use Web Wallet instead");
                    return;
                }
                taggedData = TaggedData.getData(transactionId);
            }
            if (taggedData == null) {
                growl("Tagged data not found");
                return;
            }
            byte[] data = taggedData.getData();
            String filename = taggedData.getFilename();
            if (filename == null || filename.trim().isEmpty()) {
                filename = taggedData.getName().trim();
            }
            downloadFile(data, filename);
        } else */if (requestType.equals("downloadPrunableMessage")) {
            PrunableMessage prunableMessage = PrunableMessage.getPrunableMessage(transactionId);
            if (prunableMessage == null && retrieve) {
                try {
                    if (Xin.getBlockchainProcessor().restorePrunedTransaction(transactionId) == null) {
                        growl("Pruned message not currently available from any peer");
                        return;
                    }
                } catch (IllegalArgumentException e) {
                    growl("Pruned message cannot be restored using desktop wallet without full blockchain. Use Web Wallet instead");
                    return;
                }
                prunableMessage = PrunableMessage.getPrunableMessage(transactionId);
            }
            String secretPhrase = params.get("secretPhrase");
            byte[] sharedKey = Convert.parseHexString(params.get("sharedKey"));
            if (sharedKey == null) {
                sharedKey = Convert.EMPTY_BYTE;
            }
            if (sharedKey.length != 0 && secretPhrase != null) {
                growl("Do not specify both secret phrase and shared key");
                return;
            }
            byte[] data = null;
            if (prunableMessage != null) {
                try {
                    if (secretPhrase != null) {
                        data = prunableMessage.decrypt(secretPhrase);
                    } else if (sharedKey.length > 0) {
                        data = prunableMessage.decrypt(sharedKey);
                    } else {
                        data = prunableMessage.getMessage();
                    }
                } catch (RuntimeException e) {
                    Logger.logDebugMessage("Decryption of message to recipient failed: " + e.toString());
                    growl("Wrong secretPhrase or sharedKey");
                    return;
                }
            }
            if (data == null) {
                data = Convert.EMPTY_BYTE;
            }
            downloadFile(data, "" + transactionId);
        }
    }

    private void downloadFile(byte[] data, String filename) {
        Path folderPath = Paths.get(System.getProperty("user.home"), "downloads");
        Path path = Paths.get(folderPath.toString(), filename);
        Logger.logInfoMessage("Before downloading file %s to default path %s", filename, path.toAbsolutePath());
        FileChooser fileChooser = new FileChooser();
        fileChooser.setTitle("Save File");
        fileChooser.setInitialDirectory(folderPath.toFile());
        fileChooser.setInitialFileName(filename);
        File file = fileChooser.showSaveDialog(stage);
        if (file != null) {
            try (OutputStream outputStream = Files.newOutputStream(file.toPath())){
                outputStream.write(data);
                growl(String.format("File %s downloaded", file.getAbsolutePath()));
            } catch (IOException e) {
                growl("Download failed " + e.getMessage(), e);
            }
        } else {
            growl("File download cancelled");
        }
    }

    public void stop() {
        System.out.println("DesktopApplication stopped"); // Should never happen
    }

    private void growl(String msg) {
        growl(msg, null);
    }

    private void growl(String msg, Exception e) {
        if (e == null) {
            Logger.logInfoMessage(msg);
        } else {
            Logger.logInfoMessage(msg, e);
        }
        nrs.call("growl", msg);
    }

    private void logJavaFxProperties() {
        String[] loggedProperties = new String[] {
                "javafx.version",
                "javafx.runtime.version",
        };
        for (String property : loggedProperties) {
            Logger.logDebugMessage(String.format("%s = %s", property, System.getProperty(property)));
        }
    }

}
