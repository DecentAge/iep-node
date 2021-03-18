package xin.api;

import xin.AT;
import xin.Account;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;
import xin.XinException;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public final class GetAccountATs extends APIServlet.APIRequestHandler {
	
	static GetAccountATs instance = new GetAccountATs();
	
	private GetAccountATs() {
		super(new APITag[] {APITag.AT, APITag.ACCOUNTS}, "account");
	}
	
	@Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {
		
		Account account = ParameterParser.getAccount(req);
		
		List<Long> atIds = AT.getATsIssuedBy(account.getId());
		JSONArray ats = new JSONArray();
		for(long atId : atIds) {
			ats.add(JSONData.at(AT.getAT(atId)));
		}
		
		JSONObject response = new JSONObject();
        response.put("ats", ats);
        return response;
	}
}
