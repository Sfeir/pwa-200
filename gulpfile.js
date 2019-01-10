var gulp = require('gulp');
var eslint = require('gulp-eslint');
var rev = require('gulp-rev');
var usemin = require('gulp-usemin');
var connect = require('gulp-connect');
var replace = require('gulp-replace');
var merge = require('merge-stream');
var ghPages = require('gulp-gh-pages');
var argv = require('yargs').argv;

var fs = require('fs');

var del = require('del');
var browserSync = require('browser-sync').create();

var DEFAULT_STEP = 'master';
var stepArg = process.argv.find(arg => arg.startsWith('--step-'));
var stepDir = stepArg && stepArg.replace('--step-', '');
stepDir = stepDir === '' || stepDir === 'true' ? DEFAULT_STEP : `steps/step-${stepDir}`;
if (!fs.existsSync(stepDir)) {
    stepDir = DEFAULT_STEP;
}
console.log(`Will run step ${stepDir}`);


gulp.task('copy', ['clean'], function build() {
    var fonts = gulp.src([`${stepDir}/css/font/*`])
      .pipe(gulp.dest('build/css/font/'));

    var imgs = gulp.src(`${stepDir}/img/**/*`)
      .pipe(gulp.dest('build/img/'));

    var mocks = gulp.src(`${stepDir}/mocks/*`)
      .pipe(gulp.dest('build/mocks/'));

    var templates = gulp.src(`${stepDir}/js/**/*.html`)
      .pipe(gulp.dest('build/templates/'));

    var offline = gulp.src(`${stepDir}/offline.html`)
      .pipe(gulp.dest('build/'));

    if (argv.step) {
        gulp.src(argv.step + '/**/*')
          .pipe(gulp.dest('build/'));
    }

    return merge(fonts, imgs, mocks, templates, offline);
});

gulp.task('eslint', function() {
    return gulp.src(`${stepDir}/js/**/*.js`)
      .pipe(eslint())
      .pipe(eslint.format());
});

gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: ['./common', `./${stepDir}`, './node_modules']
        },
        port: 8080
    });
    gulp.watch(`${stepDir}/**/*.html`).on('change', function(evt) {
        browserSync.reload();
    });
    gulp.watch(`${stepDir}/css/**/*.css`).on('change', function(evt) {
        browserSync.reload();
    });
    gulp.watch(`${stepDir}/js/**/*.js`).on('change', function(evt) {
        browserSync.reload();
    });
});

gulp.task('reload', ['copy', 'usemin', 'update-sw-try'], browserSync.reload);

gulp.task('usemin', ['copy'], function() {
    return gulp.src(`${stepDir}/index.html`)
      .pipe(usemin({
          css: ['concat', function() { return rev(); }],
          js: ['concat', replace(/templateUrl:\s*\'\.\/js\/components\/directives(.*)\'/, 'templateUrl: \'./templates$1\''), rev()],
          jsapp: ['concat', replace(/templateUrl:\s*\'\.\/js(.*)\'/g, 'templateUrl: \'./templates$1\''), rev()]
      }))
      .pipe(gulp.dest('build/'));
});

gulp.task('gh-pages', ['copy', 'usemin', 'update-sw', 'add-urlfolder'], function() {
    return gulp.src('./build/**/*').pipe(ghPages({force: true}));
});

gulp.task('update-sw', ['usemin'], function() {
    var css = fs.readdirSync('build/css');
    var js = fs.readdirSync('build/js');
    var sw = gulp.src(`${stepDir}/service-worker.js`)
      .pipe(replace(/CSS_APP/, 'css/' + css[0]))
      .pipe(replace(/CSS_VENDOR/, 'css/' + css[1]))
      .pipe(replace(/JS_APP/, 'js/' + js[0]))
      .pipe(replace(/JS_VENDOR/, 'js/' + js[1]))
      .pipe(replace(/'\/'/, '\'/peoples/\''))
      .pipe(gulp.dest('build'));

    var initsw = gulp.src(`${stepDir}/js/initSw.js`)
      .pipe(gulp.dest('build/js/'));

    var manifest = gulp.src(`${stepDir}/manifest/manifest.json`)
      .pipe(gulp.dest('build/manifest'));

    return merge(sw, initsw, manifest);
});

gulp.task('connect-build', ['clean', 'usemin'], function() {
    return connect.server({
        root: ['build']
    });
});

gulp.task('clean', function(cb) {
    return del('build');
});

gulp.task('default', ['watch']);
gulp.task('sw-ready', ['connect-build', 'copy', 'usemin', 'update-sw']);
gulp.task('deploy', ['gh-pages']);
