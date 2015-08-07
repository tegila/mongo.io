path = require 'path'

process.env.PORT = process.env.PORT or 8080

config = (grunt) ->
  #secret: grunt.file.readJSON('secret.json')
  
  sftp:
    test:
      files:
        "./": ["server.*", "package.json", "config.coffee"]
      options:
        path: '/var/www/mongo.io/'
        host: '192.168.1.112'
        username: 'root'
        privateKey: grunt.file.read("/Users/tegila/.ssh/id_dsa")
        showProgress: true
        createDirectories: true
  sshexec:
    test:
      command: 'sh /var/www/mongo.io/server.sh stop ; nohup sh /var/www/mongo.io/server.sh start'
      options:
        host: '192.168.1.112'
        username: 'root'
        privateKey: grunt.file.read("/Users/tegila/.ssh/id_dsa")


  globals:
    exports: true


module.exports = (grunt) ->
  require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks
  grunt.initConfig config(grunt)
    
  ## default
  grunt.registerTask "default", ["deploy"]
  grunt.registerTask "deploy", ["sftp", "sshexec"]

