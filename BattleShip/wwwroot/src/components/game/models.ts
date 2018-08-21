export enum BoardField {
    Free,
    Miss,
    Ship,
    ShipHit
}

export class Coordinates {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}