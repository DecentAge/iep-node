/*
 * Copyright © 2013-2016 The Nxt Core Developers.
 * Copyright © 2016-2020 Jelurida IP B.V.
 *
 * See the LICENSE.txt file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with Jelurida B.V.,
 * no part of the Nxt software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE.txt file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */

package xin.http.utils;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.AccessController;
import java.security.PrivilegedAction;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import xin.http.APIConnector;
import xin.http.APIRemoteConnector;
import xin.http.ApiSpec;
import xin.util.Convert;

public class APICall {
    private APIConnector apiConnector;

    private APICall(Builder<?> builder) {
        URL remoteUrl = builder.remoteUrl;
        if (builder.isRemoteOnly() && remoteUrl == null) {
            throw new IllegalArgumentException("API call " + getClass().getName() + " must connect to a remote node");
        }
        if (remoteUrl != null) {
            apiConnector = new APIRemoteConnector(builder.params, builder.parts, remoteUrl, builder.isTrustRemoteCertificate);
        } else {
            apiConnector = new APIInProcessConnector(builder.params, builder.parts);
        }
    }

    public static class Builder<T extends Builder> {
        protected final Map<String, List<String>> params = new HashMap<>();
        private List<String> validParams = new ArrayList<>();
        private boolean isValidationEnabled = true;
        private final Map<String, byte[]> parts = new HashMap<>();
        private String validFileParam;
        private String requestType;
        private URL remoteUrl;
        private boolean isTrustRemoteCertificate;

        public Builder(String requestType) {
            this(ApiSpec.valueOf(requestType));
        }

        public Builder(ApiSpec apiSpec) {
            this.requestType = apiSpec.name();
            params.put("requestType", Collections.singletonList(this.requestType));
            params.put("deadline", Collections.singletonList("1440"));
            validParams.addAll(apiSpec.getParameters());
            validFileParam = apiSpec.getFileParameter();
        }

        public T remote(URL url) {
            remoteUrl = url;
            return self();
        }

        public T trustRemoteCertificate(boolean trustRemoteCertificate) {
            isTrustRemoteCertificate = trustRemoteCertificate;
            return self();
        }

        public boolean isRemoteOnly() {
            return false;
        }

        public T setParamValidation(boolean isEnabled) {
            isValidationEnabled = isEnabled;
            return self();
        }

        public T param(String key, String value) {
            return param(key, Collections.singletonList(value));
        }

        public T param(String key, String[] values) {
            return param(key, Arrays.asList(values));
        }

        public T param(String key, List<String> values) {
            if (isValidationEnabled && !validParams.contains(key)) {
                throw new IllegalArgumentException(String.format("Invalid parameter %s for request type %s", key, requestType));
            }
            if (values.size() == 0) {
                throw new IllegalArgumentException(String.format("Empty values parameter %s for requesttype %s", key, requestType));
            }
            params.put(key, values);
            return self();
        }

        public T param(String key, boolean value) {
            return param(key, "" + value);
        }

        public T param(String key, byte value) {
            return param(key, "" + value);
        }

        public T param(String key, int value) {
            return param(key, "" + value);
        }

        public T param(String key, int... intArray) {
            String[] stringArray = Arrays.stream(intArray).boxed().map(i -> Integer.toString(i)).toArray(String[]::new);
            return param(key, stringArray);
        }

        public T param(String key, long value) {
            return param(key, "" + value);
        }

        public T param(String key, long... longArray) {
            String[] unsignedLongs = Arrays.stream(longArray).boxed().map(l -> Long.toString(l)).toArray(String[]::new);
            return param(key, unsignedLongs);
        }

        public T unsignedLongParam(String key, long value) {
            return param(key, Long.toUnsignedString(value));
        }

        public T unsignedLongParam(String key, long... longArray) {
            String[] unsignedLongs = Arrays.stream(longArray).boxed().map(Long::toUnsignedString).toArray(String[]::new);
            return param(key, unsignedLongs);
        }

        public T param(String key, byte[] value) {
            return param(key, Convert.toHexString(value));
        }

        public T param(String key, byte[][] value) {
            String[] stringArray = new String[value.length];
            for (int i = 0; i < value.length; i++) {
                stringArray[i] = Convert.toHexString(value[i]);
            }
            return param(key, stringArray);
        }

        public T secretPhrase(String value) {
            return param("secretPhrase", value);
        }

        public T chain(String chain) {
            return param("chain", chain);
        }

        public T chain(int chainId) {
            return param("chain", "" + chainId);
        }

        public String getParam(String key) {
            List<String> values = params.get(key);
            return values == null ? null : values.get(0);
        }

        public boolean isParamSet(String key) {
            return params.get(key) != null;
        }

        public T parts(String key, byte[] b) {
            if (!validFileParam.equals(key)) {
                throw new IllegalArgumentException(String.format("Invalid file parameter %s for request type %s", key, requestType));
            }
            parts.put(key, b);
            return self();
        }

        @SuppressWarnings("unchecked")
        private T self() {
            return (T) this;
        }

        public APICall build() {
            return new APICall(this);
        }

        public JO call() {
            return new APICall(this).getJsonResponse();
        }

        public byte[] download() {
            return new APICall(this).getBytes();
        }

        
    }

    public JO getJsonResponse() {
        return new JO(invoke());
    }

    public InputStream getInputStream() {
        return apiConnector.getInputStream();
    }

    public byte[] getBytes() {
        try (InputStream is = getInputStream()) {
            return readInputStream(is);
        } catch (IOException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    public InvocationError invokeWithError() {
        JSONObject actual = invoke();
        return new InvocationError(actual);
    }


    public JSONObject invokeNoError() {
        JSONObject actual = invoke();

        assertNull(actual.get("errorDescription"));
        assertNull(actual.get("errorCode"));

        return actual;
    }

    public JSONObject invoke() {
        return AccessController.doPrivileged((PrivilegedAction<JSONObject>) this::invokeImpl);
    }

    private JSONObject invokeImpl() {
        try {
            InputStream inputStream = apiConnector.getInputStream();
            try (Reader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
                return (JSONObject) JSONValue.parseWithException(reader); // Parse the response into Json object
            }
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private static void assertNull(Object o) {
        if (o != null) {
            throw new AssertionError("Expected null, got: " + o);
        }
    }

    private static <T> T assertNotNull(T o) {
        if (o == null) {
            throw new AssertionError("Expected not null");
        }
        return o;
    }

    public static class InvocationError {
        private JSONObject jsonObject;

        public InvocationError(JSONObject jsonObject) {
            this.jsonObject = jsonObject;
        }

        public String getErrorCode() {
            return str("errorCode");
        }

        public String getErrorDescription() {
            return str("errorDescription");
        }

        private String str(String errorCode) {
            return (String) assertNotNull(jsonObject.get(errorCode));
        }
    }

    private static byte[] readInputStream(InputStream is) {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        int nRead;
        byte[] data = new byte[16384];
        try {
            while ((nRead = is.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, nRead);
            }
            buffer.flush();
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
        return buffer.toByteArray();
    }

}
