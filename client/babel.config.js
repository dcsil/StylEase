module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
        "safe": false,
        "allowUndefined": false,
      }], 
      "@babel/transform-react-jsx-source"
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel']
      }
    }
  };
};
