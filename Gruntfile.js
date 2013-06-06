module.exports = function(grunt) {

    var aSources = [
        'build/header.js',
        'source/<%= pkg.name %>.js',
        '!source/shims.js', // we remove shims on build as qunit task need them :(
        'source/jMVP-domWrap.js',
        'source/jMVP-Model.js',
        'source/jMVP-Presenter.js',
        'source/jMVP-tools.js',
        'source/jMVP-View.js',
//        'source/*.js',
        'build/footer.js'
    ];

    // config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        qunit: {
            all: [
                'tests/index.html',
                'tests/jMVP.Model.html'
//                'tests/jMVP.View.html'
            ]
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
        },
        copy: {
            main: {
                src: ['build/jsdoc.css'],
                dest: 'api-doc/styles/jsdoc-default.css'
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
    grunt.registerTask('default', ['qunit', 'concat', 'uglify']);
    grunt.registerTask('doc', ['jsdoc', 'copy']);
}