const path = require('path');
const exit = require('process').exit;
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

module.exports = function(env = {}, args) {
  if (process.env.NODE_ENV === 'production') {
    env.production = true;
  }

  console.log(`=== Running ${env.step ? `step ${env.step}` : `the base app`} ===`);

  let paths;
  try {

    paths = {
      step: env.step ? `steps/${env.step}/` : `common/app/`,
      dist: env.prod ? 'build': '.tmp',
      assets: 'assets',
      commons: 'common',
    };

    fs.accessSync(path.resolve(__dirname, paths.step));

    const indexTemplate = path.join(paths.step, '/templates/landing.html');
    fs.accessSync(indexTemplate, fs.constants.R_OK);

  } catch {
    console.error(`

    ¯\_(ツ)_/¯ Oops ...

Sorry, but step ${env.step} does not exist, or isn't supported by this webpack config !
Check the folder name in steps/, read the README and try again.

    `);
    exit();
  }

  try {
    const stepIndex = path.join(__dirname, paths.step, 'index.js');
    fs.accessSync(stepIndex, fs.constants.R_OK);
    paths.indexjs = stepIndex;
  } catch (err) {
    paths.indexjs = path.resolve('common/app', 'index.js')
  }

  return {
    mode: 'development',
    entry: paths.indexjs,
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
        template: path.join(paths.step, '/templates/landing.html'),
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
        path.join(__dirname, paths.commons),
        path.join(__dirname, paths.step)
      ],
      compress: true,
      historyApiFallback: true
    }
  };
};
