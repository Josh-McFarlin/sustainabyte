// eslint-disable-next-line @typescript-eslint/no-var-requires
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ["@gorhom", "rn-range-slider"],
      },
    },
    argv
  );

  // Customize the config before returning it.
  config.resolve.alias["react-native"] = "react-native-web";
  config.resolve.alias["react-native-maps"] = "react-native-web-maps";
  // config.resolve.alias["react-native-web/dist/exports/Modal"] =
  //   "modal-enhanced-react-native-web";

  return config;
};
