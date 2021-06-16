const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    "swagger-ui-apikey-auth-form": "./src/index.js"
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      oneOf: [{
        exclude: /node_modules/,
        loader: 'babel-loader'
      }]
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
    })],
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: '[name].js',
    library: 'SwaggerUIApiKeyAuthFormPlugin',
    libraryExport: 'default'
  },
  devServer: {
    contentBase: [
      path.join(__dirname, 'dev-server'),
      path.dirname(require.resolve('swagger-ui-dist'))
    ],
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }
};
