package com.library.springbootlibrary.utils;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class ExtractJWT {
    public static String payloadJWTExtraction(String token, String extraction) {
        //remove bearer from token
        token.replace("Bearer", "");

        //breakup token into chunks and decode the payload
        String[] chunks = token.split("\\.");
        Base64.Decoder decoder = Base64.getUrlDecoder();

        String payload = new String(decoder.decode(chunks[1]));

        //split up payload
        String[] entries = payload.split(",");
        Map<String, String> map = new HashMap<>();

        //loop trough the value of entries to find the value of sub={email}
        for (String entry : entries) {
            String[] keyValue = entry.split(":");
            if (keyValue[0].equals(extraction)) {

                int remove = 1;
                if (keyValue[1].endsWith("}")) {
                    remove = 2;
                }
                keyValue[1] = keyValue[1].substring(0, keyValue[1].length() - remove);
                keyValue[1] = keyValue[1].substring(1);

                map.put(keyValue[0], keyValue[1]);
            }
        }
        //return the value
        if (map.containsKey(extraction)) {
            return map.get(extraction);
        }

        return null;
    }

}
