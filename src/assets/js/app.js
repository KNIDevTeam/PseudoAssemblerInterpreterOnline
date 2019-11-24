requirejs.config({
    baseUrl: 'assets/js/lib',
	paths: {
		'pace': 'pace.min',
		'jquery': 'jquery.min',
		'bootstrap': 'bootstrap.bundle.min',
		'browser': 'browser.min',
		'breakpoints': 'breakpoints.min',
		'rangy': 'rangy'
	},
});

require(["pace", "jquery", "bootstrap"], (pace, $) => {
	pace.start();
	window.$ = $;
	require(["browser", "rangy"], () => {
		require(["assets/js/language.js",  "assets/js/main.js", "assets/js/backToTop.js", "assets/js/anim.js", "assets/js/input.js", "assets/js/run.js"]);
	});
});