var gulp = require('gulp'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    del = require('del'),
    gulpif = require('gulp-if'),
    inlineSource = require('gulp-inline-source'),
    replace = require('gulp-replace'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    runSequence = require('run-sequence').use(gulp),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    util = require('gulp-util'),
    cssmin = require('gulp-cssmin');
    sourcemaps = require('gulp-sourcemaps');


/*less conversion*/
//gulp.task('less', function () {
  //return gulp.src('./library/less/**/index.less')
	//.pipe(sourcemaps.init())
    //.pipe(less())
	//.pipe( sourcemaps.write() )
    //.pipe(gulp.dest('./library/dev/css/'));
//});

var conf = {
  "project": "KodeBeagle",
  "cwd": ".",
  "dist": "dist",
  "match": "scripts/gen",
  "files": {
    mainPage: {"indexFile": "index.html", cwd: true},
    searchPage: {"indexFile": "search/index.html", cwd: false},
    repoPage: {"indexFile": "repository/index.html", cwd: false},
    exploreRepoPage: {"indexFile": "explorerepo/index.html", cwd: false},
    explorePage: {"indexFile": "explore/index.html", cwd: false}
  },
  "js": []
};

  function minifyFile(page) {
    var cwd = "";
    gutil.log(page);
    if (!page.cwd) {
      cwd = "../";
    }

    return gulp.src(page.indexFile)
        .pipe(useref({
          transformPath: function (filePath) {
            return filePath;
          }
        }))
        .pipe(gulpif('*.min.js', uglify({mangle: false})))
        .pipe(replace(conf.match, cwd + conf.dist + "/"  +conf.match))
        .pipe(inlineSource({compress: false}))
        .pipe(gulpif('*.js', rev()))
        .pipe(revReplace())
        .pipe(gulp.dest(conf.dist));
  }

  gulp.task('mainPage:minify', function () {
    return minifyFile(conf.files.mainPage);
  });

  gulp.task('copyExploreFile', function () {
    gulp.src(conf.dist + "/index.html")
        .pipe(gulp.dest(conf.dist+"/explore"))
  });

  gulp.task('copyExpRepIndexFile', function () {
    gulp.src(conf.dist + "/index.html")
        .pipe(gulp.dest(conf.dist+"/explorerepo"))
  });

  gulp.task('copyRepoFile', function () {
    gulp.src(conf.dist + "/index.html")
        .pipe(gulp.dest(conf.dist+"/repository"))
  });

  gulp.task('copySearchIndexFile', function () {
    gulp.src(conf.dist + "/index.html")
        .pipe(gulp.dest(conf.dist+"/search"))
  });

  gulp.task('searchPage:minify', function () {
    return minifyFile(conf.files.searchPage);
  });

  gulp.task('repoPage:minify', function () {
      return minifyFile(conf.files.repoPage);
  });

  gulp.task('exploreRepoPage:minify', function () {
    return minifyFile(conf.files.exploreRepoPage);
  });

  gulp.task('explorePage:minify', function () {
    return minifyFile(conf.files.explorePage);
  });


  gulp.task('clean', function () {
    del(conf.dist);
  });

  gulp.task('cssmin', function () {
    return gulp.src('./library/less/**/index.less')
        .pipe(less())
        .pipe(cssmin())
        .pipe(gulp.dest('./library/dist/css/'));
  });

  gulp.task('deployProd', function (done) {
    gutil.log('This will take a while, please wait..');
    runSequence(
        ['clean'],
        'searchPage:minify',
        'copySearchIndexFile',
        'repoPage:minify',
        'copyRepoFile',
        'exploreRepoPage:minify',
        'copyExpRepIndexFile',
        'explorePage:minify',
        'copyExploreFile',
        'mainPage:minify',
        done);
  });

/*var concat = require( 'gulp-concat' );
var uglify = require( 'gulp-uglify' );
var ngAnnotate = require('gulp-ng-annotate');
var gzip = require('gulp-gzip');
gulp.task('jsmin', function() {
    gulp.src( [
		'./library/dev/js/vendors/ui-ace.js',
		'./library/dev/js/factories/http-service.js',
		'./library/dev/js/ng-modules/better-docs.js'
	] )
    .pipe(concat('script.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('./library/dist/js/vendors/'));
});*/

/*
gulp.task( 'build', [ 'jsmin', 'cssmin' ], function(){
    gulp.src('./library/dist/js/vendors/script.js')
    .pipe(gzip({ gzipOptions: { level: 9 } }))
    .pipe(gulp.dest('./library/dist/js/vendors/'));
});*/

var prettify = require('gulp-jsbeautifier');
gulp.task('format-js', function() {
  gulp.src(['./library/dev/js/**/*.js'])
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
    .pipe(gulp.dest('./library/dev/js/'));
});

/*jshint comes here*/
var stylish = require('jshint-stylish');
var jshint = require('gulp-jshint');
var gulp   = require('gulp');
gulp.task('jshint', function() {
  return gulp.src(['./library/dev/js/ng-modules/demo.js'] )
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});


/*minfy all the files in ace directory
gulp.task( 'build-ace', [ 'jsmin', 'cssmin', 'ace-min' ], function(){
    console.log( 'done' );
}) */
