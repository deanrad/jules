// Generated on 2014-01-19 using generator-deanhtml5 0.3.5
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});
var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          clearRequireCache: true,
          growl: true
        },
        src: ['app/test-runner.js']
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'app/js/**/*.js'],
      options: {
        node: true,
        undef: true,
        devel: true,
        trailing: true,
        lastsemic: false,
        globals: {
          module: true,
          console: true,
          define: true,
          require: true,
          requirejs: true
        }
      }
    },
    sass: {
      dist: {
        files: {
          'app/css/application.css': 'app/sass/application.scss'
        }
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: LIVERELOAD_PORT
      },
      jshint: {
        files: ['app/js/**/*.js'],
        tasks: ['jshint']
      },
      css: {
        files: '**/*.scss',
        tasks: ['sass']
      },
      livereload: {
        files: [
          'app/*.html',
          'app/css/*.*',
          'app/js/**/*.coffee',
          'app/js/**/*.js',
          'app/test-runner.js'
        ],
        tasks: ['build', 'mochaTest']
      }
    },
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              lrSnippet,
              mountFolder(connect, './app')
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    manifest: {
      //http://frederiknakstad.com/awkward-change-flow-or-how-i-learned-to-stop-worrying-and-love-the-application-cache/
      generate: {
        options: {
          network: ['http://*', 'https://*'],
          timestamp: true
        },
        src: ['./*.html'],
        dest: 'manifest.appcache'
      }
    }
  });

  grunt.registerTask('server', ['build', 'connect:livereload', 'open', 'watch']);

  grunt.registerTask('build', 'Build your app.', function() {
    console.log("Implement your custom build step here");
  });

  grunt.registerTask('cdnify', 'Toggle scripts/css to work online or offline', function() {
    var fs = require("fs");

    var filePath = "index.html";
    var filePathNew = filePath;

    function cdnify(contents) {
      //quick-n-dirty version, requires src|href to be adjacent to data-alt-path in markup
      return contents.replace(/(src|href)="([^"]+)"([\s]+)data-alt-path="([^"]+)"/gm, '$1="$4"$3data-alt-path="$2"');
    }

    function cdnifyRequire(contents) {
      //for paths in requirejs such as 'jquery/jquery.min', /*data-alt-path="//code.jquery.com/jquery-1.10.2.min.js"*/
      return contents.replace(/:\s?"(.*?)"(,?) \/\*data-alt-path="(.*)"/gm, ': "$3"$2 /*data-alt-path="$1"');
    }

    var contents = fs.readFileSync(filePath, 'utf-8');
    var newContents = cdnify(contents);
    fs.writeFileSync(filePathNew, newContents);

    grunt.log.writeln("All set, check " + filePathNew);

    contents = fs.readFileSync("js/requirejs-config.js", 'utf-8');
    newContents = cdnifyRequire(contents);
    fs.writeFileSync("js/requirejs-config.js", newContents);

    grunt.log.writeln("All set, check js/requirejs-config.js");

  });
};