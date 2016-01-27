var gulp = require('gulp');
var plugin = require('../main');
var should = require('should');

describe('gulp-repository-watch', function () {
    this.timeout(5000);

    it('should retrieve the latest commit revision', function(done) {
        var p = plugin({
            repository: 'git@github.com:acierto/gulp-repository-watch.git'
        }).on('nochange', function(commitRevision) {
            should.exist(commitRevision);
            p.emit('stop');
            done();
        });
    });

    it('should throw exception that required field as repository is not defined', function () {
        (function () {
            plugin();
        }).should.throw('Please define the remote repository which you would like to watch.');
    });
});