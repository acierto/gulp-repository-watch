var async = require('async-chainable');
var asyncExec = require('async-chainable-exec');
var events = require('events');
var util = require('util');

function GulpRepositoryWatch(options) {
    var self = this;

    if (!options || !options.repository) {
        throw Error('Please define the remote repository which you would like to watch.');
    }

    var counter = 0;
    var stopPolling = false;

    self.on('stop', function() {
        stopPolling = true;
    });

    var optRepository = options.repository;
    var hashIndex = optRepository.indexOf('#');

    var remoteRepository = hashIndex != -1 ? optRepository.substring(0, hashIndex) : optRepository;
    var branch = hashIndex != -1 ? optRepository.substring(hashIndex + '#'.length) : 'HEAD';

    console.log(['git', 'ls-remote', remoteRepository, branch, '-n', '1'].join(' '));

    var settings = {
        head: null,
        gitHead: ['git', 'ls-remote', remoteRepository, branch, '-n', '1'],
        gitPull: ['git', 'pull'],
        poll: 1000,
        retries: null
    };

    if (options) {
        for (var k in options) {
            settings[k] = options[k];
        }
    }

    var getCommitRevision = function (printInfo) {
        return printInfo ? printInfo.split('\t')[0] : '';
    };

    var GulpGitWatchCheck = function () {
        self.emit('check');

        async()
            .use(asyncExec)
            .then(function (next) {
                if (settings.head) return next();
                async()
                    .use(asyncExec)
                    .exec('head', settings.gitHead)
                    .end(function (err) {
                        counter++;
                        if (err) return next(err);
                        settings.head = getCommitRevision(this.head[0]);
                        next();
                    });
            })
            .exec(settings.gitPull)
            .exec('newHead', settings.gitHead)
            .end(function (err) {
                if (err) {
                    throw new Error(err);
                } else {
                    var newHead = getCommitRevision(this.newHead[0]);
                    if (newHead != settings.head) {
                        self.emit('change', newHead, settings.head);
                        settings.head = newHead;
                    } else {
                        self.emit('nochange', settings.head);
                    }
                }
                if ((!settings.retries || counter < settings.retries) && !stopPolling) {
                    setTimeout(GulpGitWatchCheck, settings.poll);
                }
            });
    };

    setTimeout(GulpGitWatchCheck, settings.initialPoll);
}

util.inherits(GulpRepositoryWatch, events.EventEmitter);

module.exports = function (options) {
    return new GulpRepositoryWatch(options);
};