function setup() {
    Animator.init();
    GameObjectManager.init();
    pixelDensity(1);

    colorMode(RGB);

    GameManager.initialize();

    this.canvas = createCanvas();
    windowResized();

    this.showDebug = false;
}

function draw() {
    drawBG();

    Animator.update();
    GameObjectManager.draw();

    debugText();
}

function drawBG() {
    background(curBGColor());
    const bgColor = GM.curTheme ? curDynColor() : color(25, 25, 25);
    document.body.style.backgroundColor = bgColor.toString();
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

function keyPressed() {}

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
