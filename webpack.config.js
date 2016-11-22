var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');


module.exports = [{
  target: 'node',
  entry: './src/server.js',
  output: {
    path: __dirname,
    filename: "./build/server.js",
  },
  externals: [nodeExternals()],
  resolve: {
    root: __dirname,
    modulesDirectories: [
      'node_modules',
      './src',
    ],
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [new webpack.OldWatchingPlugin()],
  module: {
    loaders: [{
      loader: 'babel-loader',
      test: /\.jsx?$/,
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react'],
      },
    }],
  }
},
{
  target: 'web',
  entry: './src/client.js',
  output: {
    filename: "./static/build/client.js",
  },
  resolve: {
    root: __dirname,
    modulesDirectories: [
      'node_modules',
      './src',
    ],
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [new webpack.OldWatchingPlugin()],
  module: {
    loaders: [{
      loader: 'babel',
      test: /\.jsx?$/,
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react'],
      },
    }],
  }
},
{
  target: 'web',
  entry: './src/client2.js',
  output: {
    filename: "./static/build/client2.js",
  },
  resolve: {
    root: __dirname,
    modulesDirectories: [
      'node_modules',
      './src',
    ],
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [new webpack.OldWatchingPlugin()],
  module: {
    loaders: [{
      loader: 'babel',
      test: /\.jsx?$/,
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react'],
      },
    }],
  }
},
]
