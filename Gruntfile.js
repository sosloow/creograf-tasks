module.exports = function(grunt) {
  grunt.file.defaultEncoding = 'utf8';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    'http-server': {
      dev: {
        root: 'dist/',
        port: 3000,
        showDir: true,
        autoIndex: true,
        ext: "html",
        runInBackground: true
      }
    },

    browserify: {
      build: {
        src: 'app/client/public/index.coffee',
        dest: 'public/js/dist/public.js'
      },

      watch: {
        src: 'app/client/public/index.coffee',
        dest: 'public/js/dist/public.js',
        options: {
          keepAlive: true,
          watch: true,
          livereload: true
        }
      }
    },

    jade: {
      compile: {
        options: {
          doctype: 'html'
        },
        files: [{
          expand: true,
          cwd: 'src/jade',
          src: '*.jade',
          dest: 'dist',
          ext: '.html'
        }]
      }
    },

    stylus: {
      options: {
        compress: false,
        path: ['node_modules/jeet/stylus', 'node_modules/rupture']
        // use: [require('jeet'), require('rupture')]
      },
      compile: {
        files: [
          {
            cwd: 'views/styles',
            src: 'style.styl',
            dest: 'public/css',
            expand: true,
            ext: '.css'
          }
        ]
      }
    },

    autoprefixer: {
      dist: {
        options: {
          expand: true,
          flatten: true,
          browsers: [
            'Android >= <%= pkg.browsers.android %>',
            'Chrome >= <%= pkg.browsers.chrome %>',
            'Firefox >= <%= pkg.browsers.firefox %>',
            'Explorer >= <%= pkg.browsers.ie %>',
            'iOS >= <%= pkg.browsers.ios %>',
            'Opera >= <%= pkg.browsers.opera %>',
            'Safari >= <%= pkg.browsers.safari %>']
        },
        src: 'dist/css/**/*.css'
      }
    },

    sprite: {
      dist: {
        src: 'src/images/sprite/**/*.png',
        dest: 'dist/images/sprite.png',
        imgPath: 'dist/images/sprite.png',
        destCss: 'dist/css/sprite.css',
        algorithm: 'binary-tree',
        padding: 8,
        imgOpts: {
          format: 'png'
        }
      }
    },

    imagemin: {
      images: {
        files: [
          {
            expand: true,
            cwd: 'public/resources',
            src: ['**/*.{png,jpg,gif}', '!sprite/**/*'],
            dest: 'public/resources'
          }
        ]
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      app: {
        files: {
          'public/js/dist/cms.js': ['public/js/dist/cms.js']
        }
      }
    },

    uglify: {
      vendor: {
        options: {
          mangle: true,
          compress: true
        },
        files: {
          'bower_components/angular-ui-tinymce/src/tinymce.min.js': 'bower_components/angular-ui-tinymce/src/tinymce.js',
          'bower_components/page/page.min.js': 'bower_components/page/page.js'
        }
      },
      js: {
        options: {
          mangle: true,
          compress: true
        },
        files: {
          'public/js/dist/public.min.js': 'public/js/dist/public.js',
          'public/js/dist/cms.min.js': 'public/js/dist/cms.js'
        }
      }
    },

    karma: {
      unit: {
        configFile: 'config/karma.conf.coffee',
        runnerPort: 9999,
        singleRun: true,
        logLevel: 'INFO'
      }
    },

    watch: {
      css: {
        options: {
          livereload: true
        },
        files: ['src/css/**/*.css'],
        tasks: ['build:css']
      },
      images: {
        options: {
          livereload: true
        },
        files: ['src/images/**/*', '!src/images/sprite/**/*.png'],
        tasks: ['copy-images']
      },
      js: {
        options: {
          livereload: true
        },
        files: ['src/js/**/*.js'],
        tasks: ['copy-js']
      },
      sprite: {
        options: {
          livereload: true
        },
        files: ['src/images/sprite/**/*.png'],
        tasks: ['sprite']
      },
      jade: {
        options: {
          livereload: true
        },
        files: 'src/jade/**/*.jade',
        tasks: ['jade']
      },
      stylus: {
        options: {
          livereload: true
        },
        files: 'views/styles/**/*.styl',
        tasks: ['stylus', 'autoprefixer']
      },
      imagemin: {
        files: ['public/resources/**/*.{png,jpg,gif}', '!public/resources/sprite/**/*'],
        tasks: ['imagemin']
      },
      test: {
        files: ['app/**/*.coffee', '!app/client/**/*.coffee', 'spec/*'],
        tasks: ['test']
      },
      testClient: {
        files: ['app/client/**/*.coffee', '!app/client/public/**/*.coffee', 'spec-client/*'],
        tasks: ['karma']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('copy-css', function() {
    copyDir('src/css/', 'dist/css/');
  });

  grunt.registerTask('copy-js', function() {
    copyDir('src/js/', 'dist/js/');
  });

  grunt.registerTask('copy-images', function() {
    copyDir('src/images/', 'dist/images/');
  });

  grunt.registerTask('copy-assets', ['copy-css', 'copy-js', 'copy-images']);
  grunt.registerTask('build:css', ['copy-css', 'autoprefixer']);
  grunt.registerTask('build', ['jade', 'sprite', 'copy-assets', 'autoprefixer']);
  grunt.registerTask('default', ['build', 'http-server', 'watch']);

  function copyDir(dir, destDir) {
    return grunt.file.recurse(dir, function(abspath, rootdir, subdir, filename) {
      return grunt.file.copy(abspath, destDir + filename);
    });
  }
};
