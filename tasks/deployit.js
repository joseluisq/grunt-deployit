/*
 * grunt-deployit
 * https://github.com/quintana-dev/grunt-deployit
 *
 * Copyright (c) 2015 José Luis Quintana
 * Licensed under the MIT license.
 */

'use strict'

var scp = require('scp2').scp
var read = require('read')
var chalk = require('chalk')

module.exports = function (grunt) {
  grunt.registerMultiTask('deployit', 'Simple and easy deployment task.', function () {
    var pkg = grunt.file.readJSON('package.json')
    var done = this.async()
    var files = this.files
    var options = this.options({
      host: 'localhost',
      port: '22',
      username: 'guest'
    })

    /**
     * Deploy to server
     */
    function deploy () {
      var sources = {}

      files.forEach(function (file) {
        sources[file.orig.dest] = {
          path: file.orig.src[0],
          files: file.src
        }
      })

      var params = [
        options.username,
        ':',
        options.password,
        '@',
        options.host,
        ':',
        sources.dest.path
      ].join('')

      var log = [
        '',
        chalk.bold.green('Grunt Deployit ') + chalk.gray('v' + pkg.version),
        '',
        chalk.cyan('Server'),
        ' Host:       ' + chalk.gray(options.host),
        ' Port:       ' + chalk.gray(options.port),
        ' Username:   ' + chalk.gray(options.username),
        '',
        chalk.cyan('Deployment:'),
        ' Local:      ' + chalk.gray(sources.src.path),
        ' Remote:     ' + chalk.gray(sources.dest.path),
        ''
      ].join('\n')

      grunt.log.writeln(log)

      scp(sources.src.path, params, function (err) {
        if (err) {
          grunt.log.error(chalk.magenta(err.message))
          grunt.log.writeln('\n')
          return
        }

        grunt.log.writeln(chalk.yellow('>> Deployment was successful.'))
        done()
      })
    }

    /**
     * Get user input
     */
    function stdin () {
      read({
        prompt: 'Password: ',
        silent: true
      }, function (err, pass) {
        if (err) {
          grunt.log.error(err.message)
        } else {
          if (pass) {
            options.password = pass
            deploy()
          } else {
            grunt.log.warn('No password entered')
          }
        }
      })
    }

    /**
     * Start deployment
     */
    function init () {
      if (options.password) {
        deploy()
      } else {
        stdin()
      }
    }

    if (options.tests) {
      this.files.forEach(function (file) {
        var src = file.src.filter(function (path) {
          if (!grunt.file.exists(path)) {
            grunt.log.warn('Source file "' + path + '" not found.')
            return false
          }

          return true
        }).map(function (path) {
          return grunt.file.read(path)
        }).join(',')

        grunt.file.write(file.dest, src)

        grunt.log.writeln('File "' + file.dest + '" created.')
      })

      done()
    } else {
      init()
    }
  })
}
