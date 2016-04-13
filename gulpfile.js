var gulp = require('gulp');
var Candyman = require('candyman');

var candyman = new Candyman({
    targetDevices: [
        { devicename: 'tweetmonkey', hostname : 'tweetmonkey.local' }        
    ],
    projectName : 'tweetmonkey',
    user: 'pi',
    password: 'raspberry',
    startFile: 'app.js' 
});
gulp.task('default', function() {
	console.log('running');
});

gulp.task('deploy', function() {
    return candyman.deploy();
});
