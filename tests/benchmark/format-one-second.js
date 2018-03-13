'use strict';

global.Intl || require('intl');

var TagRelativeFormat = require('../../');

var o = new TagRelativeFormat('en');

var ts = new Date().getTime() - 1001;

module.exports = function () {
    o.format(ts);
};
