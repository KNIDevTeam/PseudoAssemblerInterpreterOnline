var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.style.width = window.innerWidth * 0.9 + "px";
canvas.style.height = window.innerHeight + "px";

var scale = window.devicePixelRatio; 
canvas.width = window.innerWidth * 0.9 * scale;
canvas.height = window.innerHeight * scale;

ctx.scale(scale, scale);

ctx.font = "25px Arial";
ctx.imageSmoothingEnabled = true;
ctx.textAlign = "center"; 
ctx.textBaseline = "middle";
ctx.fillStyle = "#00f4a4";

var logo_pos = getPosCenter(document.getElementById("logo"));

function getPosCenter( el ) {
    var _x = 0;
    var _y = 0;
    var base_el = el;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { y: _y+base_el.offsetHeight/2, x: _x+base_el.offsetWidth/2 };
}

var particles = [];
var animating = 0;

$("#logo-id").on('mouseenter', function() {
    if(animating) return;
    logo_pos = getPosCenter(document.getElementById("logo-id"));
    for(var i = 3; i <= 10; i++) {
        particles.push({
            x: logo_pos.x - 170,
            y: logo_pos.y,
            speed: -1 * i * i / 5,
            char: String.fromCharCode(0x2200 + Math.random() * (0x22FF - 0x2200 + 1))});
        particles.push({
            x: logo_pos.x + 170,
            y: logo_pos.y,
            speed: i * i / 5,
            char: String.fromCharCode(0x2200 + Math.random() * (0x22FF - 0x2200 + 1))});
        }
    animating = 1;
    requestAnimationFrame(draw);
});


function draw() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    var offscreen = 0;
    particles.forEach(function(particle, id) {
        if(particle.x < 0 || particle.x > ctx.canvas.width) offscreen++;
        else {
            particle.x += particle.speed;
            particle.speed *= 1.05;
            ctx.globalAlpha = Math.min(1, Math.abs(50 / particle.speed));
            if(Math.abs(particle.x - logo_pos.x) > 200) ctx.fillText(particle.char, Math.round(particle.x), Math.round(particle.y)); 
            particles[id] = particle;
        }
    });
    
    if(offscreen < particles.length) requestAnimationFrame(draw);
    else particles = [], animating = 0;
}