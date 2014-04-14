## [gulp](http://gulpjs.com)-file-activity

> Display activity of files as they are passed around

## Install

```bash
$ npm install --save-dev gulp-file-activity
```

## Usage

Here is an example using Watchify:

```js
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var activity = require('gulp-file-activity');

var createBundler = function () {
    return browserify('./src/index.js');
};

var rebundle = function (bundler) {
    var starting = new Date();

    return bundler.bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('dist'))
        .pipe(streamify(activity({ since: starting })))
    ;
}

gulp.task('scripts', function() {
    var bundler = createBundler();
    return rebundle(bundler);
});

gulp.task('watch', function () {
    var bundler = watchify(createBundler());
    var onUpdate = function () {
        return rebundle(bundler);
    };
    bundler.on('update', onUpdate);
    return onUpdate();
});
```

## API

### activity(options)

#### options

##### gzip

Type: `boolean`
Default: `false`

Displays the gzipped size instead.

##### title

Type: `string`
Default: none

Add a title to the output.

##### since

Type: `Date`
Default: none

For displaying some elapsed time.

## License
MIT
