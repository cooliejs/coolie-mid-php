/**
 * support html embed <?php?>
 * @author ydr.me
 * @create 2018年08月07日10:22:58
 */


'use strict';

var object = require('blear.utils.object');
var random = require('blear.utils.random');

var pkg = require('./package.json');

var defaults = {
    regexps: [
        /<\?php[\s\S]*?\?>/gi,
        /<\?=[\s\S]*?\?>/g
    ]
};

/**
 * 生成一个随机的字符串占位符
 * @returns {string}
 */
var genKey = function () {
    return '≤' + random.string(10) + random.guid() + '≥';
};

module.exports = function (configs) {
    configs = object.assign({}, defaults, configs);

    var sourceMap = Object.create(null);
    var mid = function (options) {
        switch (options.progress){
            case 'pre-html':
                object.each(configs.regexps, function (index, regexp) {
                    options.code = options.code.replace(regexp, function (source) {
                        var key = genKey();
                        sourceMap[key] = source;
                        return key;
                    });
                });
                break;

            case 'post-html':
                object.each(sourceMap, function (key, source) {
                    options.code = options.code.replace(key, source);
                });
                break;
        }

        return options;
    };

    mid.package = pkg;
    return mid;
};

module.exports.defaults = defaults;

