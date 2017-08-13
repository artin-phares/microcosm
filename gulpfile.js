/* global require, __dirname */

const gulp = require('gulp');

const nodemon = require('gulp-nodemon');
const pack = require('./gulpfile.pack.js').pack;
const getPackConfig = require('./gulpfile.pack.js').getPackConfig;
const test = require('./gulpfile.test.js');
const eslint = require('gulp-eslint');

const config = require('./gulpfile.config.js');

gulp.task('serv', function() {
    nodemon({
        script: config.src.serv.entry,
        watch: config.src.serv.root,
        env: {
            NODE_PATH: '$NODE_PATH;' + __dirname
        }
    });
});

gulp.task('build', function() {
    return pack({
        root: config.src.client.root,
        entry: config.src.client.entry,
        output: {
            path: config.src.client.output.path,
            name: config.src.client.output.name
        }
    });
});

gulp.task('build:watch', ['serv'], function() {
    return pack({
        root: config.src.client.root,
        entry: config.src.client.entry,
        output: {
            path: config.src.client.output.path,
            name: config.src.client.output.name
        },
        watch: true,
        serv: {
            host: 'localhost',
            port: 3001,
            public: config.src.serv.public
        }
    });
});

const getUnitTestPackConfig = () =>
    getPackConfig({
        root: [
            // to explicitly import src/test modules from tests.
            // eg. when importing 'utils' it is not clear
            // whether its source utils or test utils. better
            // use explicit notation 'src/utils' or 'test/utils'
            config.root,

            // for src-modules internal references to work
            config.src.client.root
        ],
        output: {
            path: config.test.unit.output.path,
            name: config.test.unit.output.name
        }
    });

gulp.task('test-unit', function(done) {
    return test.runUnitTests({
        packConfig: getUnitTestPackConfig(),
        entry: config.test.unit.entry,
        watch: false
    });
});

gulp.task('test-unit:watch', function(done) {
    return test.runUnitTests({
        packConfig: getUnitTestPackConfig(),
        entry: config.test.unit.entry,
        watch: true
    });
});

gulp.task('test-lint', function() {
    return gulp.src(['**/*.js', '**/*.jsx'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('test', ['test-lint', 'test-unit']);

gulp.task('default', ['build:watch']);