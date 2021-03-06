'use strict';
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/main.ts',
    watch: true,
    output: {
        filename: 'compressImg.js',
        path: path.resolve('dist'),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.(.*)?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                },
                exclude: path.resolve(__dirname, 'node_modules'),
            },
        ],
    },
    target: 'node',
    node: {
        __dirname: true,
    },
};
