import * as Random from "expo-random";
import * as uuid from "uuid";

export const v4 = (): string =>
  uuid.v4({
    rng: () => Random.getRandomBytes(16),
  });
