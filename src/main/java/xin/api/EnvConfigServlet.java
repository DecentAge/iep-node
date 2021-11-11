package xin.api;

import java.io.IOException;

import xin.Constants;
import xin.Xin;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

public class EnvConfigServlet extends HttpServlet {
	
	private String createApiServerURL() {
		String urlFromProperties = Xin.getStringProperty("xin.apiServerReverseProxyURL");
		
		
		String protocol= null;
		Integer port = null;
		
		String address = Xin.getStringProperty("xin.myAddress");
		
		if (address == null || "".equals(address))
		
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
		
		return protocol + "://" + address + ":" + port;
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("version", Xin.VERSION);
		jsonObject.put("env", Xin.getStringProperty("xin.env"));
		jsonObject.put("walletContextPath", Xin.getStringProperty("xin.walletContextPath"));
		jsonObject.put("apiServerURL", createApiServerURL());
		jsonObject.put("proxyMarketURL", Xin.getStringProperty("xin.proxy.market.url"));
		jsonObject.put("walletBrowserStorageExp", Xin.getIntProperty("xin.walletBrowserStorageExp"));
		jsonObject.put("genesisBlockEpoch", Constants.EPOCH_BEGINNING);
		jsonObject.put("phasingDuration", Constants.MAX_PHASING_DURATION/2);
		jsonObject.put("effectiveLeasingOffsetBlock", Constants.EFFECTIVE_LEASING_OFFSET_BLOCK);
		
		
		String jsResponse = "window.envConfig = " + jsonObject.toString(4);
		
		response.setContentType("text/javascript");
		response.setStatus(HttpServletResponse.SC_OK);
		response.getWriter().write(jsResponse);
		response.getWriter().flush();
	}
}
