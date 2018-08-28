const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

module.exports = function(env = {}, args) {
  if (process.env.NODE_ENV === 'production') {
    env.production = true;
  }

  const paths = {
    steps: env.step ?`steps/step-${env.step}/` : `common/app/`,
    dist: env.prod ? 'build': '.tmp',
    assets: 'assets',
    commons: 'common'
  };

  return {
    mode: 'development',
    entry: path.join(__dirname, paths.steps, 'index.js'),
    output: {
      path: path.resolve(__dirname, '.build'),
      filename: 'bundle.js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader'
          // Babel options are loaded from .babelrc
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.svg$/,
          loader: 'file-loader'
        },
        { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
      ]
    },
    plugins: [
      // Emit HTML files that serve the app
      new HtmlWebpackPlugin({
        template: path.join(paths.steps, '/templates/landing.html'),
        filename: path.resolve(__dirname, paths.dist, 'index.html'),
        alwaysWriteToDisk: true
      })
    ].concat(
      env.production
        ? []
        : [
            // Force writing the HTML files to disk when running in the development mode
            // (otherwise, webpack-dev-server won’t serve the app)
            new HtmlWebpackHarddiskPlugin()
          ]
    ),
    devServer: {
      contentBase: [
        path.join(__dirname, paths.dist),
        path.join(__dirname, paths.assets),
        path.join(__dirname, paths.commons)
      ],
      compress: true,
      historyApiFallback: true
    }
  };
};
