var chalk = require('chalk');
var gutil = require('gulp-util');
var prettyBytes = require('pretty-bytes');
var moment = require('moment');
var through = require('through2');
var gzipSize = require('gzip-size');

var displaySize = function (contents, gzip) {
    var size, result;
    if (gzip) {
        size = gzipSize.sync(contents);
    } else {
        size = contents.length;
    }

    result = prettyBytes(size);
    if (gzip) {
        result = result + ', gzipped';
    }
    return result;
};

module.exports = function (options) {
    options = options || {
        since: false,
        title: null,
        gzip: false
    };

    var title = options.title ? options.title + ' ' : '';
    var since = options.since;
    var gzip = options.gzip;

    return through.obj(function (file, enc, cb) {
        var now, duration, nowFormatted;

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit(
                'error',
                new gutil.PluginError('gulp-file-activity', 'Streaming not supported')
            );
        }

        now = new Date();
        nowFormatted = moment(now).format('YYYY-MM-DD HH:mm:ss.SSS');
        if (since !== undefined && typeof since.getTime === 'function') {
            duration = now.getTime() - since.getTime();
            gutil.log(
                '[' + chalk.grey(nowFormatted) + '] ' + title + chalk.blue(file.relative) +
                ' (' + displaySize(file.contents, gzip) + ') in ' +
                chalk.green('' + duration + ' ms')
            );
        } else {
            gutil.log(
                '[' + chalk.grey(nowFormatted) + '] ' + title + chalk.blue(file.relative) +
                ' (' + displaySize(file.contents, gzip) + ')'
            );
        }
        this.push(file);
        cb();
    });
};
