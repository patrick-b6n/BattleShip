import { placeShipsRandomly } from "../helper";
import { BoardField, FireShotModel, GameStateModel, Shot, ShotFeedback, ShotFeedbackModel } from "../models";
import { GameHub } from "../gameHub";
import { GameState } from "../states";
import Swal from 'sweetalert2'

const gamehub = GameHub.getInstance();

enum GameEndReason {
    Won,
    Lost,
    Disconnect
}

interface GameEnded {
    reason: GameEndReason;
}

export const gameActions = {
    noop: () => () => {
    },
    backToLobby: () => (state: GameState) => {

        const model: GameStateModel = {
            gameId: state.gameId,
            currentPlayerId: state.opponent.playerId,
            winnerPlayerId: null,
            disconnect: true
        };

        gamehub.gameState(model);
        gamehub.leaveGame();

        return new GameState();
    },
    startGame: (args: any) => (state: GameState) => {
        const opponent = args.model.game.player1.playerId === args.player.playerId ? args.model.game.player2 : args.model.game.player1;
        placeShipsRandomly(state.playerBoard);
        return {
            gameId: args.model.game.gameId,
            isActive: true,
            isMyTurn: args.model.firstTurn,
            opponent: opponent,
            playerBoard: state.playerBoard,
        }
    },
    gameEnded: (model: GameEnded) => (state: GameState, actions: any) => {
        const reason = (() => {
            switch (model.reason) {
                case GameEndReason.Lost:
                    return "You lost";
                case GameEndReason.Won:
                    return "You won";
                case GameEndReason.Disconnect:
                    return "Your opponent left the game"
            }
        })();

        Swal({
            title: reason,
            confirmButtonText: "Back to lobby",
            allowOutsideClick: false
        }).then((result) => {
            actions.backToLobby();
        });
    },
    fireShot: (shot: Shot) => (state: GameState) => {
        if (state.isMyTurn) {
            gamehub.fireShot(shot);
        }
    },
    shotFired: (model: FireShotModel) => (state: GameState) => {
        const cell = state.playerBoard[model.x][model.y];

        const result = (() => {
            if (cell === BoardField.Ship) {
                return BoardField.ShipHit;
            }
            else if (cell === BoardField.Free) {
                return BoardField.Miss
            }
        })();

        state.playerBoard[model.x][model.y] = result;
        const remainingShipCount = isGameEnd(state.playerBoard) ? 0 : 1;
        const feedback = new ShotFeedback(model.x, model.y, remainingShipCount, result);

        gamehub.shotFeedback(feedback);

        return { playerBoard: state.playerBoard }
    },
    playerLeft: () => (state: GameState, actions: any) => {
        if (null === state.gameId) {
            return;
        }

        actions.gameEnded({ reason: GameEndReason.Disconnect })
    },
    onShotFeedback: (model: ShotFeedbackModel) => (state: GameState) => {
        state.opponentBoard[model.x][model.y] = model.result;

        const isEnd = 0 === model.remainingShipCount;

        const gameState: GameStateModel = {
            gameId: state.gameId,
            currentPlayerId: state.opponent.playerId,
            winnerPlayerId: isEnd ? state.opponent.playerId : null,
            disconnect: false
        };

        gamehub.gameState(gameState);
        return { opponentBoard: state.opponentBoard }
    },
    onGameState: (model: GameStateModel) => (state: GameState, actions: any) => {
        if (null === state.gameId) {
            return;
        }

        if (model.winnerPlayerId !== null) {
            if (model.winnerPlayerId === state.opponent.playerId) {
                actions.gameEnded({ reason: GameEndReason.Lost })
            }
            else {
                actions.gameEnded({ reason: GameEndReason.Won })
            }
        }

        if (model.disconnect) {
            actions.gameEnded({ reason: GameEndReason.Disconnect })
        }

        return { isMyTurn: state.opponent.playerId !== model.currentPlayerId }
    }
};

function isGameEnd(board: Array<BoardField>[]): boolean {
    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length; y++) {
            if (BoardField.Ship === board[x][y]) {
                return false;
            }
        }
    }

    return true;
}