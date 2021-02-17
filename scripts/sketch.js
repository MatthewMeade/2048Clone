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

    setupResetButton();
}

function setupResetButton() {
    
    let animId;
    const touchStart = (e) => {
        e.preventDefault();
        animId && Animator.stopAnimation(animId);
        animId = Animator.addAnimation({
            update: setHoldState,
            done: () => {
                setHoldState(0);
                GameManager.restart();
            }
        });
    };

    const touchEnd = () => {
        Animator.stopAnimation(animId);
        setHoldState(0);
    };

    const resetBtn = document.querySelector('#restartButton');

    resetBtn.addEventListener('touchstart', touchStart);
    resetBtn.addEventListener('mousedown', touchStart);

    resetBtn.addEventListener('mouseup', touchEnd);
    resetBtn.addEventListener('mouseleave', touchEnd);
    resetBtn.addEventListener('touchend', touchEnd);
}

function setHoldState(n) {
    document.body.style.setProperty('--hold-state', `${n}`);
}

function draw() {
    drawBG();

    Animator.update();
    GameObjectManager.draw();

    debugText();
}

function drawBG() {
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

    const data = {
        board: GM.board.filter(n => !!n).map(({index, value}) => ({index, value})),
        fps: frameRate()
    };

    push();
    translate(0, 100);
    fill('black');
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
