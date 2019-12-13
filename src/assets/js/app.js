requirejs.config({
    baseUrl: 'assets/js/lib',
	paths: {
		'pace': 'pace.min',
		'jquery': 'jquery.min',
		'bootstrap': 'bootstrap.bundle.min',
		'browser': 'browser.min',
		'breakpoints': 'breakpoints.min',
		'rangy': 'rangy.min',
		'cookies': 'cookies.min'
	},
});

/* Require needed scripts */
require(["pace"], (pace) => {
	pace.start();
	require(["jquery", "bootstrap", "cookies"], () => {
		require(["browser", "rangy", "assets/js/language.js", "assets/js/backToTop.js", "parser/command.js"], () => {
			require(["parser/arithmetic_commands.js", "parser/store_commands.js", "parser/jump_commands.js", "parser/compare_commands.js", "parser/declaration_commands.js"], () => {
				require(["parser/factory.js"], () => {
					require(["parser/main.js"], () => {
						require(["assets/js/main.js"], () => {
							require(["assets/js/anim.js", "assets/js/input.js", "assets/js/run.js"]);
						});
					});
				});
			});
		});
	});
});