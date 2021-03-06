module.exports = function (grunt) {

    var libpath = require('path');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            dist: 'dist/',
            lib : 'lib/',
            tmp : 'tmp/'
        },

        copy: {
            tmp: {
                expand: true,
                cwd   : 'tmp/src/',
                src   : ['**/*.js', '**/*.map'],
                dest  : 'lib/'
            }
        },

        concat: {
            dist_with_locales: {
                src: ['dist/tag-relativeformat.js', 'dist/locale-data/*.js'],
                dest: 'dist/tag-relativeformat-with-locales.js',

                options: {
                    sourceMap: true
                }
            }
        },

        jshint: {
            all: ['index.js', 'src/*.js', '!src/en.js', 'tests/*.js']
        },

        extract_cldr_data: {
            options: {
                pluralRules   : true,
                relativeFields: true,
            },

            src_en: {
                dest: 'src/en.js',

                options: {
                    locales: ['en'],
                    prelude: '// GENERATED FILE\n',

                    wrapEntry: function (entry) {
                        return 'export default ' + entry + ';';
                    }
                }
            },

            lib_all: {
                dest: 'lib/locales.js',

                options: {
                    prelude: [
                        '// GENERATED FILE',
                        'var TagRelativeFormat = require("./core")["default"];\n\n'
                    ].join('\n'),

                    wrapEntry: function (entry) {
                        return 'TagRelativeFormat.__addLocaleData(' + entry + ');';
                    }
                }
            },

            dist_all: {
                dest: 'dist/locale-data/',

                options: {
                    wrapEntry: function (entry) {
                        return 'TagRelativeFormat.__addLocaleData(' + entry + ');';
                    }
                }
            }
        },

        bundle_jsnext: {
            dest: 'dist/tag-relativeformat.js',
            options: {
                namespace : 'TagRelativeFormat',
                sourceRoot: 'tag-relativeformat/'
            }
        },

        cjs_jsnext: {
            dest: 'tmp/'
        },

        uglify: {
            options: {
                preserveComments       : 'some',
                sourceMap              : true,
                sourceMapRoot          : 'tag-relativeformat/',
                sourceMapIncludeSources: true
            },

            dist: {
                options: {
                    sourceMapIn: 'dist/tag-relativeformat.js.map'
                },

                files: {
                    'dist/tag-relativeformat.min.js': [
                        'dist/tag-relativeformat.js'
                    ]
                }
            },

            dist_with_locales: {
                options: {
                    sourceMapIn: 'dist/tag-relativeformat-with-locales.js.map'
                },

                files: {
                    'dist/tag-relativeformat-with-locales.min.js': [
                        'dist/tag-relativeformat-with-locales.js'
                    ]
                }
            }
        },

        json_remove_fields: {
            min_source_maps: {
                options: {
                    fields: ['sourceRoot']
                },

                src: 'dist/*.min.js.map'
            }
        },

        benchmark: {
            construct: {
                src: ['tests/benchmark/new*.js']
            },
            format: {
                src: ['tests/benchmark/format*.js']
            }
        },

        connect: {
            server: {
                options: {
                    base: '.',
                    port: 9999
                }
            }
        },

        browserify: {
            test: {
                src : 'tests/browserify/app.js',
                dest: 'tmp/browserify/app.js'
            }
        },

        'saucelabs-mocha': {
            all: {
                options: {
                    urls: [
                        'http://127.0.0.1:9999/tests/index.html',
                        'http://127.0.0.1:9999/tests/browserify/index.html'
                    ],
                    testname: 'tag-relativeformat (' + (process.env.CIRCLE_BUILD_NUM  || 'local') + ')',
                    build: process.env.CIRCLE_BUILD_NUM || 'local',
                    sauceConfig: {
                        'record-video': false,
                        'capture-html': false,
                        'record-screenshots': false,
                        'command-timeout': 60
                    },
                    throttled: 3,
                    browsers: [
                        // The latest version of `intl` doesn't appear to support IE8
                        // {
                        //     browserName: 'internet explorer',
                        //     platform: 'Windows 7',
                        //     version: '8'
                        // },
                        {
                            browserName: 'internet explorer',
                            platform: 'Windows 7',
                            version: '9'
                        },
                        {
                            browserName: 'internet explorer',
                            platform: 'Windows 8',
                            version: '10'
                        },
                        {
                            browserName: 'internet explorer',
                            platform: 'Windows 8.1',
                            version: '11'
                        },
                        {
                            browserName: 'chrome',
                            platform: 'Windows 10',
                            version: '37'
                        },
                        {
                            browserName: 'firefox',
                            platform: 'Windows 10',
                            version: '32'
                        }
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-benchmark');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-bundle-jsnext-lib');
    grunt.loadNpmTasks('grunt-extract-cldr-data');
    grunt.loadNpmTasks('grunt-json-remove-fields');
    grunt.loadNpmTasks('grunt-saucelabs');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('sauce', [
        'browserify',
        'connect',
        'saucelabs-mocha'
    ]);

    grunt.registerTask('cldr', ['extract_cldr_data']);

    grunt.registerTask('compile', [
        'jshint',
        'bundle_jsnext',
        'concat:dist_with_locales',
        'uglify',
        'json_remove_fields',
        'cjs_jsnext',
        'copy:tmp'
    ]);

    grunt.registerTask('default', [
        'clean',
        'cldr',
        'compile'
    ]);
};
