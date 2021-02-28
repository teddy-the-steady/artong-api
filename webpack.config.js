const path = require("path");
const slsw = require('serverless-webpack');
const { IgnorePlugin } = require('webpack');

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
	entry: path.join(__dirname, "artong/handler/artong.ts"),
  output: {
    libraryTarget: "commonjs",
    filename: "artong/handler/artong.js",
    path: path.resolve(__dirname, "dist")
  },
	module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
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
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [new IgnorePlugin({resourceRegExp: /^pg-native$/})],
}