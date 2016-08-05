# AngularJS with Express server bundled with Webpack

I'm using this setup for my current web app project. There are many things to 
improve but I think it's not bad for starting web apps with Express and AngularJS.

## Installation & Usage

Run `npm install` to install the dependencies.

Start webpack-dev-server with `npm start`.

## Build info

- ES6 transpiled with Babel
- SASS pre-processing (webpack)
- Vendor and app bundles
- Express server for bundling with webpack and serving webpages
- Uglify to minify bundles for production build

## Possible improvements

- Deploy to Heroku not tested
- Add Karma server for unit testing
- NgAnnotate needs to be tested
- Swagger for API doc. would be great
- Check dependencies (maybe some are not needed)
- Jade views (new name Pug) not used yet.
- Starting of server can take a while. Speed improvement would be good.

## Known issues
- `Node-sass` installation can be problematic on Windows. I don't remember how I've fixed it but I know it wasn't that easy. (Google for visual studio & node-sass or check for node-sass binaries for Windows.)

## Licence
MIT - @copy;2016 A. Wolf 