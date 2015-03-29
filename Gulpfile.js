var      gulp = require('gulp'),
         path = require('path'),
         sass = require('gulp-sass'),
       uglify = require('gulp-uglify'),
       concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
         neat = require('node-neat').includePaths,
         argv = require('yargs').argv,
     imagemin = require('gulp-imagemin'),
     pngquant = require('imagemin-pngquant');


/*_---_-_-__---__----____------------------.
//------------------------------------------------------------------------------
//
//  AQUATIC WILLIS
//  by Kevin Mahoney <kevin@blackomen.org>
//
//
//  This is the Aquatic Willis Gulp file. Here is how it works:
//
//  Three tasks are run on each theme: 1) CSS, 2) Javascripts, 3) images, and
//  4) Move the rest of the theme files.
//
//  The major idea here is to run tasks on "source directories", which are
//  themes that contain the raw files before we do any Sass compiling, JS
//  uglifying, etc.  Once we run our Gulp tasks, we then pipe our files to
//  a destination theme directory. This way we don't have Sass files and
//  stray javascript files lying around in our finished product.
//
//  1) The "theme_files" are all of the theme-related files. PHP files, text
//     files. This is the first batch of files to be copied over. Some of these
//     files might run the risk of being overwritten by the CSS, Javascripts, or
//     Images tasks.
//
//  2) The CSS task will compile all Sass files found. It will then minify
//     and spit out a single .css file for use.
//
//  3) The Javascripts task will uglify and concat all of the javascript
//     files found in the js source files directory.
//
//  4) The Images task will minify all images and copy them over to an "images/"
//     folder inside a theme.
//
//  Really, this structure can work any way as long as you modify the variables
//  below.  For the Black Omen site I'm building, I've decided to structure my
//  source folders in the following way:
//
//  - [theme_name]/
//    - sass/         <-- all Sass files
//    - js/           <-- all javascript files
//    - images/       <-- all images
//    - [theme_name]  <-- all WP-related theme files
//
//
//  ***** A NEW CHALLENGER APPEARS! *****
//
//  There's now an argument to run with the Gulpfile called "--sandbox". When
//  you execute it, it will dump your files into a sandbox directory (which
//  can be specified in the configuration section).  It will also kickstart
//  a simple static file webserver from that directory, which makes it handy for
//  testing out layouts and style tiles based on your compiled CSS/scripts.
//
//------------------------------------------------------------------------------
--_-_-_--___--____-__----_---_--_------_-*/





/*_---_-_-__---__----____------------------
         c o n f i g u r a t i o n
--_-_-_--___--____-__----_---_--_------_-*/


// This is the list of themes to run the Gulp task on.
var themes = ['a_base_theme'];

// This is the folder where all of the source themes are stored
var source_themes_dir = './source_themes';

//var destination = '../../vagrant/www/blackomen/htdocs/wp-content/themes';
var destination = './derp/';

// Paths/files within each theme that we want to use for the various gulp tasks.
var source_files = {
  theme_files: '**',
  scss: 'sass/**/*.scss',
  javascripts: 'js/**/*.js',
  images: 'images/**'
};

// This is when you want to pipe your CSS/JS files to a sandbox directory
// (minus WordPress files) in order to test things out on a static HTML page.
if (argv.sandbox) {
  destination = './sandbox';
}

var web_server = {
  port: 3001
};


/*_---_-_-__---__----____------------------
                 t a s k s
--_-_-_--___--____-__----_---_--_------_-*/


// Stylesheets
gulp.task('styles', function(){

  themes.forEach(function(theme_key){
    return gulp.src(path.join(source_themes_dir, theme_key, source_files.scss))
        .pipe(sass({
            includePaths: ['styles'].concat(neat)
        }))
        .pipe(concat('style.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(path.join(destination, theme_key)));
  });
});

// Javascripts
gulp.task('javascripts', function(){
  themes.forEach(function(theme_key){
    return gulp.src(path.join(source_themes_dir, theme_key, source_files.javascripts))
        .pipe(uglify())
        .pipe(concat('blackomen.js'))
        .pipe(gulp.dest(path.join(destination, theme_key, 'js')));
  });
});

// Images
gulp.task('images', function () {
  themes.forEach(function(theme_key){
    return gulp.src(path.join(source_themes_dir, theme_key, source_files.images))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.join(destination, theme_key, 'images')));
  });
});

// Copy over theme files
gulp.task('theme_files', function(){
  themes.forEach(function(theme_key){
    return gulp.src(path.join(source_themes_dir, theme_key, theme_key, source_files.theme_files))
        .pipe(gulp.dest(path.join(destination, theme_key)));
  });
});

// Run a small static file webserver (for use when using --sandbox)
gulp.task('webserver', function() {

  // Let's not do this if we're not playing in the sandbox
  if (!argv.sandbox) {
    return;
  }

  // only load webServer when we need it
  var webserver = require('gulp-webserver');
  return gulp.src(path.resolve(destination))
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      port: web_server.port
  }));
});

// Default task ("RUN ALL THE TASKS!")
var allTasks = ['theme_files', 'styles', 'javascripts', 'webserver'];
if (!argv.sandbox) {
  allTasks.pop();
}
gulp.task('default', allTasks);
