let cnv;

let walls = [];
let ray;
let particle;
let sprite;
let moveFlag = true;

const lightInt = 2;

const moveSpeed = 1;

let sceneH = innerHeight;
let sceneW = sceneH * 1.5;
let defWallMaxH = sceneH * 2;

const scene = [];

p5.disableFriendlyErrors = true;

function preload() {
    sprite = loadImage('wall_sprite.png');
    mapJson = loadJSON('map.json');
}

function setup() {
    cnv = createCanvas(sceneW, sceneH);
    cnv.style('image-rendering', 'optimizedSpeed');
    //cnv.style('image-rendering', 'pixelated');
    centerCanvas();

    b1 = color(100, 32, 32);
    b2 = color(145, 46, 46);
    c1 = color(250);
    c2 = color(0);

    for(let wall of mapJson.muros) {
        walls.push(new Boundary(wall.a[0], wall.a[1], wall.b[0], wall.b[1]));
    }

    /* for(let i = 0; i < 5; i++) {
        let x1 = random(100);
        let y1 = random(100);
        let x2 = random(100);
        let y2 = random(100);
        walls.push(new Boundary(x1, y1, x2, y2));
    }

    walls.push(new Boundary(0, 0, 128, 0));
    walls.push(new Boundary(128, 0, 128, 128));
    walls.push(new Boundary(128, 128, 0, 128));
    walls.push(new Boundary(0, 128, 0, 0)); */

    particle = new Particle(mapJson.start[0], mapJson.start[1], 90);
}

function windowResized() {
    sceneH = innerHeight;
    sceneW = sceneH * 1.5;
    defWallMaxH = sceneH * 2;
    resizeCanvas(sceneW, sceneH);
    centerCanvas();
    moveFlag = true;
}

function draw() {
    controls();

    if(moveFlag){
        // Floor and sky
        background(0);
        setGradient(0, 0, width, height / 2, b1, b2, 'Y_AXIS', 25);
        setGradient(0, height / 2 + 6, width, height, b1, c1, 'Y_AXIS', 20);

        const scene = particle.look();

        const w = sceneW / scene.length;
        const y = sceneH / 2;

        const limit = sprite.width - 0.1;
        const wallLimit = defWallMaxH;


        const s1 = color(100, 32, 32);

        push();
        translate(0, 0);
        for(let i = 0; i < scene.length; i++) {
            noStroke();

            const sq = (scene[i][0] / lightInt) ** 2;
            const b = map(1/sq, 0, 1, 255, 0);

            const h = map(1/scene[i][0], 0, 1, 0, wallLimit);
            const difH = map(1/scene[i][0], 0, 1, 0, defWallMaxH);
            const stripeId = (scene[i][1] * 100) % limit;

            const x = i * w + w / 2;

            imageMode(CENTER);
            image(sprite, x, y + ((h-difH)/2), w, h, stripeId, 0, 0.01, sprite.height);

            rectMode(CENTER);
            noStroke();
            s1.setAlpha(b);
            fill(s1);
            rect(x, y + ((h-difH)/2), w+0.85, h);
        }
        pop();

        for(let wall of walls) {
            strokeWeight(3);
            wall.show();
        }

        particle.show();
    }

    moveFlag = false;
}

function setGradient(x, y, w, h, c1, c2, axis, def) {
    noFill();

    if (axis === 'Y_AXIS') {
        // Gradiente de arriba a abajo
        for (let i = y; i <= y + h; i+=def) {
            let inter = map(i, y, y + h, 0, 1);
            let c = lerpColor(c1, c2, inter);
            stroke(c);
            strokeWeight(def+1);
            line(x, i, x + w, i);
        }
    } else if (axis === 'X_AXIS') {
        // Gradiente de izquierda a derecha
        for (let i = x; i <= x + w; i+=def) {
            let inter = map(i, x, x + w, 0, 1);
            let c = lerpColor(c1, c2, inter);
            stroke(c);
            strokeWeight(def+1);
            line(i, y, i, y + h);
        }
    }
}

function wallColl(wall, ptPos) {
    let lX1 = wall.a.x;
    let lY1 = wall.a.y;
    let lX2 = wall.b.x;
    let lY2 = wall.b.y;

    let ptX = ptPos.x;
    let ptY = ptPos.y;

    let d1 = dist(ptX, ptY, lX1, lY1);
    let d2 = dist(ptX, ptY, lX2, lY2);
    let lLen = dist(lX1, lY1, lX2, lY2);
    let buffer = 0.2;

    if(d1 + d2 >= lLen && d1 + d2 < lLen + buffer) return true;
    else return false;
}

function controls() {
    if (keyIsDown(65)) { // Tecla A
        particle.moveS(moveSpeed/10);
        moveFlag = true;

    } else if (keyIsDown(68)) { // Tecla D
        particle.moveS(-moveSpeed/10);
        moveFlag = true;

    } else if (keyIsDown(87)) { // Tecla W
        particle.moveFB(moveSpeed/10);
        moveFlag = true;

    } else if (keyIsDown(83)) { // Tecla S
        particle.moveFB(-moveSpeed/10);
        moveFlag = true;

    } 
    
    if (keyIsDown(81)) { // Tecla Q
        particle.rotate(-0.03);
        moveFlag = true;

    } else if (keyIsDown(69)) { // Tecla E
        particle.rotate(0.03);
        moveFlag = true;
    }
}

function centerCanvas() {
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    cnv.position(x,y);
}