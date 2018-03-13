if (typeof global.Intl === 'undefined'){
    global.Intl = require('intl');
}

global.TagRelativeFormat = require('../');
global.expect = require('expect.js');

require('./index');
