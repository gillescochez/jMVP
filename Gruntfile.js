module.exports = function(grunt) {

    var aSources = [
        'build/header.js',
        'source/<%= pkg.name %>.js',
        'source/*.js',
        'build/footer.js'
    ];

    // config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        qunit: {
            all: ['tests/index.html']
        },
        concat: {
            build: {
                src: aSources,
                dest: 'build/<%= pkg.name %>.src.js'
            }
        },
        uglify: {
            build: {
                src: ['build/<%= pkg.name %>.src.js'],
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        jsdoc: {
            dist: {
                src: ['source/*.js'],
                options: {
                    destination: 'api-doc'
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
    grunt.registerTask('default', ['qunit', 'concat', 'uglify', 'jsdoc']);
}