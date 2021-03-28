package xin.api;

import xin.Account;
import xin.Attachment;
import xin.Constants;
import xin.XinException;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.servlet.http.HttpServletRequest;

public final class SendMoneySubscription extends CreateTransaction {
	
	static final SendMoneySubscription instance = new SendMoneySubscription();
	
	private SendMoneySubscription() {
		super(new APITag[] {APITag.TRANSACTIONS, APITag.CREATE_TRANSACTION},
			  "recipient",
			  "amountTQT",
			  "frequency");
	}
	
	@Override
    protected JSONStreamAware processRequest(HttpServletRequest req) throws XinException {

		Account sender = ParameterParser.getSenderAccount(req);
		long recipient = ParameterParser.getAccountId(req, "recipient", true);
		long amountTQT = ParameterParser.getAmountTQT(req);
		
		int frequency;
		try {
			frequency = Integer.parseInt(req.getParameter("frequency"));
		}
		catch(Exception e) {
			JSONObject response = new JSONObject();
			response.put("errorCode", 4);
			response.put("errorDescription", "Invalid or missing frequency parameter");
			return response;
		}
		
		if(frequency < Constants.SUBSCRIPTION_MIN_FREQ ||
		   frequency > Constants.SUBSCRIPTION_MAX_FREQ) {
			JSONObject response = new JSONObject();
			response.put("errorCode", 4);
			response.put("errorDescription", "Invalid frequency amount");
			return response;
		}
		
		Attachment.AdvancedPaymentSubscriptionSubscribe attachment = new Attachment.AdvancedPaymentSubscriptionSubscribe(frequency);
		
		return createTransaction(req, sender, recipient, amountTQT, attachment);
	}
}
