var gulp         = require('gulp'),
    browserSync  = require('browser-sync'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csscomb      = require('gulp-csscomb'),
    pug          = require('gulp-pug'),
    htmlcomb     = require('gulp-html-prettify'),
    upmodul      = require("gulp-update-modul"),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    //sptite       = require('gulp-sprite-generator'),
    iconfont     = require("gulp-iconfont"),
    consolidate  = require("gulp-consolidate"),
    pngquant     = require('imagemin-pngquant'),
    concat       = require('gulp-concat'),
    concatCss    = require('gulp-concat-css'),
    cssmin       = require('gulp-cssnano'),
    htmlmin      = require('gulp-htmlmin'),
    jsmin        = require('gulp-uglify');


gulp.task('default', ['watch']);

gulp.task('watch', ['browser-sync', 'sass', 'pug'/*, 'concatjs', 'concatcss'*/], function() {
  gulp.watch('./app/sass/**/*', ['sass']);
  gulp.watch('./app/pug/**/*', ['pug']);
  // gulp.watch('./app/libs/**/*.css', ['concatcss']);
  // gulp.watch('./app/libs/**/*.js', ['concatjs']);
  gulp.watch('./app/libs/**/*.css', browserSync.reload);
  gulp.watch('./app/libs/**/*.js', browserSync.reload);
  gulp.watch('./app/*.html', browserSync.reload);
  gulp.watch('./app/js/*.js', browserSync.reload);
  gulp.watch('./app/css/*.css', browserSync.reload);
});

gulp.task('clean', function() {
  return del.sync('dist'); 
});

gulp.task('upd', function () {
  gulp.src('package.json')
  .pipe(upmodul('latest', 'false'));
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './app'
    }
  });
});

gulp.task('css', function(){ 
  return gulp.src('./app/css/styles.css')
    .pipe(autoprefixer(['last 20 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
    .pipe(csscomb())
    .pipe(gulp.dest('./app/css')) 
    .pipe(browserSync.stream());
});

gulp.task('html', function(){ 
  return gulp.src('./app/*.html')
    .pipe(htmlcomb({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./app'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function(){ 
  setTimeout(function() {
    return gulp.src('./app/sass/*.scss') 
      .pipe(sass.sync())
      .pipe(autoprefixer(['last 20 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
      .pipe(csscomb())
      .pipe(gulp.dest('./app/css')) 
      .pipe(browserSync.stream());
    }, 1000);
});

gulp.task('pug', function () {
  gulp.src('./app/pug/*.pug')
    .pipe(pug())
    .pipe(htmlcomb({"indent_char": ' ', "indent_size": 2}))
    .pipe(gulp.dest('./app'))
    .pipe(browserSync.stream());
});

// gulp.task('concatjs', function() {
//   return gulp.src('./app/libs/**/*.js')
//     .pipe(concat('libs.js'))
//     .pipe(gulp.dest('./app/js/'));
// });

// gulp.task('concatcss', function () {
//   return gulp.src('./app/libs/**/*.css')
//     .pipe(concatCss('libs.css'))
//     .pipe(gulp.dest('./app/css/'));
// });

gulp.task('imgmin', function() {
  return gulp.src('./app/img/**/*') 
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({plugins: [{removeViewBox: true}]})
      ],
      {use: [pngquant()]}
    ))
    .pipe(gulp.dest('./dist/img'));
});

// gulp.task('build:sprite', function() {
//   var spriteOutput;

//     spriteOutput = gulp.src('./app/img/sprite-set/*.png')
//       .pipe(sprite ({
//         baseUrl:         "./src/image",
//         spriteSheetName: "sprite.png",
//         spriteSheetPath: "/app/img"
//         }));
 
//     spriteOutput.css.pipe(gulp.dest("./app/sass"));
//     spriteOutput.img.pipe(gulp.dest("./app/image"));
// });

gulp.task("build:icons", function() {
    return gulp.src(["./app/icons/*.svg"])//path to svg icons
      .pipe(iconfont({
        fontName: "myicons",
        formats: ["ttf", "eot", "woff", "svg"],
        centerHorizontally: true,
        fixedWidth: true,
        normalize: true
      }))
      .on("glyphs", function (glyphs) {

        gulp.src("./app/icons/util/*.scss") // Template for scss files
            .pipe(consolidate("lodash", {
                glyphs: glyphs,
                fontName: "myicons",
                fontPath: "../fonts/"
            }))
            .pipe(gulp.dest("app/sass/icons/"));//generated scss files with classes
      })
      .pipe(gulp.dest("app/fonts/"));//icon font destination
});

// gulp.task('htmlmin', function() {
//   return gulp.src('./app/*.html')
//     .pipe(htmlmin({collapseWhitespace: true}))
//     .pipe(gulp.dest('./dist'));
// });

// gulp.task('cssmin', function() {
//   return gulp.src('./app/css/*.css')
//     .pipe(cssmin())
//     .pipe(gulp.dest('./dist/css'));
// });

// gulp.task('jsmin', function() {
//   return gulp.src('./app/js/*.js')
//     .pipe(jsmin())
//     .pipe(gulp.dest('./dist/js'));
// });


gulp.task('build', ['clean', 'sass', 'pug'/*, 'concatjs', 'concatcss'*/], function() {
  var buildFonts = gulp.src('./app/fonts/**/*').pipe(gulp.dest('./dist/fonts'));
  var buildJs = gulp.src('./app/js/**/*').pipe(gulp.dest('./dist/js'));
  var buildLibs = gulp.src('./app/libs/**/*').pipe(gulp.dest('./dist/libs'));
  var buildCss = gulp.src('./app/css/**/*').pipe(gulp.dest('./dist/css'));
  var buildHtml = gulp.src('./app/*.html').pipe(gulp.dest('./dist'));
  // gulp.start('jsmin');
  // gulp.start('htmlmin');
  // gulp.start('cssmin');
  gulp.start('imgmin');
});