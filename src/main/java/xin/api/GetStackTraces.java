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

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;
import java.lang.management.*;

public class GetStackTraces extends APIServlet.APIRequestHandler {

    /**
     * GetLog instance
     */
    static final GetStackTraces instance = new GetStackTraces();

    /**
     * Create the GetStackTraces instance
     */
    private GetStackTraces() {
        super(new APITag[]{APITag.DEBUG}, "depth");
    }

    /**
     * Process the GetStackTraces API request
     *
     * @param req API request
     * @return API response
     */
    @Override
    protected JSONStreamAware processRequest(HttpServletRequest req) {
        String value;
        //
        // Get the number of trace lines to return
        //
        int depth;
        value = req.getParameter("depth");
        if (value != null)
            depth = Math.max(Integer.valueOf(value), 1);
        else
            depth = Integer.MAX_VALUE;
        //
        // Get the thread information
        //
        JSONArray threadsJSON = new JSONArray();
        JSONArray locksJSON = new JSONArray();
        ThreadMXBean tmxBean = ManagementFactory.getThreadMXBean();
        boolean tmxMI = tmxBean.isObjectMonitorUsageSupported();
        ThreadInfo[] tList = tmxBean.dumpAllThreads(tmxMI, false);
        //
        // Generate the response
        //
        for (ThreadInfo tInfo : tList) {
            JSONObject threadJSON = new JSONObject();
            //
            // General thread information
            //
            threadJSON.put("id", tInfo.getThreadId());
            threadJSON.put("name", tInfo.getThreadName());
            threadJSON.put("state", tInfo.getThreadState().toString());
            //
            // Gather lock usage
            //
            if (tmxMI) {
                MonitorInfo[] mList = tInfo.getLockedMonitors();
                if (mList.length > 0) {
                    JSONArray monitorsJSON = new JSONArray();
                    for (MonitorInfo mInfo : mList) {
                        JSONObject lockJSON = new JSONObject();
                        lockJSON.put("name", mInfo.getClassName());
                        lockJSON.put("hash", mInfo.getIdentityHashCode());
                        lockJSON.put("depth", mInfo.getLockedStackDepth());
                        lockJSON.put("trace", mInfo.getLockedStackFrame().toString());
                        monitorsJSON.add(lockJSON);
                    }
                    threadJSON.put("locks", monitorsJSON);
                }
                if (tInfo.getThreadState() == Thread.State.BLOCKED) {
                    LockInfo lInfo = tInfo.getLockInfo();
                    if (lInfo != null) {
                        JSONObject lockJSON = new JSONObject();
                        lockJSON.put("name", lInfo.getClassName());
                        lockJSON.put("hash", lInfo.getIdentityHashCode());
                        lockJSON.put("thread", tInfo.getLockOwnerId());
                        threadJSON.put("blocked", lockJSON);
                        boolean addLock = true;
                        for (Object lock : locksJSON) {
                            if (((JSONObject) lock).get("name").equals(lInfo.getClassName())) {
                                addLock = false;
                                break;
                            }
                        }
                        if (addLock)
                            locksJSON.add(lockJSON);
                    }
                }
            }
            //
            // Add the stack trace
            //
            StackTraceElement[] elements = tInfo.getStackTrace();
            JSONArray traceJSON = new JSONArray();
            int ix = 0;
            for (StackTraceElement element : elements) {
                traceJSON.add(element.toString());
                if (++ix == depth)
                    break;
            }
            threadJSON.put("trace", traceJSON);
            //
            // Add the thread to the response
            //
            threadsJSON.add(threadJSON);
        }
        //
        // Return the response
        //
        JSONObject response = new JSONObject();
        response.put("threads", threadsJSON);
        response.put("locks", locksJSON);
        return response;
    }

    /**
     * Require the administrator password
     *
     * @return TRUE if the admin password is required
     */
    @Override
    protected boolean requirePassword() {
        return true;
    }

    @Override
    protected boolean allowRequiredBlockParameters() {
        return false;
    }

    @Override
    protected boolean requireBlockchain() {
        return false;
    }

}
