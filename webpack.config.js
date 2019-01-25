const path = require('path');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');

// Export Files
module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const MiniCssExtract = new MiniCssExtractPlugin({
        filename: 'shareable.css',
        chunkFilename: '[id].css'
    });

    return {
        entry: ['./src/app.js'],
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'shareable.js',
            library: 'shareableJs',
            libraryTarget: 'umd'
        },
        module: {
            rules: [{
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test:/\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: function () {
                                return [autoprefixer('last 2 versions', 'ie 10')];
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }
                ],
            },]
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true // set to true if you want JS source maps
                }),
                new OptimizeCSSAssetsPlugin({})
            ]
        },
        plugins: [
            MiniCssExtract,
        ],
        stats: {
            colors: true
        },
        devtool: isProduction ? 'source-map' : 'inline-source-map'
    };
};