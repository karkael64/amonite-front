const { series } = require('gulp');

const { dev, build, server } = require( './config/gulp.dev' );
const { prod } = require( './config/gulp.prod' );
exports.default = dev;
exports.dev = dev;
exports.prod = prod;
exports.build = build;
exports.server = server;
