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
    ellipse(o.x, o.y, 40 - 4);
    stroke(o.c);
    noFill();
    ellipse(o.x, o.y, 40);
    ellipse(o.x, o.y, 40 + o.r);
    o.r -= 0.1;
    return undefined;
};
function drawFail(o) {
    stroke('red');
    line(o.x + 8, o.y + 8, o.x - 8, o.y - 8);
    line(o.x + 8, o.y - 8, o.x - 8, o.y + 8);
    return undefined;
};
function drawSuccess(o) {
    stroke('green');
    return ellipse(o.x, o.y, 15);
};
function loss(c) {
    fails.push({ x : c.x, y : c.y });
    return undefined;
};
function keyPressed() {
    if (Math.abs(circles[0].r) < 4) {
        sounds[1].play();
        var object1 = circles.pop();
        success.push({ x : object1.x, y : object1.y });
    } else {
        sounds[2].play();
    };
    return undefined;
};
var status = true;
var sounds = [];
var circles = [];
var fails = [];
var success = [];
var beatmap = { x : [215, 124, 344],
                y : [33, 144, 36],
                time : [4, 5, 12]
              };
var colormap = { candidate : [], pointer : 0 };
function preload() {
    soundFormats('mp3');
    for (var file = null, _js_arrvar3 = ['slidertick', 'hitnormal', 'hitwhistle'], _js_idx2 = 0; _js_idx2 < _js_arrvar3.length; _js_idx2 += 1) {
        file = _js_arrvar3[_js_idx2];
        var sound = loadSound('normal-' + file + '.mp3');
        sounds.push(sound);
    };
    return undefined;
};
function setup() {
    createCanvas(400, 400);
    textSize(100);
    for (var x = null, _js_arrvar5 = [color(314, 56, 95), color(314, 56, 44)], _js_idx4 = 0; _js_idx4 < _js_arrvar5.length; _js_idx4 += 1) {
        x = _js_arrvar5[_js_idx4];
        colormap.candidate.push(x);
    };
    circles.push(newCircle());
    return undefined;
};
function draw() {
    background(255, 20);
    colorMode(HSB, 360, 100, 100);
    fails.map(drawFail);
    success.map(drawSuccess);
    for (var o = null, _js_idx6 = 0; _js_idx6 < circles.length; _js_idx6 += 1) {
        o = circles[_js_idx6];
        drawCircle(o);
    };
    if (circles.length > 0) {
        if (circles[0].r < -4) {
            loss(circles.shift());
        };
    };
    return undefined;
};