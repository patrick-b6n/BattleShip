import { IShip, PlayerModel } from "@src/client/communicationModels";
import { createTwoDimArray } from "@src/client/helper";
import { Ship } from "@src/components/game/board/boardService";

export interface GameCallups {
    changeView: (view: string) => any;
}

export class GameState implements GameCallups {
    changeView: (view: string) => any;
    gameId: string | null = null;
    isMyTurn = false;
    isOver = false;
    opponent: PlayerModel | null = null;
    playerBoard = createTwoDimArray(10, 10, BoardField.Free);
    ships: Array<Ship> = [];
    opponentBoard = createTwoDimArray(10, 10, BoardField.Free);
    opponentShips: Array<IShip> = [];
    recentSunkShip: boolean = false;
}

export interface ShotArgs {
    x: number;
    y: number;
}

export enum BoardField {
    Free,
    Miss,
    Ship,
    ShipHit
}

export class GridPoint {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}