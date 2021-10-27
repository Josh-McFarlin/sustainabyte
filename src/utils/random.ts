import * as Crypto from "expo-crypto";
import faker from "faker";
import { v4 as uuid } from "./uuid";

export const createNonce = async (): Promise<string> =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, uuid(), {
    encoding: Crypto.CryptoEncoding.HEX,
  });

export const randomSubset = <T>(arr: T[], count: number): T[] =>
  [...arr].sort(() => 0.5 - Math.random()).slice(0, count);

export const randomSizeSubset = <T>(arr: T[], max: number, min = 1): T[] => {
  const count = faker.datatype.number(max - min) + min;

  return randomSubset(arr, count);
};

export const randomFoodUrl = "https://source.unsplash.com/collection/2311719";
