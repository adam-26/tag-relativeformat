'use strict';

global.Intl || require('intl');

var TagRelativeFormat = require('../../');

var o = new TagRelativeFormat('en');

var ts = new Date().getTime() - 366 * 24 * 60 * 30 * 1000;

module.exports = function () {
    o.format(ts);
};
