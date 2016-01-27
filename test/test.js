var gulp = require('gulp');
var plugin = require('../main');

describe('gulp-repository-watch', function() {
    this.timeout(5000);

    it('should retrieve the latest commit revision', function(done) {
        plugin()
    });
});