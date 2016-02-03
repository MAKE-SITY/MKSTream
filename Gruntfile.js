module.exports = function(grunt) {
  grunt.initConfig({

    jshint: {
      files: ['*.js', 'client/app/**/*.js', 'server/**/*.js', 'database/**/*.js', '*.json', 'spec/**/*.js'],
      options: {
        ignores: [
          // (TODO: add lib files here)
        ]
      }
    },

    uglify: {
      target: {
        files: {
          // These need to be uglified in specific order, app files last.
          'client/allmincode.js': [
            'bower_components/adjective-adjective-animal/dist/adjective-adjective-animal.min.js',
            'bower_components/angular/angular.min.js',
            'bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'client/lib/nochunkbufferfixpeer.min.js',
            'bower_components/localforage/dist/localforage.min.js',
            'bower_components/jquery/dist/jquery.min.js',
            'client/app/**/*.js'
          ]
        }
      }

    },

    cssmin: {
      target: {
        files: {
          'client/assets/styles.min.css': ['client/assets/styles.css']
        }
      }
    },

    watch: {
      files: ['client/app/**/*.js', 'client/assets/styles.css'],
      tasks: ['uglify', 'cssmin']
    }
  });

  //Automatic desktop notifications for Grunt errors and warnings
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  /*************************************************************
  Run `$ grunt jshint` before submitting PR
  Or run `$ grunt` with no arguments to watch files
  **************************************************************/

  grunt.registerTask('default', ['watch']);
};
