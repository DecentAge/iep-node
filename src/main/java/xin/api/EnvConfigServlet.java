package xin.api;

import java.io.IOException;

import xin.Constants;
import xin.ConstantsConfigHelper;
import xin.Xin;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.json.JSONObject;

public class EnvConfigServlet extends HttpServlet {
	
	private String createApiServerURL() {
		String urlFromProperties = Xin.getStringProperty("xin.apiServerReverseProxyURL");
		
		
		String protocol= null;
		Integer port = null;
		
		if (Xin.getBooleanProperty("xin.apiSSL")) {
			protocol = "https";
			port = Xin.getIntProperty("xin.apiServerSSLPort");
		} else {
			protocol = "http";
			port = Xin.getIntProperty("xin.apiServerPort");
		}
		
		if (!"".equals(urlFromProperties) && urlFromProperties != null) {
			return protocol + "://" + urlFromProperties;
		}
		
		String address = Xin.getStringProperty("xin.myAddress");
		
		if (address == null || "".equals(address)) {
			address = "localhost";
		}
		
		return protocol + "://" + address + ":" + port;
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("version", Xin.VERSION);
		jsonObject.put("env", Xin.getStringProperty("xin.env"));
		jsonObject.put("walletContextPath", Xin.getStringProperty("xin.walletContextPath"));
		//jsonObject.put("apiServerURL", createApiServerURL());
		jsonObject.put("proxyMarketURL", Xin.getStringProperty("xin.proxy.market.url"));
		jsonObject.put("mcapBackendURL", Xin.getStringProperty("xin.mcapBackendURL"));
		jsonObject.put("walletBrowserStorageExp", Xin.getIntProperty("xin.walletBrowserStorageExp"));
		jsonObject.put("genesisBlockEpoch", Constants.EPOCH_BEGINNING);
		jsonObject.put("phasingDuration", Constants.MAX_PHASING_DURATION/2);
		jsonObject.put("effectiveLeasingOffsetBlock", ConstantsConfigHelper.getIntProperty(ConstantsConfigHelper.PROPERTY_WALLET_LEASING_OFFSET_BLOCK));
		
		
		String jsResponse = "window.envConfig = " + jsonObject.toString(4);
		
		response.setContentType("text/javascript");
		// Dynamic per-node config (version, env, proxyMarketURL, ...) — never cache it,
		// or a CDN/browser serves stale version/config for hours after a deploy.
		response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		response.setStatus(HttpServletResponse.SC_OK);
		response.getWriter().write(jsResponse);
		response.getWriter().flush();
	}
}
