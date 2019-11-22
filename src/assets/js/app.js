requirejs.config({
    baseUrl: 'assets/js/lib',
	paths: {
		'jquery': 'jquery.min',
		'bootstrap': 'bootstrap.bundle.min',
		'browser': 'browser.min',
		'breakpoints': 'breakpoints.min'
	},
});

require(["jquery", "bootstrap", "browser", "breakpoints"], () => {
	require(["assets/js/language.js", "assets/js/util.js", "assets/js/main.js", "assets/js/rangy.js", "assets/js/backToTop.js", "assets/js/input.js", "assets/js/anim.js"]);
});