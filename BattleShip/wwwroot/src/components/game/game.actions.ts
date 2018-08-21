import { GameHub } from "@src/client/gameHub";
import { GameCallups, GameState } from "@src/client/states";
import { FireShotModel, FireShotResponseModel, PlayerModel } from "@src/client/communicationModels";
import { BoardService } from "@src/components/game/board/boardService";
import { BoardField } from "@src/components/game/models";

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
    onStartGame: (args: StartGameArgs) => (state: GameState, actions: any) => {
        const { ships, board } = boardService.generateBoard();
        return { opponent: args.opponent, playerBoard: board, ships: ships, isMyTurn: args.isFirstTurn }
    },
    fireShot: (args: ShotArgs) => (state: GameState, actions: any) => {
        gamehub.fireShot({ x: args.x, y: args.y, to: state.opponent })
    },
    onFireShot: (args: FireShotModel) => (state: GameState, actions: any) => {
        let board = state.playerBoard;
        let isHit = board[args.x][args.y] === BoardField.Ship;
        board[args.x][args.y] = isHit ? BoardField.ShipHit : BoardField.Miss;

        gamehub.fireShotResponse({ x: args.x, y: args.y, to: state.opponent, isHit: isHit });

        return { playerBoard: board, isMyTurn: !state.isMyTurn }
    },
    onFireShotResponse: (args: FireShotResponseModel) => (state: GameState, actions: any) => {
        let board = state.opponentBoard;
        board[args.x][args.y] = args.isHit ? BoardField.ShipHit : BoardField.Miss;

        return { opponentBoard: board, isMyTurn: !state.isMyTurn }
    }
};