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

import xin.Xin;
import org.bitlet.weupnp.GatewayDevice;
import org.bitlet.weupnp.GatewayDiscover;

import java.net.InetAddress;
import java.util.Map;

/**
 * Forward ports using the UPnP protocol.
 */
public class UPnP {

    /**
     * Initialization done
     */
    private static boolean initDone = false;

    /**
     * UPnP storage device
     */
    private static GatewayDevice gateway = null;

    /**
     * Local address
     */
    private static InetAddress localAddress;

    /**
     * External address
     */
    private static InetAddress externalAddress;

    /**
     * Add a port to the UPnP mapping
     *
     * @param port Port to add
     */
    public static synchronized void addPort(int port) {
        if (!initDone)
            init();
        //
        // Ignore the request if we didn't find a storage device
        //
        if (gateway == null)
            return;
        //
        // Forward the port
        //
        try {
            if (gateway.addPortMapping(port, port, localAddress.getHostAddress(), "TCP",
                    Xin.APPLICATION + " " + Xin.VERSION)) {
                Logger.logDebugMessage("Mapped port [" + externalAddress.getHostAddress() + "]:" + port);
            } else {
                Logger.logDebugMessage("Unable to map port " + port);
            }
        } catch (Exception exc) {
            Logger.logErrorMessage("Unable to map port " + port + ": " + exc.toString());
        }
    }

    /**
     * Delete a port from the UPnP mapping
     *
     * @param port Port to delete
     */
    public static synchronized void deletePort(int port) {
        if (!initDone || gateway == null)
            return;
        //
        // Delete the port
        //
        try {
            if (gateway.deletePortMapping(port, "TCP")) {
                Logger.logDebugMessage("Mapping deleted for port " + port);
            } else {
                Logger.logDebugMessage("Unable to delete mapping for port " + port);
            }
        } catch (Exception exc) {
            Logger.logErrorMessage("Unable to delete mapping for port " + port + ": " + exc.toString());
        }
    }

    /**
     * Return the local address
     *
     * @return Local address or null if the address is not available
     */
    public static synchronized InetAddress getLocalAddress() {
        if (!initDone)
            init();
        return localAddress;
    }

    /**
     * Return the external address
     *
     * @return External address or null if the address is not available
     */
    public static synchronized InetAddress getExternalAddress() {
        if (!initDone)
            init();
        return externalAddress;
    }

    /**
     * Initialize the UPnP support
     */
    private static void init() {
        initDone = true;
        //
        // Discover the storage devices on the local network
        //
        try {
            Logger.logInfoMessage("Looking for UPnP storage device...");

            GatewayDevice.setHttpReadTimeout(Xin.getIntProperty("xin.upnpGatewayTimeout", GatewayDevice.getHttpReadTimeout()));

            GatewayDiscover discover = new GatewayDiscover();

            discover.setTimeout(Xin.getIntProperty("xin.upnpDiscoverTimeout", discover.getTimeout()));

            Map<InetAddress, GatewayDevice> gatewayMap = discover.discover();
            if (gatewayMap == null || gatewayMap.isEmpty()) {
                Logger.logDebugMessage("There are no UPnP storage devices");
            } else {
                gatewayMap.forEach((addr, device) ->
                        Logger.logDebugMessage("UPnP storage device found on " + addr.getHostAddress()));
                gateway = discover.getValidGateway();
                if (gateway == null) {
                    Logger.logDebugMessage("There is no connected UPnP storage device");
                } else {
                    localAddress = gateway.getLocalAddress();
                    externalAddress = InetAddress.getByName(gateway.getExternalIPAddress());
                    Logger.logDebugMessage("Using UPnP storage device on " + localAddress.getHostAddress());
                    Logger.logInfoMessage("External IP address is " + externalAddress.getHostAddress());
                }
            }
        } catch (Exception exc) {
            Logger.logErrorMessage("Unable to discover UPnP storage devices: " + exc.toString());
        }
    }
}
