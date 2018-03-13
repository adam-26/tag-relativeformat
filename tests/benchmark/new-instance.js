'use strict';

global.Intl || require('intl');

var TagRelativeFormat = require('../../');

module.exports = function () {
    new TagRelativeFormat('en');
};
