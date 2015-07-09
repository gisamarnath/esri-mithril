module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint : {
            all: ['Gruntfile.js', 'package.json', 'app/javascripts/**/*.js'],
            options: {
                jshintrc: true
            }
        },

        jsdoc : {
          dist : {
            src: ['app/javascripts/**/*.js']
          }
        },

        concat : {
          options: {
            // define a string to put between each file in the concatenated output
            // separator: ';',
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:mm") %> */\n'
          },
          js: {
            // the files to concatenate
            src: [
              'node_modules/minpubsub/minpubsub.js',
              'app/javascripts/main.js',
              'app/javascripts/util/util.js',
              'app/javascripts/util/auth.js',
              'app/javascripts/components/component-header.js',
              'app/javascripts/components/popup.js',
              'app/javascripts/components/basemaps.js',              
              'app/javascripts/components/layers.js',
              'app/javascripts/components/tools.js',
              'app/javascripts/components/menu.js',
              'app/javascripts/components/parent.js',
            ],
            // the location of the resulting JS file
            dest: 'dist/<%= pkg.name %>.js'
          },
          // concats all css to dist/css
          css: {
            src: [
              'app/stylesheets/*.css',
            ],
            dest: 'dist/<%= pkg.name %>.css'
          }
        },

        uglify : {
          options: {
              banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:mm") %> */\n'
          },

          dist: {
            files: {
              'dist/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
            }
          }
        },

        cssmin : {
          options: {
            shorthandCompacting: false,
            roundingPrecision: -1
          },
          target: {
            files: [{
              expand: true,
              cwd: 'dist',
              src: ['*.css', '!*.min.css'],
              dest: 'dist',
              ext: '.min.css',
              extDot: 'last' // Extensions in filenames begin after the last dot. http://stackoverflow.com/a/24702850/23566
            }]
          }
        }
    });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jsdoc');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin', 'jsdoc']);

};
