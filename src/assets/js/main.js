/*
	Phantom by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

/*if (isIE()) {
	console.log('IE Detected');
	window.location.href = "errors/IE.html";
}*/
	
function eraseCookie(cname) {
	document.cookie = cname + "= ;-1;path=/";
}

function setCookie(cname, cvalue, exdays) {
	eraseCookie(cname);
	cvalue = cvalue.replace(/(\r\n|\n|\r)/gm, "|n|");
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
	  var c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length).replace(/\|n\|/g, "\n");
	  }
	}
	return "";
}


window.Pace.on('done', () => {
	$('#wrapper').addClass('animated fadeIn');
});
	
window.cookieconsent.initialise({
  "palette": {
    "popup": {
      "background": "#000"
    },
    "button": {
      "background": "#f1d600"
    }
  },
  "theme": "classic",
  "position": "bottom-right",
  "content": {
    "message": "Ta strona używa ciasteczek w celu polepszenia odczuć związanych z jej użytkowaniem",
    "dismiss": "OK!",
    "link": "Czytaj więcej",
    "href": "https://wszystkoociasteczkach.pl/polityka-cookies/"
  }
});

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		 /* breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});  */

	// Play initial animations on page load.
		/* $window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		}); */

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

/* Check if is IE */
function isIE() {
    var ua = window.navigator.userAgent;
    var ie = ua.search(/(MSIE|Trident|Edge)/);

    return ie > -1;
}