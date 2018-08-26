import { IDictionary } from "@src/client/models";
import { createTwoDimArray } from "@src/client/helper";
import { BoardField, GridPoint } from "@src/components/game/models";
import { IShip } from "@src/client/communicationModels";

export interface GeneratedBoard {
    ships: Array<Ship>;
    board: Array<Array<BoardField>>;
}

export class Ship implements IShip {
    private coordinateToIsHit: IDictionary<boolean> = {};

    constructor(coordinates: GridPoint[]) {
        coordinates.forEach(c => this.coordinateToIsHit[Ship.stringify(c)] = false)
    }

    get isSunk(): boolean {
        for (let key in this.coordinateToIsHit) {
            if (!this.coordinateToIsHit[key]) {
                return false;
            }
        }

        return true;
    }

    get length(): number {
        return Object.keys(this.coordinateToIsHit).length;
    }

    private static stringify(coordinate: GridPoint) {
        return `${coordinate.x}_${coordinate.y}`
    }

    public shoot(shot: GridPoint): boolean {
        let coords = Ship.stringify(shot);

        if (this.coordinateToIsHit.hasOwnProperty(coords)) {
            this.coordinateToIsHit[coords] = true;
            return true;
        }

        return false;
    }
}

interface IShipStartPosition {
    dir: number;
    point: GridPoint;
}

export class BoardService {
    // private readonly _availableShipLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    private readonly _availableShipLengths = [1];

    public isInsideBoundaries(board: Array<Array<BoardField>>, coords: GridPoint): boolean {
        if (coords.x < 0 || coords.x >= board.length) {
            return false;
        }

        if (coords.y < 0 || coords.y >= board[coords.x].length) {
            return false;
        }

        return true;
    }

    public generateBoard(): GeneratedBoard {
        while (true) {
            const board = createTwoDimArray(10, 10, BoardField.Free);
            const ships: Array<Ship> = [];

            try {
                for (const size of this._availableShipLengths) {
                    const shipStartPosition = this.findShipPosition(board, size);

                    const coords: Array<GridPoint> = [];
                    for (let i = 0; i < size; i++) {
                        const x = shipStartPosition.dir === 1 ? shipStartPosition.point.x : shipStartPosition.point.x + i;
                        const y = shipStartPosition.dir === 0 ? shipStartPosition.point.y : shipStartPosition.point.y + i;
                        board[x][y] = BoardField.Ship;

                        coords.push(new GridPoint(x, y))
                    }

                    ships.push(new Ship(coords));
                }

                return { ships, board };
            }
            catch (e) {
            }
        }
    }

    public generateOpponentShips(): Array<IShip> {
        const ships: Array<IShip> = [];
        for (const size of this._availableShipLengths) {
            ships.push({ isSunk: false, length: size })
        }

        return ships;
    }

    private resetBoard(board: Array<Array<BoardField>>) {
        for (let x = 0; x < board.length; x++) {
            for (let y = 0; y < board[x].length; y++) {
                board[x][y] = BoardField.Free;
            }
        }
    }

    /**
     * true, on Outside or BoardField.Free
     */
    private isFieldOccupied(board: Array<Array<BoardField>>, coords: GridPoint): boolean {
        const isOutside = !this.isInsideBoundaries(board, coords);
        if (isOutside) {
            return false;
        }
        else {
            return board[coords.x][coords.y] !== BoardField.Free;
        }
    }

    private findShipPosition(board: Array<Array<BoardField>>, shipSize: number): IShipStartPosition {
        let tries = 0;

        while (true) {
            tries++;
            if (tries > 50) {
                throw "try again";
            }

            const xStart = Math.round(Math.random() * 9);
            const yStart = Math.round(Math.random() * 9);
            const dir = Math.round(Math.random());

            let free = true;
            for (let i = 0; i < shipSize; i++) {
                const x = dir === 1 ? xStart : xStart + i;
                const y = dir === 0 ? yStart : yStart + i;

                const isOutside = !this.isInsideBoundaries(board, new GridPoint(x, y));
                if (isOutside || board[x][y] !== BoardField.Free) {
                    free = false;
                    break;
                }

                // Check for free neighbours
                if (this.isFieldOccupied(board, new GridPoint(x + 1, y))
                    || this.isFieldOccupied(board, new GridPoint(x + 1, y + 1))
                    || this.isFieldOccupied(board, new GridPoint(x, y + 1))
                    || this.isFieldOccupied(board, new GridPoint(x - 1, y))
                    || this.isFieldOccupied(board, new GridPoint(x - 1, y - 1))
                    || this.isFieldOccupied(board, new GridPoint(x, y - 1))
                    || this.isFieldOccupied(board, new GridPoint(x - 1, y + 1))
                    || this.isFieldOccupied(board, new GridPoint(x + 1, y - 1))
                ) {
                    free = false;
                    break;
                }
            }

            if (free) {
                return { dir: dir, point: new GridPoint(xStart, yStart) }
            }
        }
    }
}