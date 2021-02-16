const CANVAS_WIDTH = 600;

const BOX_COLORS = ['#3498db', '#2980b9', '#8e44ad', '#9b59b6', '#1abc9c', '#16a085'];

let audio;

function setup() {
    Animator.init();
    GameObjectManager.init();
    pixelDensity(1);

    colorMode(RGB);

    this.canvas = createCanvas(CANVAS_WIDTH, CANVAS_WIDTH);
    this.canvas.parent('canvasContainer');

    this.canvas.elt.removeAttribute('style');

    GameManager.initialize();
    this.showDebug = false;

    const resetBtn = document.querySelector('#restartButton');
    resetBtn.style.setProperty('--bar-width', '0%');
    let animId;

    const touchStart = (e) => {
        e.preventDefault();
        animId && Animator.stopAnimation(animId);
        animId = Animator.addAnimation({
            from: 0,
            to: 100,
            update: (val) => {
                resetBtn.style.setProperty('--bar-width', `${val}%`);
            },
            done: () => {
                resetBtn.style.setProperty('--bar-width', '0%');
                GameManager.restart();
            }
        });
    };
    resetBtn.addEventListener('touchstart', touchStart);
    resetBtn.addEventListener('mousedown', touchStart);

    const touchEnd = () => {
        // alert("Mouse up")
        Animator.stopAnimation(animId);
        resetBtn.style.setProperty('--bar-width', '0%');
    };

    resetBtn.addEventListener('mouseup', touchEnd);
    resetBtn.addEventListener('mouseleave', touchEnd);
    resetBtn.addEventListener('touchend', touchEnd);
    // resetBtn.addEventListener('touchmove', touchEnd);
}

function draw() {
    drawBG();

    Animator.update();
    GameObjectManager.draw();

    debugText();
}

function drawBG() {
    // background(color('red'));
    clear();

    const padding = 5;
    const w = width / 4 - 2 * padding;
    const sw = width / 4;
    const r = 20;

    fill(color('#EEE'));
    noStroke();

    push();
    for (let i = 0; i < 4; i++) {
        push();
        for (let j = 0; j < 4; j++) {
            square(padding, padding, w, r);
            translate(sw, 0);
        }
        pop();
        translate(0, sw);
    }
    pop();
}

function debugText() {
    if (!this.showDebug) return;

    const data = {};

    push();
    translate(0, 100);
    fill('white');
    textSize(20);
    text(JSON.stringify(data, null, 2), 0, 0);
    pop();
}

function scaleValue() {}

function keyPressed() {
    GM.keyPressed(key);
}

function touchStarted() {
    GameObjectManager.mouseMoved();
    return false;
}

function touchEnded() {
    GameObjectManager.onClick();
    return false;
}

function mouseMoved() {
    GameObjectManager.mouseMoved();
    return false;
}

function touchMoved() {
    GameObjectManager.mouseMoved();
    return false;
}

function windowResized() {
    // const w = min(windowWidth * 0.9, MAX_WITH);
    // resizeCanvas(w, w);
}

function touchStarted() {
    GameManager.touchStarted();
}

function touchMoved() {
    GameManager.touchMoved();
    return false;
}

function touchEnded() {
    GameManager.touchEnded();
}
