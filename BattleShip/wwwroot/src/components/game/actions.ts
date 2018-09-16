import { GameHub } from "@src/client/gameHub";
import { FireShotModel, FireShotResponseModel, IShip, PlayerModel } from "@src/client/communicationModels";
import { BoardField, GameCallups, GameState, GridPoint, ShotArgs } from "@src/components/game/models";
import { createTwoDimArray } from "@src/client/helper";
import Swal from "sweetalert2";
import Constants from "@src/constants";
import { BoardService } from "@src/components/game/boardService";

const gamehub = GameHub.getInstance();
const boardService = new BoardService();

export interface StartGameArgs {
    opponent: PlayerModel;
    isFirstTurn: boolean;
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
        const opponentShips = boardService.generateOpponentShips();

        return {
            opponent: args.opponent,
            playerBoard: board,
            opponentBoard: createTwoDimArray(10, 10, BoardField.Free),
            ships: ships,
            opponentShips: opponentShips,
            isMyTurn: args.isFirstTurn
        }
    },
    onPlayerLeft: (value: PlayerModel) => (state: GameState, actions: any) => {
        if (state.opponent && value.id === state.opponent.id) {
            Swal({
                title: `You won`,
                text: `Your opponent left the game`,
                confirmButtonText: 'Back to Lobby',
                showConfirmButton: true,
            }).then(() => {
                state.changeView(Constants.V_Lobby)
            });
        }
    },
    fireShot: (args: ShotArgs) => (state: GameState) => {
        gamehub.fireShot({ x: args.x, y: args.y, to: state.opponent })
    },
    onFireShot: (args: FireShotModel) => (state: GameState, actions: any) => {
        const board = state.playerBoard;
        const isHit = board[args.x][args.y] === BoardField.Ship;
        board[args.x][args.y] = isHit ? BoardField.ShipHit : BoardField.Miss;

        let isSunk = false;
        for (const s of state.ships) {
            if (s.shoot(new GridPoint(args.x, args.y))) {
                isSunk = s.isSunk;
                break;
            }
        }
       

        const shipModels = state.ships.map(s => <IShip>{ length: s.length, isSunk: s.isSunk });

        gamehub.fireShotResponse({
            x: args.x,
            y: args.y,
            to: state.opponent,
            isHit: isHit,
            isSunk: isSunk,
            remainingShips: shipModels
        });

        if (state.ships.every(s => s.isSunk)) {
            Swal({
                title: `You lost`,
                confirmButtonText: 'Back to Lobby',
                showConfirmButton: true,
            }).then(() => {
                state.changeView(Constants.V_Lobby)
            });
        }

        actions.clearRecentSunkShip();

        return { playerBoard: board, isMyTurn: !state.isMyTurn, ships: state.ships }
    },
    onFireShotResponse: (args: FireShotResponseModel) => (state: GameState, actions: any) => {
        let board = state.opponentBoard;
        board[args.x][args.y] = args.isHit ? BoardField.ShipHit : BoardField.Miss;

        if (args.remainingShips.every(s => s.isSunk)) {
            Swal({
                title: `You won`,
                confirmButtonText: 'Back to Lobby',
                showConfirmButton: true,
            }).then(() => {
                state.changeView(Constants.V_Lobby)
            });
        }

        let recentSunk = false;
        if (state.opponentShips.filter(x => x.isSunk) < args.remainingShips.filter(x => x.isSunk)) {
            recentSunk = true;
        }

        setTimeout(actions.clearRecentSunkShip, 2000);

        return { opponentBoard: board, opponentShips: args.remainingShips, isMyTurn: !state.isMyTurn, recentSunkShip: recentSunk }
    },
    clearRecentSunkShip: () => () => {
        return { recentSunkShip: false }
    }
};