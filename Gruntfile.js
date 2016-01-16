module.exports = function(grunt) {
  grunt.initConfig({

    jshint: {
      files: ['*.js', 'client/app/*.js', 'server/**/*.js', 'database/**/*.js'],
      options: {
        ignores: [
          // (TODO: add lib files here)
        ]
      }
    },

    // TODO: add uglify, concat, cssmin tasks
    
    watch: {
      files: ['client/app/*.js', 'server/**/*.js', 'database/**/*.js'],
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
};