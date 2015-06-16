module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint : {
            all: ['Gruntfile.js', 'package.json', 'public/javascripts/**/*.js']
        },

        concat : {
          options: {
            // define a string to put between each file in the concatenated output
            separator: ';',
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:mm") %> */\n'
          },
          dist: {
            // the files to concatenate
            src: [
              'public/javascripts/main.js',
              'public/javascripts/components/menu.js',
              'public/javascripts/components/parent.js',
            ],
            // the location of the resulting JS file
            dest: 'dist/<%= pkg.name %>.js'
          }
        },

        uglify : {
          options: {
              banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd HH:mm") %> */\n'
          },

          dist: {
            files: {
              'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
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
              cwd: 'public/stylesheets',
              src: ['*.css', '!*.min.css'],
              dest: 'dist/css',
              ext: '.min.css'
            }]
          }
        }
    });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin']);

};