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

require(["pace"], (pace) => {
	pace.start();
	require(["jquery", "bootstrap"], () => {
		require(["browser", "rangy", "assets/js/language.js", "assets/js/backToTop.js"], () => {
			require(["assets/js/main.js", "assets/js/anim.js", "assets/js/input.js", "assets/js/run.js"]);
		});
	});
});