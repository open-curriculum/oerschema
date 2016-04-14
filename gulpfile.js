var gulp = require('gulp');
var swig = require('gulp-swig');
var scss = require('gulp-scss');
var concat = require('gulp-concat');
var cleancss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var fs = require('fs');
var rename = require('gulp-rename');

var setup = function(swig) {
    swig.setFilter('append', function(input, idx) {
        return input + '' + idx; // Force string operations
    });

    swig.setFilter('prepend', function(input, idx) {
        return idx + '' + input; // Force string operations
    });
};


gulp.task('scss', function() {
    gulp.src('./src/scss/style.scss')
        .pipe(scss())
        .pipe(cleancss())
        .pipe(rename({extname: ".min.css"}))
        .pipe(gulp.dest('./css/'));
});

gulp.task('uglify', function() {
    gulp.src(['./src/components/jquery/dist/jquery.js',
            './src/components/angular/angular.js',
            './src/components/materialize/dist/js/materialize.js',
            './src/js/*.js'], {options: {matchBase: true}})
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./js/'));
});

gulp.task('template', function() {
    var data = {
        stylesheets: fs.readdirSync('./css/'),
            scripts: fs.readdirSync('./js/')
    };

    gulp.src('./src/*.html')
        .pipe(swig({
            setup: setup,
            data: data
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['scss', 'uglify', 'template']);