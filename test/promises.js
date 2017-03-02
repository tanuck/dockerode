/*jshint -W030 */

var expect = require('chai').expect;
var docker = require('./spec_helper').docker;
var MemoryStream = require('memorystream');
var Socket = require('net').Socket;

var testImage = 'ubuntu:14.04';

describe("#container promises", function() {

  it("should start->resize->stop->remove a container", function(done) {
    this.timeout(60000);

    docker.createContainer({
      Image: 'ubuntu',
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      Cmd: ['/bin/bash', '-c', 'tail -f /var/log/dmesg'],
      OpenStdin: false,
      StdinOnce: false
    }).then(function(container) {
      return container.start();
    }).then(function(container) {
      return container.resize({
        h: process.stdout.rows,
        w: process.stdout.columns
      });
    }).then(function(container) {
      return container.stop();
    }).then(function(container) {
      return container.remove();
    }).then(function(data) {
      done();
    }).catch(function(err) {
      expect(err).to.be.null;
      done();
    });
  });

  it("should runAsync a command", function(done) {
    docker.run(testImage, ['bash', '-c', 'uname -a'], process.stdout).then(function(container) {
      expect(container).to.be.ok;
      return container.remove();
    }).then(function(data) {
      done();
    }).catch(function(err) {
      expect(err).to.be.null;
      done();
    });
  });

});
