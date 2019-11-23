requirejs.config({
    baseUrl: 'assets/js/lib',
	paths: {
		'pace': 'pace.min',
		'jquery': 'jquery.min',
		'bootstrap': 'bootstrap.bundle.min',
		'browser': 'browser.min',
		'breakpoints': 'breakpoints.min'
	},
});

require(["pace", "jquery", "bootstrap", "browser", "breakpoints"], (pace) => {
	pace.start();
	require(["assets/js/language.js", "assets/js/util.js", "assets/js/main.js", "assets/js/rangy.js", "assets/js/backToTop.js", "assets/js/input.js", "assets/js/anim.js", "assets/js/run.js"]);
});