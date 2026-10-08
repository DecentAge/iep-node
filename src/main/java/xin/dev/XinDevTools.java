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

package xin.dev;

import xin.Xin;
import xin.dev.commands.AccountCommandTools;
import xin.dev.commands.CheckSumCommands;
import xin.dev.commands.GenericTools;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

// Interactive shell (no arguments) or a single command: bin/dev xAccount details --secret "..."
public class XinDevTools {

    private record Command(String help, Function<Map<String, String>, String> run) {}

    private static final Map<String, Command> COMMANDS = new LinkedHashMap<>();

    static {
        AccountCommandTools account = new AccountCommandTools();
        CheckSumCommands checksum = new CheckSumCommands();
        GenericTools generic = new GenericTools();
        COMMANDS.put("xAccount details", new Command("--secret <secret>: account id, RS address and public key",
                o -> account.accountDetails(required(o, "secret"))));
        COMMANDS.put("test", new Command("--secret <secret>: echoes the secret",
                o -> account.simple(required(o, "secret"))));
        COMMANDS.put("checksum calculate", new Command("--from <height> --to <height>: SHA-256 over the transactions in the range",
                o -> checksum.calculateChecksum(Integer.parseInt(o.getOrDefault("from", "0")), Integer.parseInt(o.getOrDefault("to", "0")))));
        COMMANDS.put("xintools signToByte", new Command("--string <hex>: hex string as byte array",
                o -> generic.stringToByteArray(required(o, "string"))));
    }

    public static void main(String[] args) throws Exception {
        Xin.init();
        try {
            if (args.length > 0) {
                System.out.println(execute(List.of(args)));
                return;
            }
            BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
            System.out.println("IEP dev tools. Type \"help\" for commands, \"exit\" to quit.");
            while (true) {
                System.out.print("xin-dev> ");
                System.out.flush();
                String line = in.readLine();
                if (line == null) {
                    break;
                }
                List<String> tokens = tokenize(line);
                if (tokens.isEmpty()) {
                    continue;
                }
                if (tokens.get(0).equals("exit") || tokens.get(0).equals("quit")) {
                    break;
                }
                try {
                    System.out.println(execute(tokens));
                } catch (RuntimeException e) {
                    System.out.println("Error: " + e.getMessage());
                }
            }
        } finally {
            Xin.shutdown();
            System.exit(0);
        }
    }

    static String execute(List<String> tokens) {
        if (tokens.get(0).equals("help")) {
            StringBuilder sb = new StringBuilder();
            COMMANDS.forEach((name, c) -> sb.append("* ").append(name).append(" ").append(c.help()).append('\n'));
            return sb.append("* help\n* exit").toString();
        }
        int optionStart = 0;
        while (optionStart < tokens.size() && !tokens.get(optionStart).startsWith("--")) {
            optionStart++;
        }
        String name = String.join(" ", tokens.subList(0, optionStart));
        Command command = COMMANDS.get(name);
        if (command == null) {
            throw new IllegalArgumentException("unknown command '" + name + "' (try help)");
        }
        Map<String, String> options = new HashMap<>();
        for (int i = optionStart; i < tokens.size(); i++) {
            String key = tokens.get(i);
            if (!key.startsWith("--")) {
                throw new IllegalArgumentException("expected an option, got '" + key + "'");
            }
            String value = i + 1 < tokens.size() && !tokens.get(i + 1).startsWith("--") ? tokens.get(++i) : "";
            options.put(key.substring(2), value);
        }
        return command.run().apply(options);
    }

    private static String required(Map<String, String> options, String key) {
        String value = options.get(key);
        if (value == null || value.isEmpty()) {
            throw new IllegalArgumentException("missing --" + key);
        }
        return value;
    }

    static List<String> tokenize(String line) {
        List<String> tokens = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean quoted = false;
        boolean inToken = false;
        for (char ch : line.trim().toCharArray()) {
            if (ch == '"') {
                quoted = !quoted;
                inToken = true;
            } else if (Character.isWhitespace(ch) && !quoted) {
                if (inToken) {
                    tokens.add(current.toString());
                    current.setLength(0);
                    inToken = false;
                }
            } else {
                current.append(ch);
                inToken = true;
            }
        }
        if (inToken) {
            tokens.add(current.toString());
        }
        return tokens;
    }
}
