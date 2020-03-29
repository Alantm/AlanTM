var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var sassdoc = require('sassdoc');
var del = require('del') ;

var input = './wwwroot/sass/**/*.scss';
var output = './wwwroot/css';

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'compressed'
};
var autoprefixerOptions = {
    browsers: ['last 4 versions', '> 5%', 'Firefox ESR']
};

var sassdocOptions = {
    dest: './public/sassdoc'
};

gulp.task('sass', function () {
    return gulp
        // Find all `.scss` files from the `stylesheets/` folder
        .src(input)
        //.pipe(sourcemaps.init())
        // Run Sass on those files
        .pipe(sass(sassOptions).on('error', sass.logError))
        //.pipe(sourcemaps.write('./stylesheets/maps'))
        .pipe(autoprefixer(autoprefixerOptions))
        // Write the resulting CSS in the output folder
        .pipe(gulp.dest(output))
        //.pipe(sassdoc(sassdocOptions))
        // Release the pressure back and trigger flowing mode (drain)
        // See: http://sassdoc.com/gulp/#drain-event
        .resume();
});

gulp.task('sassdoc', function () {
    return gulp
        .src(input)
        .pipe(sassdoc(sassdocOptions))
        .resume();
});

gulp.task('prod', gulp.series('sassdoc', function () {
    return gulp
        .src(input)
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(output));
}));

gulp.task('clean', function (cb) {
    del.sync(['./wwwroot/css/**']);
    cb();
});

gulp.task('watch', gulp.series('clean', function() {
    return gulp
        // Watch the input folder for change,
        // and run `sass` task when something happens
        .watch(input, gulp.series('sass'))
        // When there is a change,
        // log a message in the console
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
}));

gulp.task('default', gulp.parallel('clean', 'sass', 'watch'));