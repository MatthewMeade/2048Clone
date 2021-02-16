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

const ANIM_SCALE_FACTOR = 0.1;

class Block extends GameObject {
    constructor({ index, value }) {
        super({});

        this.index = index;
        this.value = value;
        this.displayValue = value;

        const { pos, size } = this.calculatePosition();
        this.updateDimensions({ pos, size });

        this.animValue = 0;

        this.animateProperty({
            from: -10,
            to: 0,
            propKey: 'animValue',
            time: 100
        });
    }

    calculatePosition(index) {
        index = index ?? this.index;

        const padding = 5;
        const w = width / 4 - 2 * padding;
        const sw = width / 4;

        const col = floor(index / 4);
        const row = index % 4;

        const size = w;
        const pos = {
            x: sw * row + padding,
            y: sw * col + padding
        };

        return { size, pos };
    }

    setValue(n) {
        this.value = n;

        this.animateProperty({
            to: 1,
            propKey: 'animValue',
            time: 75,
            done: () => {
                this.animateProperty({
                    to: 0,
                    propKey: 'animValue',
                    time: 75,
                    done: () => {
                        this.displayValue = this.value;
                    }
                });
            }
        });
    }

    slideTo(n, done) {
        const newPosition = this.calculatePosition(n);

        const distance = Math.abs(this.index - n);

        this.index = n;

        if (distance < 4) {
            // Animate x
            return this.animateProperty({
                from: this.posX,
                to: newPosition.pos.x,
                time: 75 * distance,
                propKey: 'posX',
                done
            });
        }

        // Animate y
        return this.animateProperty({
            from: this.posY,
            to: newPosition.pos.y,
            time: 75 * (distance / 4),
            propKey: 'posY',
            done
        });
    }

    _draw() {
        const animAdjust = this.sizeX * map(this.animValue, 0, 1, 0, ANIM_SCALE_FACTOR);
        const offset = animAdjust / 2;

        const r = 20;

        const value = this.displayValue;

        fill(colorMap[value]);
        noStroke();
        square(-offset, -offset, this.sizeX + animAdjust, r);

        fill('white');

        textAlign(LEFT, CENTER);
        textFont('Verdana');

        const textScale = (this.sizeX + animAdjust) / this.sizeX;
        textSize(textScale * (90 - 10 * value.toString().length));

        const labelText = value.toString();
        const labelWidth = textWidth(labelText);

        const padding = (this.sizeX - labelWidth) / 2;

        text(value, padding, this.sizeY / 2);
    }
}
