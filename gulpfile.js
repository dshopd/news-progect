var gulp = require("gulp"),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	plumber = require('gulp-plumber'),
    sassLint = require('gulp-sass-lint'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    pug = require("gulp-pug"),
    wiredep = require("wiredep").stream,
    browserSync = require('browser-sync').create();

//bower compile 
 

gulp.task('bower', function () {  
  	return gulp.src('./app/index.html') 
	    .pipe(wiredep({
	      directory: './app/bower_components',
	      bowerJson: require('./bower.json'),
	    }))
	    .pipe(gulp.dest('./app/'))
	    .pipe(browserSync.stream());
});










//pug compile
gulp.task('pug', function() {
	return gulp.src('app/pug/*pug')
		.pipe(plumber())
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest('app/'))
		.pipe(browserSync.stream());
		
});

//sass compile
gulp.task('sass', function() {
	return gulp.src('app/sass/*.sass')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(prefixer({
			browsers: ['last 2 versions'],
			cascade: true
		}))
		.pipe(gulp.dest('app/css/'))
		.pipe(browserSync.stream());
});


//img compile
gulp.task('img', function(){
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			une: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img'))
});

//script
gulp.task("js", function () {
	return gulp.src('app/js/main.js')
		.pipe(gulp.dest('app/js/'))
		.pipe(browserSync.stream());
})

gulp.task("script", function () {
	return gulp.src([
			'app/bower_components/jquery/dist/jquery.min.js',
		])
		.pipe(concat('libs.min.js'))
		.pipe(gulp.dest('app/js/'))
});


//watch
gulp.task('watch', function() {
	gulp.watch('app/pug/**/*.pug', ['pug']);
	gulp.watch('app/sass/*.sass', ['sass']);
	gulp.watch('app/js/*.js', ['js']);
});


//server
gulp.task('browser-sync', function() {
	browserSync.init({
		port: 3000,
		server: {
			baseDir: 'app/'
		}
	});
});



//clean
gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('clean', function(){
	return cache.clearAll();
});



gulp.task('default', ['browser-sync', 'watch', 'pug', 'sass', 'js']);

gulp.task('build', ['clean', 'img'], function() {

	var buildCss = gulp.src([
		'app/css/main.css',
	])
		.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src(['app/fonts/**/*'])
		.pipe(gulp.dest('dist/fonts'));



	var buildHtml = gulp.src(['app/*.html'])
		.pipe(gulp.dest('dist/'));

	var buildJs = gulp.src(['app/js/*.js'])
		.pipe(gulp.dest('dist/js'));

	var buildSvg = gulp.src(['app/img/**/*.svg'])
		.pipe(gulp.dest('dist/img'));

});