/*
	Phantom by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

/*if (isIE()) {
	console.log('IE Detected');
	window.location.href = "errors/IE.html";
}*/

window.Pace.on('done', () => {
	$('#wrapper').addClass('animated fadeIn');
});
	
window.cookieconsent.initialise({
  "palette": {
    "popup": {
	  "background": "#fff",
	  "text": "#585858"
    },
    "button": {
	  "background": "#00f4a4",
	  "text": "#fff"
    }
  },
  "theme": "block",
  "position": "bottom-right",
  "content": {
    "message": lang.cookieConsent.message,
    "dismiss": lang.cookieConsent.dimiss,
    "link": lang.cookieConsent.link,
    "href": lang.cookieConsent.href
  }
});

(function($) {

	var	$window = $(window),
		$body = $('body');
	// Touch?
		if (browser.mobile)
			$body.addClass('is-touch');

	// Menu.
		var $menu = $('#menu');

		$menu.wrapInner('<div class="inner"></div>');

		$menu._locked = false;

		$menu._lock = function() {
			if ($menu._locked)
				return false;

			$menu._locked = true;

			window.setTimeout(function() {
				$menu._locked = false;
			}, 350);

			return true;

		};

		$menu._show = function() {
			if ($menu._lock())
				$body.addClass('is-menu-visible');

		};

		$menu._hide = function() {
			if ($menu._lock())
				$body.removeClass('is-menu-visible');

		};

		$menu._toggle = function() {
			if ($menu._lock())
				$body.toggleClass('is-menu-visible');

		};

		$menu
			.appendTo($body)
			.on('click', function(event) {
				event.stopPropagation();
			})
			.on('click', 'a', function(event) {
				var href = $(this).attr('href');

				event.preventDefault();
				event.stopPropagation();

				// Hide.
					$menu._hide();

				// Redirect.
					if (href == '#menu')
						return;

					window.setTimeout(function() {
						window.location.href = href;
					}, 350);

			})
			.append('<a class="close" href="#menu">Close</a>');

		$body
			.on('click', 'a[href="#menu"]', function(event) {
				event.stopPropagation();
				event.preventDefault();

				// Toggle.
					$menu._toggle();

			})
			.on('click', function(event) {
				// Hide.
					$menu._hide();

			})
			.on('keydown', function(event) {
				// Hide on escape.
					if (event.keyCode == 27)
						$menu._hide();

			});
			
			
})(jQuery);

/**
 * Check if browser is IE.
 *
 * @returns {boolean}
 */
function isIE() {
    var ua = window.navigator.userAgent;
    var ie = ua.search(/(MSIE|Trident|Edge)/);

    return ie > -1;
}