module.exports = {
  preset: 'jest-expo/node',
  transformIgnorePatterns: [
    'node_modules/(?!(?:react-native|@react-native|expo(nent)?|@expo(nent)?/.*|expo-.*|@expo-google-fonts/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-navigation|@react-navigation)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};