module.exports = function(grunt) {

    var aSources = ['source/<%= pkg.name %>.js', 'source/*.js' ];

    // config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            build: {
                src: aSources,
                dest: 'build/<%= pkg.name %>.src.js'
            }
        },
        uglify: {
            build: {
                src: aSources,
                dest: 'build/<%= pkg.name %>.min.js'
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);
}