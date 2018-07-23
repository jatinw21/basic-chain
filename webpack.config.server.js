const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const StartServerPlugin = require('start-server-webpack-plugin')

module.exports = {
    entry: [
        './src/app/index.js',
        'webpack/hot/poll?1000'
    ],
    watch: true,
    target: 'node',
    externals: [nodeExternals({
        whitelist: ['webpack/hot/poll?1000']
    })],
    module: {
        rules: [{
            test: /\.js?$/,
            use: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    plugins: [
        new StartServerPlugin('server.js'),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                "BUILD_TARGET": JSON.stringify('server'),
                "HTTP_PORT": JSON.stringify(process.env.HTTP_PORT || 3002),
                "P2P_PORT": JSON.stringify(process.env.P2P_PORT || 5002),
                "PEERS": JSON.stringify(process.env.PEERS)
            }
        }),
    ],
    output: {
        path: path.join(__dirname, '.build'),
        filename: 'server.js'
    },
    mode: 'development',
}

