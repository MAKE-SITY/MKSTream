module.exports = function(grunt) {
  grunt.initConfig({

    jshint: {
      files: ['!client/bower_components/*.js', 'client/app/*.js', 'server/**/*.js', 'database/**/*.js'],
    },

    watch: {
      files: ['!client/bower_components/*.js', 'client/app/*.js', 'server/**/*.js', 'database/**/*.js'],
      tasks: ['jshint']
    }
  });

  //Automatic desktop notifications for Grunt errors and warnings
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  /*************************************************************
  Run `$ grunt jshint` before submitting PR
  Or run `$ grunt` with no arguments to watch files
  **************************************************************/

  grunt.registerTask('default', ['watch']);
};