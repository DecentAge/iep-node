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

package xin.api;

import xin.api.EventListener.EventListenerException;
import xin.api.EventListener.PendingEvent;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public class EventWait extends APIServlet.APIRequestHandler {

    /**
     * EventWait instance
     */
    static final EventWait instance = new EventWait();

    /**
     * Incorrect timeout
     */
    private static final JSONObject incorrectTimeout = new JSONObject();

    static {
        incorrectTimeout.put("errorCode", 4);
        incorrectTimeout.put("errorDescription", "Wait timeout is not valid");
    }

    /**
     * No events registered
     */
    private static final JSONObject noEventsRegistered = new JSONObject();

    static {
        noEventsRegistered.put("errorCode", 8);
        noEventsRegistered.put("errorDescription", "No events registered");
    }

    /**
     * Create the EventWait instance
     */
    private EventWait() {
        super(new APITag[]{APITag.INFO}, "timeout");
    }

    /**
     * Process the EventWait API request
     * <p>
     * The response will be returned immediately if there are any
     * pending events.  Otherwise, an asynchronous context will
     * be created and the response will be returned after the wait
     * has completed.  By using an asynchronous context, we avoid
     * tying up the Jetty servlet thread while waiting for an event.
     *
     * @param req API request
     * @return API response or null
     */
    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) {
        JSONObject response = null;
        //
        // Get the timeout value
        //
        long timeout = EventListener.eventTimeout;
        String value = req.getParameter("timeout");
        if (value != null) {
            try {
                timeout = Math.min(Long.valueOf(value), timeout);
            } catch (NumberFormatException exc) {
                response = incorrectTimeout;
            }
        }
        //
        // Wait for an event
        //
        if (response == null) {
            EventListener listener = EventListener.eventListeners.get(req.getRemoteAddr());
            if (listener == null) {
                response = noEventsRegistered;
            } else {
                try {
                    List<PendingEvent> events = listener.eventWait(req, timeout);
                    if (events != null)
                        response = formatResponse(events);
                } catch (EventListenerException exc) {
                    response = new JSONObject();
                    response.put("errorCode", 7);
                    response.put("errorDescription", "Unable to wait for an event: " + exc.getMessage());
                }
            }
        }
        return response;
    }

    @Override
    protected final boolean requirePost() {
        return true;
    }

    /**
     * No required block parameters
     *
     * @return FALSE to disable the required block parameters
     */
    @Override
    protected boolean allowRequiredBlockParameters() {
        return false;
    }

    /**
     * Format the EventWait response
     *
     * @param events Event list
     * @return JSON stream
     */
    static JSONObject formatResponse(List<PendingEvent> events) {
        JSONArray eventsJSON = new JSONArray();
        events.forEach(event -> {
            JSONArray idsJSON = new JSONArray();
            if (event.isList())
                idsJSON.addAll(event.getIdList());
            else
                idsJSON.add(event.getId());
            JSONObject eventJSON = new JSONObject();
            eventJSON.put("name", event.getName());
            eventJSON.put("ids", idsJSON);
            eventsJSON.add(eventJSON);
        });
        JSONObject response = new JSONObject();
        response.put("events", eventsJSON);
        return response;
    }
}
