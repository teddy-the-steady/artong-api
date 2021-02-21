const path = require("path");
const { IgnorePlugin } = require('webpack');

module.exports = {
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
      }
    ]
  },
	resolve: {
    extensions: [".tsx", ".ts", ".js", ".sql"]
  },
  plugins: [new IgnorePlugin({resourceRegExp: /^pg-native$/})],
}