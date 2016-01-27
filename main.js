var async = require('async-chainable');
var asyncExec = require('async-chainable-exec');
var events = require('events');
var util = require('util');

function GulpRepositoryWatch(options) {
    var self = this;
    var settings = {
        poll: 1000,
        initialPoll: 1000,
        head: null,
        forceHead: false,
        gitHead: ['git', 'ls-remote', options.repository, 'HEAD', '-n', '1'],
        gitPull: ['git', 'pull']
    };

    if (options) {
        for (var k in options) {
            settings[k] = options[k];
        }
    }

    var GulpGitWatchCheck = function () {
        self.emit('check');

        async()
            .use(asyncExec)
            .then(function (next) {
                if (settings.head && !settings.forceHead) return next();
                async()
                    .use(asyncExec)
                    .exec('head', settings.gitHead)
                    .end(function (err) {
                        if (err) return next(err);
                        settings.head = this.head[0];
                        next();
                    });
            })
            .exec(settings.gitPull)
            .exec('newHead', settings.gitHead)
            .end(function (err) {
                if (err) {
                    throw new Error(err);
                } else {
                    var newHead = this.newHead[0];
                    if (newHead != settings.head) {
                        self.emit('change', newHead, settings.head);
                        settings.head = newHead;
                    } else {
                        self.emit('nochange', settings.head);
                    }
                }
                setTimeout(GulpGitWatchCheck, settings.poll);
            });
    };

    setTimeout(GulpGitWatchCheck, settings.initialPoll);
}

util.inherits(GulpRepositoryWatch, events.EventEmitter);

module.exports = function (options) {
    return new GulpGitWatch(options);
};