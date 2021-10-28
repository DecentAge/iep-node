package xin.http.tests;

import org.json.simple.JSONObject;
import org.junit.Assert;
import org.junit.Test;

import xin.BlockchainTest;
import xin.Constants;
import xin.http.utils.APICall;
import xin.util.Logger;

public class GetBalanceTest extends BlockchainTest {

	@Test
    public void getBalance() {
    	 APICall.Builder builder = new APICall.Builder("getBalance").param("account", Long.toUnsignedString(BOB.getId()));
    	 JSONObject response = builder.build().invoke();
    	 response = builder.build().invoke();
    	 Assert.assertEquals(100000000000000L, Long.parseLong(((String)response.get("balanceTQT"))));
    }
}
