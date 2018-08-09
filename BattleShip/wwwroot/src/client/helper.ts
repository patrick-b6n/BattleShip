export function generateName() {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let text = "";
    for (let i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

export function createTwoDimArray<T>(l1: number, l2: number, defaultValue: T): Array<T>[] {
    const arr: Array<T>[] = [];

    for (let i = 0; i < l1; i++) {
        const inner: T[] = [];
        arr.push(inner);
        for (let j = 0; j < l2; j++) {
            inner.push(defaultValue)
        }
    }

    return arr;
}