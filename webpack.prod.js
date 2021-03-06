const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { SourceMapDevToolPlugin } = require("webpack");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "public"),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: "css-loader",
                        options: {
                            esModule: true,
                            modules: {
                                compileType: "module",
                                mode: "local",
                                auto: true,
                                exportLocalsConvention: "camelCaseOnly",
                                localIdentName: "[local]-[hash:base64:5]",
                            },
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all",
        },
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
            new HtmlMinimizerPlugin({
                minimizerOptions: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeAttributeQuotes: true,
                    removeEmptyAttributes: true,
                },
            }),
        ],
    },
    plugins: [
        new ImageMinimizerPlugin({
            test: /\.(png|jpe?g|gif)$/i,
            minimizerOptions: {
                plugins: ["gifsicle", "jpegtran", "optipng"],
            },
            loader: false,
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
        }),
        new SourceMapDevToolPlugin({
            filename: "[file].map",
        }),
    ],
});
