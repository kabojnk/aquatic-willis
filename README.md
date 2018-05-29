# Introduction

**Disclaimer: If you're serious about doing something beyond a personal blog, please for the love of all that is holy don't ever, ever, EVER use WordPress. In fact, even if you're doing a personal blog don't use WordPress. You're polluting the web.**

Aquatic Willis is a **workflow** for WordPress theme development and deployment.
It is not a node module, it is not a framework, it is merely a glorified
Gulpfile with some utility functionality added in.

I named this project *Aquatic Willis* because this is a tiny project that nobody
will probably end up using, and thus it doesn't deserve an edgy or pithy name. I
took the names of two people on my friends list in a video game and smashed them
together.

# TL;DR: How do I use Aquatic Willis?

I've only run/tested this on OSX. Good luck, soldier.

## Prerequisites:

1. Install [nodeJS](https://nodejs.org/), if you don't already have it.
2. Install [Gulp](http://gulpjs.com/). Most easily done via this command:
`npm install --global gulp`.

## Installation

1. `npm install`
2. Edit `Gulpfile.js` and change anything you want to change in the Configuration section.
3. Type `gulp` to compile everything and deploy your themes to their destination
4. Or type `gulp --sandbox` for quick testing on a [local webserver sandbox](#sandbox).

# What does Aquatic Willis do?

*Don't use Aquatic Willis if you're not afraid to get your hands dirty. This
isn't a silver bullet, it's just merely the silver you smelt to manufacture your
own personal silver bullets.*

I made this package as a development pipeline for WordPress themes, keeping my
*source* files (e.g. .scss files and non-uglified Javascripts) **isolated** from
my local WordPress development environment
([VVV](https://github.com/Varying-Vagrant-Vagrants/VVV)), especially
when my ultimate intentions are to push these theme files to a Docker container.  

Also, I'm using the word **themes** as in the plural form. This pipeline allows
you to compile a list of themes you specify.

<a name="sandbox"></a>
## A new challenger appears! Sandbox Mode

As an added bonus, there's an additional simple **sandbox webserver** that lets
you dump your compiled sass/js/whatever files to a sandbox folder, from which
you can quickly test layouts and style tiles using static HTML templates (rather
 than having to spin things up through WordPress).  You can get this by
 running:

 ```gulp --sandbox```

 (and NOT `gulp sandbox`).

## Aquatic Willis is a conventional workflow

I'm generally not a fan of added fragmentation of a development pipeline. You
shouldn't be, either. But if you're like me and just wanted a quick way to go
about theme development and exploration, and find this method just as
conventional as I do, feel free to use it. Otherwise, use something else. I'm
sure I'm not the first one to tackle something like this.

# What do I do with Aquatic Willis?

At it's core, Aquatic Willis is just a glorified Gulpfile.

Aquatic Willis is loosely-defined enough for you to use it as a boilerplate for
your own stuff. Don't like Sass (heathen)? Take it out and replace it with Less.
Want CoffeeScript implementation (hipster)? Add that in as a Gulp task.

There's a configuration section within the Gulpfile itself where you can change
things like the output directories, the themes to process, etc.

## The directory structure for source themes

Really, this structure can work any way as long as you modify the config
variables correctly. The default way this is setup is to have this structure in
the root directory where this readme file is:

```
- source_themes/    <-- folder where all source themes are kept
  - [theme_name]/   <-- the theme folder
    - sass/         <-- all Sass files
    - js/           <-- all javascript files
    - images/       <-- all image files
    - [theme_name]  <-- all WP-related theme files (yes, the theme name is redundant)
```

**Just because you add a theme to the `themes/` folder doesn't mean it will be
process by Gulp**. You have to explicitly set each theme (aka theme directory
  name) in the configuration section:

```
// This is the list of themes to run the Gulp task on.
var themes = ['a_base_theme', 'another_theme_i_just_added'];
```

Why? Maybe you don't want to process every single theme that's sitting in the
directory, especially if you start racking up tons of them.  Aquatic Willis is
lightweight enough for anyone to change this to work in a more automated fashion
if he/she wants.

## What happens when I run the Gulp file?

For each theme defined in the config array, it will run gulp tasks on each one
of the themes within the source themes directory (`./source_themes` by default)
and spit out the processed theme (sans any .scss or unused javascript files)
into a specified output directory named `./derp` by default—**you should
eventually change this to where your VVV install has its themes directory.**

## The Predefined Gulp Tasks

1. The "theme_files" are the all of your theme files (PHP files, etc). Keep in mind that this operation happens first, meaning that the following CSS, Javascripts or Images tasks could potentially overwrite any other files inside your "theme_files" directory. This is generally desired behavior, because odds are you'd want the processed CSS/JS/Image file over whatever was lurking inside that directory in the first place.
2. The CSS task will compile all Sass files found. It will then minify and spit out a single .css file for use.
3. The Javascripts task will uglify and concat all of the javascript files found in the js source files directory.
4. The Images task will minify and copy over all image files in the predefined location and copy them over into an images/ subdirectory inside your output theme.
4. The "webserver" task, only executed when you're running the file in [sandbox](#sandbox) mode.
