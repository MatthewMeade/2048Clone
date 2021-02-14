const colorMap = {
    2: '#d7ccc8',
    4: '#ffccbc',
    8: '#ffcc80',
    16: '#ffe082',
    32: '#fff176',
    64: '#dce775',
    128: '#9ccc65',
    256: '#66bb6a',
    512: '#009688',
    1024: '#00bcd4',
    2048: '#039be5',
    4096: '#1e88e5',
    8192: '#1e88e5',
    16384: '#303f9f',
    32768: '#512da8',
    65536: '#6a1b9a',
    131072: '#ad1457'
};

class Block extends GameObject {
    constructor({ index, value }) {
        super({});

        this.index = index;
        this.value = value;

        const { pos, size } = this.calculatePosition();
        this.updateDimensions({ pos, size });
    }

    calculatePosition() {
        const padding = 5;
        const w = width / 4 - 2 * padding;
        const sw = width / 4;

        const col = floor(this.index / 4);
        const row = this.index % 4;

        console.log({ col, row });

        const size = w;
        const pos = {
            x: sw * row + padding,
            y: sw * col + padding
        };

        return { size, pos };
    }

    _draw() {
        const r = 20;

        fill(colorMap[this.value]);
        noStroke();
        square(0, 0, this.sizeX, r);

        fill('white');

        textAlign(LEFT, CENTER);
        textFont('Verdana');

        textSize(90 - 10 * this.value.toString().length);

        const labelText = this.value.toString();
        const labelWidth = textWidth(labelText);

        const padding = (this.sizeX - labelWidth) / 2;

        text(this.value, padding, this.sizeY / 2);
    }
}
