/*
 * grunt-deployit
 * https://github.com/quintana-dev/grunt-deployit
 *
 * Copyright (c) 2016 José Luis Quintana
 * Licensed under the MIT license.
 */

'use strict'

module.exports = function (grunt) {
  grunt.initConfig({
    clean: {
      tests: ['.tmp']
    },
    deployit: {
      default_options: {
        options: {
          tests: true
        },
        files: {
          '.tmp/default_options': [
            'test/fixtures/server',
            'test/fixtures/deploy'
          ]
        }
      }
    },
    nodeunit: {
      tests: ['test/*_test.js']
    }
  })

  grunt.loadTasks('tasks')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-nodeunit')

  grunt.registerTask('test', ['clean', 'deployit:default_options', 'nodeunit'])
  grunt.registerTask('default', ['deployit:custom_options'])
}
