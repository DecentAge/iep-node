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

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import xin.XinException;
import xin.util.Convert;
import xin.util.Logger;
import org.json.simple.JSONObject;
import org.json.simple.JSONStreamAware;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>The DecodeQRCode API converts a base64-encoded image of a
 * 2-D QR (Quick Response) code to a UTF-8 string, using the ZXing library.
 * </p>
 * <p>
 * <p>The input qrCodeBase64 can be the output of the DecodeQRCode API.</p>
 * <p>
 * <p>Request parameters:</p>
 * <p>
 * <ul>
 * <li>qrCodeBase64 - A base64 string encoded from an image of a QR code.
 * The length of the string must be less than the jetty server maximum allowed
 * parameter length, currently 200,000 bytes.
 * </li>
 * </ul>
 * <p>
 * <p>Response fields:</p>
 * <p>
 * <ul>
 * <li>qrCodeData - A UTF-8 string decoded from the QR code.</li>
 * </ul>
 */

public final class DecodeQRCode extends APIServlet.APIRequestHandler {

    static final DecodeQRCode instance = new DecodeQRCode();

    private DecodeQRCode() {
        super(new APITag[]{APITag.UTILS}, "qrCodeBase64");
    }

    @SuppressWarnings("unchecked")
	@Override
    protected JSONStreamAware processRequest(HttpServletRequest request)
            throws XinException {

        String qrCodeBase64 = Convert.nullToEmpty(request.getParameter("qrCodeBase64"));

        JSONObject response = new JSONObject();
        try {
            BinaryBitmap binaryBitmap = new BinaryBitmap(
                    new HybridBinarizer(new BufferedImageLuminanceSource(
                            ImageIO.read(new ByteArrayInputStream(
                                    Base64.getDecoder().decode(qrCodeBase64)
                            ))
                    ))
            );

            @SuppressWarnings("rawtypes")
			Map hints = new HashMap();
            hints.put(DecodeHintType.POSSIBLE_FORMATS, EnumSet.of(BarcodeFormat.QR_CODE));
            hints.put(DecodeHintType.CHARACTER_SET, "UTF-8");

            Result qrCodeData = new MultiFormatReader().decode(binaryBitmap, hints);
            response.put("qrCodeData", qrCodeData.getText());
        } catch (IOException ex) {
            String errorMessage = "Error reading base64 byte stream";
            Logger.logErrorMessage(errorMessage, ex);
            JSONData.putException(response, ex, errorMessage);
        } catch (NullPointerException ex) {
            String errorMessage = "Invalid base64 image";
            Logger.logErrorMessage(errorMessage, ex);
            JSONData.putException(response, ex, errorMessage);
        } catch (NotFoundException ex) {
            response.put("qrCodeData", "");
        }
        return response;
    }

    @Override
    protected final boolean requirePost() {
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
