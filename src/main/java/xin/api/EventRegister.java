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
import xin.api.EventListener.EventRegistration;
import xin.util.Convert;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

public class EventRegister extends APIServlet.APIRequestHandler {

    /**
     * EventRegister instance
     */
    static final EventRegister instance = new EventRegister();

    /**
     * Events registers
     */
    private static final JSONObject eventsRegistered = new JSONObject();

    static {
        eventsRegistered.put("registered", true);
    }

    /**
     * Mutually exclusive parameters
     */
    private static final JSONObject exclusiveParams = new JSONObject();

    static {
        exclusiveParams.put("errorCode", 4);
        exclusiveParams.put("errorDescription", "Mutually exclusive 'add' and 'remove'");
    }

    /**
     * Incorrect event
     */
    private static final JSONObject incorrectEvent = new JSONObject();

    static {
        incorrectEvent.put("errorCode", 4);
        incorrectEvent.put("errorDescription", "Incorrect event name format");
    }

    /**
     * Unknown event
     */
    private static final JSONObject unknownEvent = new JSONObject();

    static {
        unknownEvent.put("errorCode", 5);
        unknownEvent.put("errorDescription", "Unknown event name");
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
     * Create the EventRegister instance
     */
    private EventRegister() {
        super(new APITag[]{APITag.INFO}, "event", "event", "event", "add", "remove");
    }

    /**
     * Process the EventRegister API request
     *
     * @param req API request
     * @return API response
     */
    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) {
        JSONObject response;
        //
        // Get 'add' and 'remove' parameters
        //
        boolean addEvents = Boolean.valueOf(req.getParameter("add"));
        boolean removeEvents = Boolean.valueOf(req.getParameter("remove"));
        if (addEvents && removeEvents)
            return exclusiveParams;
        //
        // Build the event list from the 'event' parameters
        //
        List<EventRegistration> events = new ArrayList<>();
        String[] params = req.getParameterValues("event");
        if (params == null) {
            //
            // Add all events if no events are supplied
            //
            EventListener.peerEvents.forEach(event -> events.add(new EventRegistration(event, 0)));
            EventListener.blockEvents.forEach(event -> events.add(new EventRegistration(event, 0)));
            EventListener.txEvents.forEach(event -> events.add(new EventRegistration(event, 0)));
            EventListener.ledgerEvents.forEach(event -> events.add(new EventRegistration(event, 0)));
        } else {
            for (String param : params) {
                //
                // The Ledger event can have 2 or 3 parts.  All other events have 2 parts.
                //
                long accountId = 0;
                String[] parts = param.split("\\.");
                if (parts[0].equals("Ledger")) {
                    if (parts.length == 3) {
                        try {
                            accountId = Convert.parseAccountId(parts[2]);
                        } catch (RuntimeException e) {
                            return incorrectEvent;
                        }
                    } else if (parts.length != 2) {
                        return incorrectEvent;
                    }
                } else if (parts.length != 2) {
                    return incorrectEvent;
                }
                //
                // Add the event
                //
                List<? extends Enum> eventList;
                switch (parts[0]) {
                    case "Block":
                        eventList = EventListener.blockEvents;
                        break;
                    case "Peer":
                        eventList = EventListener.peerEvents;
                        break;
                    case "Transaction":
                        eventList = EventListener.txEvents;
                        break;
                    case "Ledger":
                        eventList = EventListener.ledgerEvents;
                        break;
                    default:
                        return unknownEvent;
                }
                boolean eventAdded = false;
                for (Enum<? extends Enum> event : eventList) {
                    if (event.name().equals(parts[1])) {
                        events.add(new EventRegistration(event, accountId));
                        eventAdded = true;
                        break;
                    }
                }
                if (!eventAdded)
                    return unknownEvent;
            }
        }
        //
        // Register the event listener
        //
        try {
            if (addEvents || removeEvents) {
                EventListener listener = EventListener.eventListeners.get(req.getRemoteAddr());
                if (listener != null) {
                    if (addEvents)
                        listener.addEvents(events);
                    else
                        listener.removeEvents(events);
                    response = eventsRegistered;
                } else {
                    response = noEventsRegistered;
                }
            } else {
                EventListener listener = new EventListener(req.getRemoteAddr());
                listener.activateListener(events);
                response = eventsRegistered;
            }
        } catch (EventListenerException exc) {
            response = new JSONObject();
            response.put("errorCode", 7);
            response.put("errorDescription", "Unable to register events: " + exc.getMessage());
        }
        //
        // Return the response
        //
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
}
