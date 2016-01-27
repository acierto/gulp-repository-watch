gulp-repository-watch
==============
Gulp plugin for watching the commit changes in the repository defined as a dependency in bower.json

	var gulp = require('gulp');
	var repoWatch = require('gulp-repository-watch');

	gulp.task('repo-watch', function() {
		repoWatch({
		        repository: 'git@github.com:acierto/gulp-repository-watch.git'
		    })
			.on('check', function(commitRevision) {
				console.log('CHECK!', commitRevision);
			})
			.on('change', function(newHash, oldHash) {
				console.log('Changed from ', oldHash, ' to ', newHash);
			});
	});


Options
-------

| Option              | Default                         | Description                                                                           |
|---------------------|---------------------------------|---------------------------------------------------------------------------------------|
| `poll`              | 1000 (1s)                       | How often gulp-repository-watch polls the repository for changes                      |
| `initialPoll`       | 1000 (1s)                       | Wrap up time for gulp-repository-watch                                                |
| `head`              | *null*                          | The initial Git HEAD commit revision value                                            |
| `gitHead`           | `git ls-remote $REPO HEAD -n 1` | The command to use to retrieve the current Git HEAD                                   |
| `gitPull`           | `git pull`                      | The command to use to instruct Git to pull in changes                                 |


Events
------

Events for subscription:

| Event                          | Description                                                    |
|--------------------------------|----------------------------------------------------------------|
| `check()`                      | Triggered when gulp-repository-watch polls Git for changes     |
| `change(newHash, oldHash)`     | Triggered when Git has updated from the old hash to a new hash |
| `nochange(hash)`               | Triggered when no Git changes were found                       |

Events for emitting:

| Event                          | Description                                                    |
|--------------------------------|----------------------------------------------------------------|
| `stop`                         | Will stop polling Git repository                               |