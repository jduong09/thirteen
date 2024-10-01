const findWebpack = require('find-webpack');
const injectDevServer = require('@cypress/react/plugins/react-scripts');
const webpackPreprocessor = require('@cypress/webpack-preprocessor');

module.exports = (on, config) => {
   // find the Webpack config used by react-scripts
   const webpackOptions = findWebpack.getWebpackOptions();
      
   if (!webpackOptions) {
     throw new Error('Could not find Webpack in this project 😢');
   }

   const cleanOptions = {
    reactScripts: true,
  };

  findWebpack.cleanForCypress(cleanOptions, webpackOptions);

  const options = {
    webpackOptions,
    watchOptions: {},
  };

  injectDevServer(on, config);
  on('file:preprocessor', webpackPreprocessor(options));
  return config;
}