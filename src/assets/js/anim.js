/* Setup global variables */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var particles = [];
var animating = 0, animating_logo = 0, animating_button = 0;

/* For screens with high dpi */
var pixel_ratio = window.devicePixelRatio;
prepareCanvas()

/**
 * Get center position of element.
 *
 * @param el
 *
 * @returns {object} pos (x, y, w)
 */
function getPos(el) {
    var rect = el.getBoundingClientRect();
    return {x: (rect.left + rect.right)/2 , y: (rect.top + rect.bottom)/2, w: (rect.right-rect.left)/2};
}

/**
 * Setup canvas settings.
 */
function prepareCanvas() {
    canvas.style.width = window.innerWidth * 0.98 + "px";
    canvas.style.height = window.innerHeight + "px";
    canvas.width = window.innerWidth * 0.98 * pixel_ratio;
    canvas.height = window.innerHeight * pixel_ratio;
    ctx.scale(pixel_ratio, pixel_ratio);
    ctx.font = "25px Arial";
    ctx.imageSmoothingEnabled = true;
    ctx.textAlign = "center"; 
    ctx.textBaseline = "middle";
}

$(window).resize(prepareCanvas());

/* Animate on logo hover */
$("#logo-id").on('mouseenter', function() {
    if(animating_logo) return;
    spawnCharacters("logo-id", getPos(document.getElementById("logo-id")), '#00f4a4');
    animating_logo = 1;
    if(!animating) animating = 1, requestAnimationFrame(draw);
});

/* Animate on button hover */
$("#run-button").on('mouseenter', function() {
    if(animating_button) return;
    spawnCharacters("run-button", getPos(document.getElementById("run-button")), '#00f4a4');
    animating_button = 1;
    if(!animating) animating = 1, requestAnimationFrame(draw);
});

/**
 * Create particles around element.
 *
 * @param {string} element
 * @param {object} element_position (x, y, w)
 * @param {string} color
 */
function spawnCharacters(el, el_pos, color) {
    for(var i = 3; i <= 10; i++) {
        particles.push({
            color: color,
            spawner: el,
            origin: el_pos,
            initScroll: window.scrollY,
            targetDist: el_pos.w * 1.2,
            x: el_pos.x - el_pos.w * 0.9,
            y: el_pos.y,
            speed: -1 * i * i / 5,
            char: String.fromCharCode(0x2200 + Math.random() * (0x22FF - 0x2200 + 1))});
        particles.push({
            color: color,
            spawner: el,
            origin: el_pos,
            initScroll: window.scrollY,
            targetDist: el_pos.w * 1.2,
            x: el_pos.x + el_pos.w * 0.9,
            y: el_pos.y,
            speed: i * i / 5,
            char: String.fromCharCode(0x2200 + Math.random() * (0x22FF - 0x2200 + 1))});
        }
}

/**
 * Animate particles.
 */
function draw() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    var offscreen = 0;
    particles.forEach(function(particle, id) {
        if(particle.x < 0 || particle.x > ctx.canvas.width) offscreen++;
        else {
            particle.x += particle.speed;
            particle.speed *= 1.05;
            if(Math.abs(particle.x - particle.origin.x) > particle.targetDist) {
                ctx.fillStyle = particle.color;
                ctx.globalAlpha = Math.min(1, Math.abs(20 / particle.speed));
                ctx.fillText(
                    particle.char, 
                    Math.round(particle.x), 
                    //handle scrolling on some elements
                    Math.round(particle.y - (particle.spawner.match(/logo-id|run1|error/) ? window.scrollY - particle.initScroll : 0))
                );
            }
            particles[id] = particle;
        }
    });
    
    if(offscreen < particles.length) requestAnimationFrame(draw);
    //reset
    else particles = [], animating = animating_logo = animating_button = 0;
}