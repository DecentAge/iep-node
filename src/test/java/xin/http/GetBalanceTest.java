package xin.http;

import org.json.simple.JSONObject;
import org.junit.Assert;
import org.junit.Test;

import xin.BlockchainTest;
import xin.Constants;
import xin.http.nxt.APICall;
import xin.util.Logger;

public class GetBalanceTest extends BlockchainTest {

	
	/*public static long getAccountBalance(long account, String balance) {
        APICall.Builder builder = new APICall.Builder("getBalance").param("account", Long.toUnsignedString(account));
        JSONObject response = builder.build().invoke();
        
        Logger.logMessage("getBalance response: " + response.toJSONString());
        
        return Long.parseLong(((String)response.get(balance)));
    }*/
	
	
	@Test
    public void sendMessage() {
    	System.out.println("Hello first test");
        /*JSONObject response = new APICall.Builder("getBalance").
                param("secretPhrase", ALICE.getSecretPhrase()).
                param("recipient", BOB.getStrId()).
                param("message", "hello world").
                param("feeTQT", Constants.ONE_XIN).
                build().invoke();*/
    	
    	 APICall.Builder builder = new APICall.Builder("getBalance").param("account", Long.toUnsignedString(BOB.getId()));
    	 JSONObject response = builder.build().invoke();

    	 new APICall.Builder("sendMoney").
                 param("secretPhrase", ALICE.getSecretPhrase()).
                 param("recipient", BOB.getStrId()).
                 param("amountTQT", 123 * Constants.ONE_XIN).
                 param("feeTQT", Constants   .ONE_XIN).
                 build().invokeNoError();
    	 
    	 
    	 generateBlock();
    	 
    	 response = builder.build().invoke();
        
    	 System.out.println("123");
        
    }
	
	
}
