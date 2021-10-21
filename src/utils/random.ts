import * as Crypto from "expo-crypto";
import { v4 as uuid } from "./uuid";

export const createNonce = async (): Promise<string> =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, uuid(), {
    encoding: Crypto.CryptoEncoding.HEX,
  });
