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
    concurrent: {
      build: {
        tasks: ['jade']
      },
      dev: {
        tasks: ['watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    browserify: {
      build: {
        src: 'app/client/public/index.coffee',
        dest: 'public/js/dist/public.js',
        options: {
          transform: ['coffeeify']
        }
      },
      watch: {
        src: 'app/client/public/index.coffee',
        dest: 'public/js/dist/public.js',
        options: {
          transform: ['coffeeify'],
          keepAlive: true,
          watch: true,
          livereload: true
        }
      }
    },
    coffee: {
      compile: {
        options: {
          join: true
        },
        files: {
          'public/js/dist/cms.js': ['app/client/services.coffee', 'app/client/directives.coffee', 'app/client/filters.coffee', 'app/client/controllers/application.coffee', 'app/client/controllers/*.coffee', 'app/client/app.coffee']
        }
      }
    },
    jade: {
      compile: {
        options: {
          doctype: 'html'
        },
        files: [
          {
            expand: true,
            cwd: 'src/jade',
            src: '*.jade',
            dest: 'dist',
            ext: '.html'
          }
        ]
      }
    },
    stylus: {
      options: {
        compress: false,
        path: ['node_modules/jeet/stylus', 'node_modules/rupture'],
        use: [require('jeet'), require('rupture')]
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
      options: {
        browsers: ['Android >= <%= pkg.browsers.android %>', 'Chrome >= <%= pkg.browsers.chrome %>', 'Firefox >= <%= pkg.browsers.firefox %>', 'Explorer >= <%= pkg.browsers.ie %>', 'iOS >= <%= pkg.browsers.ios %>', 'Opera >= <%= pkg.browsers.opera %>', 'Safari >= <%= pkg.browsers.safari %>']
      },
      dist: {
        src: ['public/css/style.css']
      }
    },
    sprite: {
      dist: {
        src: 'public/resources/sprite/**/*.png',
        dest: 'public/resources/sprite.png',
        imgPath: '/resources/sprite.png',
        destCss: 'views/styles/helpers/sprite.styl',
        cssFormat: 'stylus',
        algorithm: 'binary-tree',
        padding: 8,
        engine: 'pngsmith',
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
      assets: {
        files: ['crs/js/**/*.js', 'crs/css/**/*.css'],
        tasks: ['copy-assets']
      },
      sprite: {
        files: ['public/resources/sprite/**/*.png'],
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
  grunt.registerTask('copy-assets', function() {
    var copyDir;
    copyDir = function(dir, destDir) {
      return grunt.file.recurse(dir, function(abspath, rootdir, subdir, filename) {
        return grunt.file.copy(abspath, destDir + filename);
      });
    };
    copyDir('src/js/', 'dist/js/');
    return copyDir('src/css/', 'dist/css/');
  });
  grunt.registerTask('build', ['jade']);
  return grunt.registerTask('default', ['build', 'copy-assets', 'http-server', 'watch']);
};
