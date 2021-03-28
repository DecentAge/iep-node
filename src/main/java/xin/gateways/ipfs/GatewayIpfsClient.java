/******************************************************************************
 * Copyright © 2017 XIN Community                                             *
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


package xin.gateways.ipfs;

import xin.Xin;
import xin.XinException;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.ipfs.api.IPFS;
import org.ipfs.api.Multihash;
import org.json.simple.JSONObject;

import java.util.Map;

public class GatewayIpfsClient {

    private static final String IPFS_HOST = Xin.getStringProperty("xin.gateway.ipfs.host");
    private static final String IPFS_PORT = Xin.getStringProperty("xin.gateway.ipfs.port");

    private static final String IPFS_ADDRESS_TEMPLATE = Xin.getStringProperty("xin.gateway.ipfs.addressTemplate");

    private IPFS ipfs;

    private String buildIPFSAddress(String host, String port) {
        return String.format(IPFS_ADDRESS_TEMPLATE, host, port);
    }

    private void setIpfs() {
        if (ipfs == null) {
            ipfs = new IPFS(buildIPFSAddress(IPFS_HOST, IPFS_PORT));
        }
    }

    public JSONObject getFileContent(Map<String, String[]> requestParams) throws XinException.NotValidException {
        setIpfs();
        String[] fileHash = requestParams.get("fileHash");
        if (CollectionUtils.sizeIsEmpty(fileHash) || StringUtils.isEmpty(fileHash[0])) {
            throw new XinException.NotValidException("File hash cannot be empty for getting file contents");
        }

        try {
            Multihash filePointer = Multihash.fromBase58(fileHash[0]);
            byte[] fileContents = ipfs.cat(filePointer);
            String fileContent = new String(fileContents);
            JSONObject json = new JSONObject();
            json.put("fileContent", fileContent);
            return json;
        } catch (Exception e) {
            throw new XinException.XinGatewayServiceException(e.getMessage(), e);
        }
    }
}
