var gulp = require('gulp');

var zip = require('gulp-zip');
var size = require('gulp-filesize');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');

var zipFile = 'js13k.zip';

var paths = {
    scripts: ['player.js','game.js', 'canvasManagement.js'],
    pngs:['*.png'],
    htmls:['*.html'],
    dist:'./deploy/',
    processed: './deploy/*.*'
};

gulp.task('copyResources', function() {
    gulp.src(paths.pngs)
        .pipe(gulp.dest(paths.dist));
});

gulp.task('minifyHTML', function() {
    gulp.src(paths.htmls)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('uglify', function() {
    gulp.src(paths.scripts)
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('deploy', function() {

    gulp.src(paths.processed)
        .pipe(zip('js13k.zip'))
        .pipe(gulp.dest(paths.dist));

});

gulp.task('size', function() {
    gulp.src(paths.dist+zipFile)
        .pipe(size());
});

gulp.task('default', function() {

});