import { GameHub } from "@src/client/gameHub";
import { GameCallups, GameState } from "@src/client/states";
import { FireShotModel, FireShotResponseModel, IShip, PlayerModel } from "@src/client/communicationModels";
import { BoardService } from "@src/components/game/board/boardService";
import { BoardField, Coordinates } from "@src/components/game/models";
import { createTwoDimArray } from "@src/client/helper";

const gamehub = GameHub.getInstance();
const boardService = new BoardService();

export interface StartGameArgs {
    opponent: PlayerModel;
    isFirstTurn: boolean;
}

export interface ShotArgs {
    x: number;
    y: number;
}

export const gameActions = {
    init: (callups: GameCallups) => (state: GameState, actions: any) => {
        actions.setCallups(callups)
    },
    setCallups: (callups: any) => () => {
        return callups
    },
    noop: () => () => {
    },
    onStartGame: (args: StartGameArgs) => () => {
        const { ships, board } = boardService.generateBoard();
        return {
            opponent: args.opponent,
            playerBoard: board,
            opponentBoard: createTwoDimArray(10, 10, BoardField.Free),
            ships: ships,
            opponentShips: ships,
            isMyTurn: args.isFirstTurn
        }
    },
    fireShot: (args: ShotArgs) => (state: GameState) => {
        gamehub.fireShot({ x: args.x, y: args.y, to: state.opponent })
    },
    onFireShot: (args: FireShotModel) => (state: GameState) => {
        const board = state.playerBoard;
        const isHit = board[args.x][args.y] === BoardField.Ship;
        board[args.x][args.y] = isHit ? BoardField.ShipHit : BoardField.Miss;

        state.ships.forEach(s => s.shoot(new Coordinates(args.x, args.y)));
        const shipModels = state.ships.map(s => <IShip>{ length: s.length, isSunk: s.isSunk });

        gamehub.fireShotResponse({
            x: args.x,
            y: args.y,
            to: state.opponent,
            isHit: isHit,
            remainingShips: shipModels
        });

        return { playerBoard: board, isMyTurn: !state.isMyTurn, ships: state.ships }
    },
    onFireShotResponse: (args: FireShotResponseModel) => (state: GameState) => {
        let board = state.opponentBoard;
        board[args.x][args.y] = args.isHit ? BoardField.ShipHit : BoardField.Miss;

        return { opponentBoard: board, opponentShips: args.remainingShips, isMyTurn: !state.isMyTurn }
    }
};