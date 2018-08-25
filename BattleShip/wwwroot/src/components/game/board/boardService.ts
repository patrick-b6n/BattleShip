import { IDictionary } from "@src/client/models";
import { createTwoDimArray } from "@src/client/helper";
import { BoardField, Coordinates } from "@src/components/game/models";
import { IShip } from "@src/client/communicationModels";

export interface GeneratedBoard {
    ships: Array<Ship>;
    board: Array<Array<BoardField>>;
}

export class Ship implements IShip {
    private coordinateToIsHit: IDictionary<boolean> = {};

    constructor(coordinates: Coordinates[]) {
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

    public shoot(shot: Coordinates): boolean {
        let coords = Ship.stringify(shot);

        if (this.coordinateToIsHit.hasOwnProperty(coords)) {
            this.coordinateToIsHit[coords] = true;
            return true;
        }

        return false;
    }

    private static stringify(coordinate: Coordinates) {
        return `${coordinate.x}_${coordinate.y}`
    }
}

export class BoardService {
    private static resetBoard(board: Array<Array<BoardField>>) {
        for (let x = 0; x < board.length; x++) {
            for (let y = 0; y < board[x].length; y++) {
                board[x][y] = BoardField.Free;
            }
        }
    }

    public generateBoard(): GeneratedBoard {
        function checkIsFieldFree(board: Array<Array<BoardField>>, x: number, y: number): boolean {
            if (x < 0 || x >= board.length || y >= board.length || y < 0) {
                return true;
            }

            return board[x][y] === BoardField.Free
        }

        const board = createTwoDimArray(10, 10, BoardField.Free);
        BoardService.resetBoard(board);

        const sizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
        const ships: Array<Ship> = [];

        for (const size of sizes) {
            while (true) {
                const xStart = Math.round(Math.random() * 9);
                const yStart = Math.round(Math.random() * 9);
                const dir = Math.round(Math.random());

                let free = true;
                for (let i = 0; i < size; i++) {
                    const xCheck = dir === 1 ? xStart : xStart + i;
                    const yCheck = dir === 0 ? yStart : yStart + i;

                    const isOutsideOfBounds = xCheck < 0 || xCheck >= board.length || yCheck < 0 || yCheck >= board.length;

                    if (isOutsideOfBounds
                        || !checkIsFieldFree(board, xCheck, yCheck)
                        || !checkIsFieldFree(board, xCheck + 1, yCheck)
                        || !checkIsFieldFree(board, xCheck + 1, yCheck + 1)
                        || !checkIsFieldFree(board, xCheck, yCheck + 1)
                        || !checkIsFieldFree(board, xCheck - 1, yCheck)
                        || !checkIsFieldFree(board, xCheck - 1, yCheck - 1)
                        || !checkIsFieldFree(board, xCheck, yCheck - 1)
                        || !checkIsFieldFree(board, xCheck - 1, yCheck + 1)
                        || !checkIsFieldFree(board, xCheck + 1, yCheck - 1)
                    ) {
                        free = false;
                    }
                }

                if (free) {
                    const coordinates: Array<Coordinates> = [];
                    for (let i = 0; i < size; i++) {
                        const x = dir === 1 ? xStart : xStart + i;
                        const y = dir === 0 ? yStart : yStart + i;
                        board[x][y] = BoardField.Ship;

                        coordinates.push(new Coordinates(x, y))
                    }

                    ships.push(new Ship(coordinates));
                    break;
                }
            }
        }

        return { ships, board };
    }
}