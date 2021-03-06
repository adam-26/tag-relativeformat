/* jshint node:true */

'use strict';

var TagRelativeFormat = require('./lib/main')['default'];

// Add all locale data to `TagRelativeFormat`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.
require('./lib/locales');

// Re-export `TagRelativeFormat` as the CommonJS default exports with all the
// locale data registered, and with English set as the default locale. Define
// the `default` prop for use with other compiled ES6 Modules.
exports = module.exports = TagRelativeFormat;
exports['default'] = exports;
