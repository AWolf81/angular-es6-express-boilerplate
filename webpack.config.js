// webpack.config.js
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
var base = path.resolve('.'); // base directory of project
var isProduction = (process.env.NODE_ENV === 'production');
// console.log('production?', isProduction);
var PATHS = {
  app: path.join(base, 'client'),
  build: path.join(base, 'dist/public')
};

// var TARGET = process.env.npm_lifecycle_event; // start or build

// process.env.BABEL_ENV = TARGET; // needed for hot model reload config in .babelrc

var htmlWebpackConfig = new HtmlWebpackPlugin({
    template: base + '/client/index.html',
    filename: 'index.html',
    inject: 'body'
});

var vendorScripts = [
    'angular',
    // 'angular-animate',
    'angular-toastr',
    'angular-promise-cache',
    'angular-loading-bar',
    'angular-ui-router',
    'angular-moment'
];

var plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        // 'angular': 'angular'
    }),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
    new ExtractTextPlugin("bundle.css"),
    htmlWebpackConfig
];

if ( !isProduction ) {
    // we're using dev-server
    vendorScripts.push('webpack/hot/dev-server');
    // vendorScripts.push('webpack-hot-middleware/client');

    // plugins for development
    // plugins.push(
    //     new webpack.HotModuleReplacementPlugin()
    // );
} else {

    // plugins for production
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
        // new ngAnnotatePlugin({
        //         add: true,
        //         // other ng-annotate options here 
        //     })
    );
}

module.exports = {
    config: {
        PATHS: PATHS    
    },
    devtool: isProduction ? false: 'eval',
    entry:    {
		"app": [  
		    path.join(PATHS.app, "index.js")  
		],
		"vendor": vendorScripts
	},
    // It suppress error shown in console, so it has to be set to false.
    quiet: false,
    // It suppress everything except error, so it has to be set to false as well
    // to see success build.
    noInfo: false,
    stats: {
      // Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    },
    noParse: vendorScripts,
    resolve: {
        extensions: ['', '.js']
    },
    output: {  
        path: PATHS.build,
	    publicPath: '/', //scripts/',
	    filename: 'bundle.js' 
	},
	module: {
        preLoaders: [
            {
                test: /\.js?$/,
                loaders: ['eslint'],
                // define an include so we check just the files we need
                include: PATHS.app
            }
        ],
        loaders: [
            // commonjs shim for angular
            // { 
            //     loader: 'exports?window.angular', 
            //     test: require.resolve('angular') 
            // },
            // {
            //     test: /\.html$/,
            //     exclude: /index\.html/,
            //     // loader: "ng-cache?prefix=[dir]/[dir]"
            //     loader: "ng-cache"
            // },
            {
                test: /\.html$/,
                loader: "html"
            },
            // {
            //     test: /\.html$/,
            //     loader: 'ngtemplate?relativeTo=' + (path.resolve(__dirname, './src')) + '/!html'
            // },
            { test: /\.js$/, loader: 'ng-annotate!babel?presets[]=es2015', exculde: /node_modules/, cacheDirectory: true, include: PATHS.app },
            // fonts and svg
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
            {
                // images
                test: /\.(ico|jpe?g|png|gif)$/,
                loader: "file"
            },
            {
                // for some modules like foundation
                test: /\.scss$/,
                exclude: [/node_modules/], // sassLoader will include node_modules explicitly
                loader: ExtractTextPlugin.extract("style", "css!postcss!sass?outputStyle=expanded&sourceMap")
                // loaders: ["style", "css", "postcss", "sass?outputStyle=expanded&sourceMap"]
            },
            {
                test: /\.css$/,
                includePaths: [path.resolve(base, "node_modules")],
                loader: ExtractTextPlugin.extract("style", "css!postcss")
            },
            {
                test: /\.(md|txt)$/,
                loader: "raw"
            }
        ]
    },
    postcss: function(webpack) {
        return [
          autoprefixer({browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']})
        ]
    },
    sassLoader: {
        includePaths: [
            path.resolve(base, "node_modules")
        ]
    },
    plugins: plugins
};