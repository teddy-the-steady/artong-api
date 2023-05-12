const path = require('path');
const slsw = require('serverless-webpack');
const isLocal = slsw.lib.webpack.isLocal;
const ENV = slsw.lib.serverless.service.provider.environment
const { IgnorePlugin, ProvidePlugin } = require('webpack');
const { StatsWriterPlugin } = require("webpack-stats-plugin");
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: isLocal || ENV !== 'prod' ? 'development' : 'production',
  entry: isLocal ? {
    artong: path.join(__dirname, 'artong/handler/artong.ts'),
    socket: path.join(__dirname, 'artong/handler/socket.ts'),
  } : null,
  output: isLocal ? {
    libraryTarget: 'commonjs',
    filename: 'artong/handler/[name].js',
    path: path.resolve(__dirname, 'dist')
  } : null,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.sql$/i,
        use: [
          {
            loader: 'raw-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
    new ProvidePlugin({
      WebSocket: 'ws',
      fetch: ['node-fetch', 'default'],
    }),
    new StatsWriterPlugin({
      filename: "stats.json" // Default
    })
  ],
  externalsPresets: { node: true },
  externals: [
    {
      'sharp': 'commonjs sharp',
    },
    nodeExternals()
  ]
}