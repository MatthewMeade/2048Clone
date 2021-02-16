const FOUR_CHANCE = 0.1;

const debounce = (cb, n) => {
    let time = Date.now();
    return (...args) => {
        if (time + n - Date.now() < 0) {
            cb(...args);
            time = Date.now();
        }
    };
};
class GameManager {
    static initialize() {
        this.board = new Array(4 * 4);
        this.inputLocked = false;

        this.score = 0;

        // const boardTemplate = [
        //     2,0,0,0,
        //     2,0,0,0,
        //     2,0,0,0,
        //     2,0,0,0
        // ];

        // boardTemplate.forEach((value, index) => {
        //     if (value === 0) {return}
        //     this.board[index] = new Block({index, value});
        // });
        this.insertRandomBlock();
    }

    static async makeMove(dir) {

        if (this.inputLocked){
            return;
        }

        const promises = [];

        if (dir === 'Right' || dir === 'Down') {
            for (let i = this.board.length - 1; i >= 0; i--) {
                promises.push(this.moveBlock(i, dir));
            }
        }

        if (dir === 'Left' || dir === "Up") {
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
            this.makeMove(key.split('Arrow')[1]);
        }
    }

    static updateScore(){
        document.querySelector("#scoreValue").innerHTML = this.score
    }
}

const GM = GameManager;
