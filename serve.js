'use strict';

const path = require('path'),
    express = require('express'),
    webpack = require('webpack'),
    webpackMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    config = require('./webpack.config');


module.exports = () => {
    const app = express();

    //setup plugins
    config.plugins = [
        //define plugin for node.env
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
    ];

    //hot reload
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    //setup no errors plugin
    config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
    //override entry for hot reload
    config.entry = ['webpack-hot-middleware/client', config.entry];

    //returns a Compile instance 
    const compiler = webpack(config);
    //starts output config
    const statsConf = {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false,
    };

    app.use(
        webpackMiddleware(compiler, {
            publicPath: config.output.publicPath,
            contentBase: 'src',
            stats: statsConf,
        })
    );
    app.use(webpackHotMiddleware(compiler));

    //serve statics
    app.use(express.static(__dirname));
    //serve index
    app.get("*", (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
    //start server
    app.listen(3000, err => {
        if (err) {
            console.log(err);
        }
        console.info('==> Server started on port 3000');
    });
};