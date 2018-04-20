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

package xin.dev.commands;

import org.springframework.shell.core.CommandMarker;
import org.springframework.shell.core.annotation.CliCommand;
import org.springframework.shell.core.annotation.CliOption;
import org.springframework.stereotype.Component;
import xin.crypto.Crypto;

import xin.util.Convert;

import java.util.Arrays;


@Component
public class GenericTools implements CommandMarker {

    private static final String XIN_TOOLS = "xintools";

    private static final String XIN_SINGATURE_TO_BYTE_ARRAY = XIN_TOOLS + " " + "signToByte";

    @CliCommand(value = XIN_SINGATURE_TO_BYTE_ARRAY, help = "Will print account details from secret")
    public String stringToByteArray(@CliOption(key = {"string"}, mandatory = true, help = "String that needs to be converted to byte array") final String string) {
        return Arrays.toString( Convert.parseHexString( string )  );
    }
}
