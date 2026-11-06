// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Le SDK Firebase JS publie des "exports" que Metro ne résout pas correctement.
// On désactive la résolution par "exports" UNIQUEMENT pour firebase/@firebase.
// On la garde ACTIVE pour tout le reste : React Native (SDK 58) en a besoin
// pour ses modules internes (react-private-interface, asset-registry).
config.resolver.sourceExts.push('cjs');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('firebase') || moduleName.startsWith('@firebase')) {
    return context.resolveRequest(
      { ...context, unstable_enablePackageExports: false },
      moduleName,
      platform,
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
