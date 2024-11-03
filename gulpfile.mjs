import gulp from 'gulp';
import nunjucks from 'nunjucks';
import gnj from 'gulp-nunjucks';
import gulpSass from 'gulp-sass';
import sass from 'sass';
import concat from 'gulp-concat';
import cleancss from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import fs from 'fs';
import browserSync from 'browser-sync';
import yaml from 'yamljs';
import hljs from 'highlight.js';
// import del from 'del';
import { deleteAsync as del } from 'del';
import { exec } from 'child_process';

const scss = gulpSass(sass);
const bs = browserSync.create();

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('./src/views', { noCache: true }), { dev: true });

// NunjucksCodeHighlight extension
class NunjucksCodeHighlight {
    constructor(nunjucks, hljs) {
        this.tags = ['code'];
        this.nunjucks = nunjucks;
        this.hljs = hljs;
    }

    parse(parser, nodes) {
        const tok = parser.nextToken();
        const args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
        const body = parser.parseUntilBlocks('endcode');
        parser.advanceAfterBlockEnd();
        return new nodes.CallExtension(this, 'run', args, [body]);
    }

    run(context, lang = 'plaintext', bodyCallback) {
        try {
            // Ensure lang is a string and check if the language is valid
            lang = typeof lang === 'string' && this.hljs.getLanguage(lang) ? lang : 'plaintext';
    
            // Get the content from the body
            const content = typeof bodyCallback === 'function' ? bodyCallback() : bodyCallback;
            const codeContent = typeof content === 'string' ? content : '';
    
            // Highlight the code
            const highlighted = this.hljs.highlight(codeContent, { language: lang }).value;
    
            // Return the highlighted HTML
            return new this.nunjucks.runtime.SafeString(
                `<pre><code class="hljs ${lang}">${highlighted}</code></pre>`
            );
        } catch (error) {
            console.error('Error in NunjucksCodeHighlight run method:', error);
            return new this.nunjucks.runtime.SafeString(
                `<pre><code class="error">Error highlighting code: ${error.message}</code></pre>`
            );
        }
    }
}

const highlight = new NunjucksCodeHighlight(nunjucks, hljs);

env.addExtension('NunjucksCodeHighlight', highlight)
    .addFilter('append', (input, idx) => input + '' + idx)
    .addFilter('prepend', (input, idx) => idx + '' + input)
    .addFilter('merge', (input, arr) => (Array.isArray(input) ? input : [input]).concat(arr))
    .addFilter('match', (input, regex) => new RegExp(regex).test(input))
    .addFilter('keys', obj => (obj ? Object.keys(obj) : []))
    .addFilter('empty', arr => !arr || arr.length === 0)
    .addFilter('fileExists', (path, cb) => fs.access(path, err => cb(!err)), true);

function styles() {
    return gulp.src('./src/scss/style.scss')
        .pipe(scss({ includePaths: ['./src/scss/'] }).on('error', scss.logError))
        .pipe(cleancss())
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest('./dist/assets/css/'));
}

function js() {
    return gulp.src([
        './src/components/jquery/dist/jquery.js',
        './src/components/angular/angular.js',
        './src/components/materialize/dist/js/materialize.js',
        './src/js/*.js'
    ])
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/assets/js/'));
}

function fonts() {
    return gulp.src('./src/components/materialize/fonts/**')
        .pipe(gulp.dest('./dist/assets/fonts'));
}

function images() {
    return gulp.src('src/images/**')
        .pipe(gulp.dest('dist/assets/images'));
}

function resetSchema() {
    return del([
        './src/views/pages/**/*',
        '!./src/views/pages',
        '!./src/views/pages/docs/**',
        '!./src/views/pages/index.njk'
    ]);
}

async function buildSchema() {
    const schema = yaml.load('./src/config/schema.yml');

    const createClassTemplate = c => new Promise((resolve, reject) => {
        fs.access(`./src/views/pages/${c}`, err => {
            if (err) fs.mkdirSync(`./src/views/pages/${c}`);
            fs.writeFile(`./src/views/pages/${c}/index.njk`,
                `{% extends 'templates/class.njk' %}\n{% set objName = '${c}' %}`,
                err => (err ? reject(err) : resolve())
            );
        });
    });

    const createPropertyTemplate = p => {
        del([`./src/views/pages/${p}`]);
        return new Promise((resolve, reject) => {
            fs.access(`./src/views/pages/${p}`, err => {
                if (err) fs.mkdirSync(`./src/views/pages/${p}`);
                fs.writeFile(`./src/views/pages/${p}/index.njk`,
                    `{% extends 'templates/property.njk' %}\n{% set objName = '${p}' %}`,
                    err => (err ? reject(err) : resolve())
                );
            });
        });
    };

    const promises = [
        ...Object.keys(schema.classes).map(createClassTemplate),
        ...Object.keys(schema.properties).map(createPropertyTemplate)
    ];

    await Promise.all(promises);
}

function buildTemplates() {
    const data = {
        stylesheets: ['style.min.css'],
        scripts: ['bundle.min.js'],
        schema: yaml.load('./src/config/schema.yml')
    };

    return gulp.src('./src/views/pages/**/*.njk')
        .pipe(gnj.compile(data, { env }))
        .pipe(rename({ extname: ".html" }))
        .pipe(gulp.dest('./dist'));
}

function turtle(done) {
    exec('node ./src/js/generate-turtle.mjs', (err, stdout, stderr) => {
        if (err) {
            console.error('Error generating Turtle file', stderr);
            done(err);
        } else {
            console.log(stdout);
            done();
        }
    });
}

function watch() {
    gulp.watch('./src/scss/**/*.scss', styles);
    gulp.watch('./src/js/*.js', js);
    gulp.watch('./src/config/**/*.yml', template);
    gulp.watch('./src/views/**/*.njk', template);
}

function browserSyncServer() {
    bs.init({
        files: ['dist/**'],
        server: "./dist",
        port: 3000,
        open: "local"
    });
}

const template = gulp.series(resetSchema, buildSchema, buildTemplates);
const assets = gulp.parallel(styles, js, fonts, images);
const build = gulp.series(resetSchema, buildSchema, gulp.parallel(styles, js, fonts, images, buildTemplates, turtle));

export { resetSchema, buildSchema, template };
export const clearSchema = resetSchema;
export const resetSchemaTask = gulp.series(resetSchema, buildSchema);
export const templateTask = template;
export const server = gulp.series(gulp.parallel(assets, template), browserSyncServer, watch);
export default gulp.series(build, gulp.parallel(browserSyncServer, watch));