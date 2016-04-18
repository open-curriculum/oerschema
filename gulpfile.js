var gulp = require('gulp');
var nunjucks = require('nunjucks');
var gnj = require('gulp-nunjucks');
var scss = require('gulp-sass');
var concat = require('gulp-concat');
var cleancss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var fs = require('fs');
var browserSync = require('browser-sync').create();
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('./src/'), {noCache: true});

env.addFilter('append', function(input, idx) {
        return input + '' + idx; // Force string operations
    })
    .addFilter('prepend', function(input, idx) {
        return idx + '' + input; // Force string operations
    })
    .addFilter('merge', function(input, arr) {
        var a = input;

        if (!(input instanceof Array)) {
            a = [input];
        }
        
        return a.concat(arr);
    })
;

gulp.task('scss', function() {
    gulp.src('./src/scss/*.scss')
        .pipe(scss({includePaths: ['./src/scss/']}))
        .pipe(cleancss())
        .pipe(rename({extname: ".min.css"}))
        .pipe(gulp.dest('css/'))
    ;
});

gulp.task('js', function() {
    gulp.src(['./src/components/jquery/dist/jquery.js',
            './src/components/angular/angular.js',
            './src/components/materialize/dist/js/materialize.js',
            './src/js/*.js'], {options: {matchBase: true}})
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js/'))
    ;
});

gulp.task('fonts', function () {
    gulp.src('src/components/materialize/fonts/**')
        .pipe(gulp.dest('./fonts'));
});

gulp.task('template', function() {
    var data = {
        stylesheets: fs.readdirSync('css/'),
        scripts: fs.readdirSync('js/')
    };

    gulp.src('src/pages/**/*.html')
        .pipe(gnj.compile(data, {
            env: env
        }))
        .pipe(gulp.dest('./'))
    ;
});

gulp.task('browserSyncServer', function () {
    browserSync.init({files: [
            'css/**/*.css',
            'js/**/*.js',
            'images/**/*',
            'fonts/**/*',
            '*.html'
        ],
        server: "./",
        port: 3000,
        open: "local",
        options: {
            ignored: 'src/*'
        }
    });
});

gulp.task('watch', function() {
    gulp.watch('./src/scss/**/*.scss', ['scss']);
    gulp.watch('./src/js/*.js', ['js']);
    gulp.watch(['./src/templates/**/*.html', './src/pages/**/*.html'], ['template']);
});

gulp.task('default', ['scss', 'js', 'fonts', 'template']);
gulp.task('server', ['default', 'browserSyncServer', 'watch']);