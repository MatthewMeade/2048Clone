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
    static initialize() {}
}

const GM = GameManager;
