/* Generated from Parenscript. */
function getColor(c) {
    return c.candidate[c.pointer];
};
function newCircle() {
    return { x : beatmap.x.shift(),
             y : beatmap.y.shift(),
             r : 40,
             c : getColor(colormap)
           };
};
function drawCircle(o) {
    fill(o.c);
    noStroke();
    ellipse(o.x, o.y, 40);
    stroke(o.c);
    noFill();
    ellipse(o.x, o.y, 40 + o.r);
    o.r -= 0.1;
    return undefined;
};
function loss(c) {
    return null;
};
var sounds = [];
var circles = [];
var beatmap = { x : [215, 124],
                y : [33, 144],
                time : []
              };
var colormap = { candidate : [], pointer : 0 };
function preload() {
    soundFormats('mp3');
    for (var file = null, _js_arrvar2 = ['slidertick', 'hitnormal', 'hitwhistle'], _js_idx1 = 0; _js_idx1 < _js_arrvar2.length; _js_idx1 += 1) {
        file = _js_arrvar2[_js_idx1];
        var sound = loadSound('normal-' + file + '.mp3');
        sounds.push(sound);
    };
    return undefined;
};
function setup() {
    createCanvas(400, 400);
    textSize(100);
    for (var x = null, _js_arrvar4 = [color(314, 56, 95)], _js_idx3 = 0; _js_idx3 < _js_arrvar4.length; _js_idx3 += 1) {
        x = _js_arrvar4[_js_idx3];
        colormap.candidate.push(x);
    };
    circles.push(newCircle());
    return undefined;
};
function draw() {
    background(255, 20);
    colorMode(HSB, 360, 100, 100);
    for (var o = null, _js_idx5 = 0; _js_idx5 < circles.length; _js_idx5 += 1) {
        o = circles[_js_idx5];
        drawCircle(o);
    };
    if (circles[0].r < -1) {
        loss(circles.shift());
    };
    return undefined;
};