const FOUR_CHANCE = 0.1;
const SWIPE_THRESHOLD = 0.25;
class GameManager {
    static initialize() {
        this.board = new Array(4 * 4);
        this.inputLocked = false;

        this.score = 0;
        this.highScore = localStorage.getItem('highScore', 0);
        this.updateScore();

        this.touchStart = null;

        this.insertRandomBlock();
    }

    static restart() {
        this.board.forEach((b) => b?.destroy());
        this.initialize();
    }

    static async makeMove(dir) {
        if (this.inputLocked) {
            return;
        }
        this.inputLocked = true;

        const promises = [];

        if (dir === 'Right' || dir === 'Down') {
            for (let i = this.board.length - 1; i >= 0; i--) {
                promises.push(this.moveBlock(i, dir));
            }
        }

        if (dir === 'Left' || dir === 'Up') {
            for (let i = 0; i < this.board.length; i++) {
                promises.push(this.moveBlock(i, dir));
            }
        }

        const results = await Promise.all(promises);

        if (results.includes(true)) {
            return setTimeout(() => {
                this.insertRandomBlock();
                this.inputLocked = false;
            }, 125);
        }
        this.inputLocked = false;
    }

    static async moveBlock(index, dir) {
        const block = this.board[index];
        const { row, col } = this.indexToRowCol(index);

        if (!block) {
            return false;
        }

        let prevBlank = null;
        if (dir === 'Right') {
            for (let i = index + 1; i < (row + 1) * 4; i++) {
                const cur = this.board[i];
                if (!cur) prevBlank = i;
                else if (cur.value === block.value) return this.slideBlock(index, i, block.value * 2);
                else break;
            }
        }

        if (dir === 'Left') {
            for (let i = index - 1; i >= row * 4; i--) {
                const cur = this.board[i];
                if (!cur) prevBlank = i;
                else if (cur.value === block.value) return this.slideBlock(index, i, block.value * 2);
                else break;
            }
        }

        if (dir === 'Down') {
            for (let i = index + 4; i <= 12 + col; i += 4) {
                const cur = this.board[i];
                if (!cur) prevBlank = i;
                else if (cur.value === block.value) return this.slideBlock(index, i, block.value * 2);
                else break;
            }
        }

        if (dir === 'Up') {
            for (let i = index - 4; i >= col; i -= 4) {
                const cur = this.board[i];
                if (!cur) prevBlank = i;
                else if (cur.value === block.value) return this.slideBlock(index, i, block.value * 2);
                else break;
            }
        }

        if (prevBlank === null) {
            return;
        }

        return this.slideBlock(index, prevBlank);
    }

    static slideBlock(from, to, set) {
        const fromBlock = this.board[from];
        const toBlock = this.board[to];

        this.board[from] = undefined;
        this.board[to] = fromBlock;

        if (set) {
            fromBlock.value = set;
            this.score += set;
            this.updateScore();
        }

        if (toBlock) {
            fromBlock.zIndex = toBlock.zIndex + 1;
        }

        return new Promise((resolve) => {
            fromBlock.slideTo(to, () => {
                
                const audio = new Audio('assets/click1.ogg');
                audio.playbackRate = random(0.75, 1.25);
                audio.volume = random(0.1,0.3);
                audio.play();
                if (set) {
                    fromBlock.setValue(set);
                }

                if (toBlock) {
                    toBlock.destroy();
                }

                resolve(true);
            });
        });
    }

    static createBlocks() {}

    static destroyBlocks() {
        this.board.forEach((b) => b.destroy());
    }

    static boardValues() {
        return this.board.map((b) => b?.value);
    }

    static indexToRowCol(index) {
        return {
            row: Math.floor(index / 4),
            col: index % 4
        };
    }

    static insertRandomBlock() {
        if (!this.board.includes(undefined)) {
            return;
        }

        while (true) {
            const index = Math.floor(Math.random() * this.board.length);
            if (this.board[index]) {
                continue;
            }

            const value = Math.random() < FOUR_CHANCE ? 4 : 2;
            this.board[index] = new Block({
                index,
                value
            });
            return this.board[index];
        }
    }

    static keyPressed(key) {
        if (key.startsWith('Arrow')) {
            return this.makeMove(key.split('Arrow')[1]);
        }

        if (key === 'r' || key === 'R') {
            return this.restart();
        }
    }

    static updateScore() {
        if (this.score >= this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.score);
        }

        document.querySelector('#curScore').innerHTML = this.score;
        document.querySelector('#highScore').innerHTML = this.highScore;
    }

    static touchStarted() {
        this.touchStart = {
            x: mouseX,
            y: mouseY
        };
    }

    static touchMoved() {
        if (!this.touchStart) {
            return;
        }

        const deltaX = mouseX - this.touchStart.x;
        const deltaY = mouseY - this.touchStart.y;

        const minSwipe = SWIPE_THRESHOLD * width;
        if (deltaX > minSwipe) {
            this.makeMove('Right');
        } else if (deltaX < -minSwipe) {
            this.makeMove('Left');
        } else if (deltaY > minSwipe) {
            this.makeMove('Down');
        } else if (deltaY < -minSwipe) {
            this.makeMove('Up');
        } else {
            return;
        }

        console.log({ deltaX, deltaY });

        this.touchStart = null;
    }

    static touchEnded() {
        this.touchStart = null;
    }
}

function playSynth() {
    // userStartAudio();
    // const value = random(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    // const type = random(['#', 'b', '']);
    // const octave = random(1, 8);
    // let note = value + type + octave;
    // let velocity = random();
    // let time = 0;
    // let dur = 1/6;
    // monoSynth.play(note, velocity, time, dur);
}

const GM = GameManager;
