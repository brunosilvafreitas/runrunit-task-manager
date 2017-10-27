const webpack = require('webpack');

const plugins = [
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    mangle: {
      screw_ie8: true,
      keep_fnames: true
    },
    compress: {
      warnings: false,
      screw_ie8: true
    },
    comments: false
  })
];

module.exports = [{
  entry: ['babel-polyfill', "./app/index.js"],
  output: {
    filename: "dist/bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['react', 'env'],
          plugins: ['add-module-exports']
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          }
        ]
      }
    ]
  },
  watchOptions: {
    poll: true
  },
  plugins
}, {
  entry: ['babel-polyfill', "./app/background.js"],
  output: {
    filename: "dist/eventPage.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env'],
          plugins: ['add-module-exports']
        }
      }
    ]
  },
  watchOptions: {
    poll: true
  },
  plugins
}];