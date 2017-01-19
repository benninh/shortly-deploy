module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '',
      },
      client: {
        src: ['public/client/*'],
        dest: 'public/dist/client.js'
      },
      backbone: {
        src: ['public/lib/backbone.js'],
        dest: 'public/dist/backbone.js'
      },
      handlebars: {
        src: ['public/lib/handlebars.js'],
        dest: 'public/dist/handlebars.js'
      },
      jquery: {
        src: ['public/lib/jquery.js'],
        dest: 'public/dist/jquery.js'
      },
      underscore: {
        src: ['public/lib/underscore.js'],
        dest: 'public/dist/underscore.js'
      },

    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      myTarget: {
        files: {
          'public/dist/client.min.js': ['public/dist/client.js'],
          'public/dist/lib.min.js': ['public/dist/lib.js'],
          'public/dist/backbone.min.js': ['public/dist/backbone.js'],
          'public/dist/handlebars.min.js': ['public/dist/handlebars.js'],
          'public/dist/jquery.min.js': ['public/dist/jquery.js'],
          'public/dist/underscore.min.js': ['public/dist/underscore.js']
        }
      }
    },

    clean: {
      js: ['public/dist/*.js', '!public/dist/*.min.js'],
    },

    eslint: {
      options: {
        quiet: true
      },
      target: ['public/dist/*.js']
    },

    cssmin: {
      target: {
        files: {
          'public/dist/style.min.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      },
      commit: {
        command: 'git commit . -m "send to live server"'
      },
      push: {
        command: 'git push live master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', function() {
    grunt.task.run(['concat', 'eslint', 'test', 'uglify', 'clean', 'cssmin']);
  });



  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['build', 'shell:commit', 'shell:push']);
      // push to production droplet
      // FIX FATAL THING WITH PUSH TO DROPLET
    } else {
      grunt.task.run([ 'build', 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', function() {
    // add your deploy tasks here
    grunt.task.run(['upload']);
  });
};
