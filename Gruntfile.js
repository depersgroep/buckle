module.exports = function(grunt) {
	// measures the time each task takes
	require('time-grunt')(grunt);

	// load the tasks
	require('load-grunt-config')(grunt);
};
