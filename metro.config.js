// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Correctif SDK Firebase JS : Metro ne résout pas correctement les "exports"
// du package firebase. On ajoute l'extension .cjs et on désactive la
// résolution par "exports" pour retomber sur les entrées CJS/react-native.
config.resolver.sourceExts.push('cjs');
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
