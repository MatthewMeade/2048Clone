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
        this.board = new Array(4).fill(new Array(4));

        for (let i = 1; i <= 16; i++) {
            this.testSpace = new Block({
                index: i - 1,
                value: 2 ** i
            });
        }
    }
}

const GM = GameManager;
