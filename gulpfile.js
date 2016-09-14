var gulp = require('gulp');
var nunjucks = require('nunjucks');
var gnj = require('gulp-nunjucks');
var scss = require('gulp-sass');
var concat = require('gulp-concat');
var cleancss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var fs = require('fs');
var browserSync = require('browser-sync').create();
var yaml = require('yamljs');
var hljs = require('highlight.js');
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader('./src/views', {noCache: true}), {dev: true});
var NunjucksCodeHighlight = function NunjucksCodeHighlight(nunjucks, hljs) {
    this.tags = ['code'];

    this.parse = function(parser, nodes) {
        // get the tag token
        var tok = parser.nextToken();

        // parse the args and move after the block end. passing true
        // as the second arg is required if there are no parentheses
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);

        // parse the body and possibly the error block, which is optional
        var body = parser.parseUntilBlocks('endcode');

        parser.advanceAfterBlockEnd();

        // See above for notes about CallExtension
        return new nodes.CallExtension(this, 'run', args, [body]);
    };

    this.run = function(context) {
        var body = arguments[arguments.length - 1];
        var htmlResult = '';
        var format = arguments.length == 3 ? arguments[1] : 'html';
        try {
            var result = hljs.highlightAuto(body().toString(), [format]);
            htmlResult += '<pre><code class="hljs ' + format + '">';
            htmlResult += result.value;
            htmlResult += '</code></pre>';
            htmlResult = new nunjucks.runtime.SafeString(htmlResult);
        } catch (error) {
            htmlResult = undefined;
            throw new Error('Error rendering highlighted code');
        }
        return htmlResult;
    };
};
var highlight = new NunjucksCodeHighlight(nunjucks, hljs);

env.addExtension('NunjucksCodeHighlight', highlight)
    .addFilter('append', function(input, idx) {
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
    .addFilter('match', function(input, regex) {
        var options = "g";
        if (matches = /^\/(.+)\/(.*)$/.exec(regex)) {
            regex = matches[1];
            options = matches[2];
        }
        var rx = new RegExp(regex, options);
        return rx.test(input);
    })
    .addFilter('keys', function(obj) {
        return obj ? Object.keys(obj) : [];
    })
    .addFilter('empty', function(arr) {
        return !!arr && !!arr.length ? arr.length == 0 : true;;
    })
    .addFilter('fileExists', function(path, cb) {
        fs.access(path, function(err) {
            cb(!err);
        });
    }, true)
;

gulp.task('scss', function() {
    gulp.src('./src/scss/style.scss')
        .pipe(scss({includePaths: ['src/scss/']}).on('error', scss.logError))
        .pipe(cleancss())
        .pipe(rename({extname: ".min.css"}))
        .pipe(gulp.dest('./dist/assets/css/'))
    ;
});

gulp.task('js', function() {
    gulp.src(['./src/components/jquery/dist/jquery.js',
            './src/components/angular/angular.js',
            './src/components/materialize/dist/js/materialize.js',
            './src/js/*.js'], {options: {matchBase: true}})
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/assets/js/'))
    ;
});

gulp.task('fonts', function () {
    gulp.src('./src/components/materialize/fonts/**')
        .pipe(gulp.dest('./dist/assets/fonts'));
});

gulp.task('images', function () {
    gulp.src('src/images/**')
        .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('buildSchema', function() {
    var schema = yaml.load('./src/config/schema.yml');

    function createClassTemplate(c) {
        fs.access('./src/views/pages/' + c, function(err) {
            if (err) {
                fs.mkdirSync('./src/views/pages/' + c);
            }

            fs.writeFile('./src/views/pages/' + c + '/index.njk',
                "{% extends 'templates/class.njk' %}\n" +
                "{% set objName = '" + c + "' %}"
            );
        });
    }

    function createPropertyTemplate(p) {
        fs.access('./src/views/pages/' + p, function(err) {
            if (err) {
                fs.mkdirSync('./src/views/pages/' + p);
            }

            fs.writeFile('./src/views/pages/' + p + '/index.njk',
                "{% extends 'templates/property.njk' %}\n" +
                "{% set objName = '" + p + "' %}"
            );
        });
    }

    for (var c in schema.classes) {
        createClassTemplate.bind(c).call(c, c);
    }

    for (var p in schema.properties) {
        createPropertyTemplate.bind(p).call(p, p);
    }
});

gulp.task('template', function() {
    console.log(fs.readdirSync(__dirname + '/dist/assets/css/'));
    var data = {
        stylesheets: fs.readdirSync(__dirname + '/dist/assets/css/').filter(function(item) {
            return /\.css$/.test(item);
        }),
        scripts: fs.readdirSync(__dirname + '/dist/assets/js/').filter(function(item) {
            return /\.js$/.test(item);
        }),
        schema: yaml.load('./src/config/schema.yml')
    };

    console.log(data);

    gulp.src('./src/views/pages/**/*.njk')
        .pipe(gnj.compile(data, {
            env: env
        }))
        .pipe(rename({extname: ".html"}))
        .pipe(gulp.dest('./dist'))
    ;
});

gulp.task('browserSyncServer', function () {
    browserSync.init({
        files: [
            'dist/**'
        ],
        server: "./dist",
        port: 3000,
        open: "local"
    });
});

gulp.task('watch', function() {
    gulp.watch('./src/scss/**/*.scss', ['scss']);
    gulp.watch('./src/js/*.js', ['js']);
    gulp.watch('./src/config/**/*.yml', ['buildSchema']);
    gulp.watch('./src/views/**/*.njk', ['template']);
});

gulp.task('build', ['buildSchema','scss', 'js', 'fonts', 'images', 'template']);
gulp.task('default', ['build']);
gulp.task('server', ['default', 'browserSyncServer', 'watch']);