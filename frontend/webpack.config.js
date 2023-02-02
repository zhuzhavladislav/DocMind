const path = require("path");
// you can use @refresh/reset in top of jsx to turn off it.
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin") // experimental, can be commented
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

let mode = "development"

const plugins = [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({template: "./src/index.html"}),
]

if (process.env.NODE_ENV === "production") {
    mode = "production";
}
if (process.env.SERVE) {
    plugins.push(new ReactRefreshWebpackPlugin()) // experimental, can be commented
}

module.exports = {
    mode: mode,

    output: {
        path: path.resolve(__dirname, "dist"),
        assetModuleFilename: "images/[hash][ext][query]",
    },

    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: "asset", // "asset/resource", "asset/inline"
            },
            {
                test: /\.(s[ac]|c)ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { publicPath: "" },
                    },
                    "css-loader",
                    "postcss-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },

    plugins: plugins,

    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },

    devtool: "source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        compress: true,
        hot: true,
        port: 3000,
        historyApiFallback: true,
    },
};
