package xin.api;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

public class EnvConfigServlet extends HttpServlet {

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("RELEASE_VERSION", 123);
		jsonObject.put("APP_BASE_HREF", "/wallet");
		jsonObject.put("CONNECTION_MODE", "LOCALTESTNET");
		jsonObject.put("FALLBACK_HOST_URL", "http://node-1");
		jsonObject.put("LOCALTESTNET_URL", "http://node-1");
		
		
		String jsResponse = "window.envConfig = " + jsonObject.toString(4);
		
		response.setContentType("text/javascript");
		response.setStatus(HttpServletResponse.SC_OK);
		response.getWriter().write(jsResponse);
		response.getWriter().flush();
	}
}
