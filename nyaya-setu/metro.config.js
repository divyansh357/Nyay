/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('db', 'sqlite', 'sqlite3');
config.resolver.sourceExts.push('ts', 'tsx');

module.exports = config;