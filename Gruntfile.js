module.exports = function(grunt) {
  grunt.initConfig({

    jshint: {
      files: ['*.js', 'client/app/**/*.js', 'server/**/*.js', 'database/**/*.js', '*.json', 'spec/**/*.js'],
      options: {
        ignores: [
          
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
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'client/lib/nochunkbufferfixpeer.min.js',
            'bower_components/localforage/dist/localforage.min.js',
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/angular-ui-notification/dist/angular-ui-notification.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
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
      files: ['client/app/**/*.js'],
      tasks: ['jshint']
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
  grunt.registerTask('minall', ['uglify', 'cssmin']);
};
