import { h } from "hyperapp";
import * as cl from "classnames";
import { BoardField, GameState, PlayerModel, Shot, ShotModel } from "../models";
import { placeShipsRandomly } from "../helper";
import { GameHub } from "../gameHub";

const gamehub = GameHub.getInstance();

export interface GameArgs {
    player: PlayerModel;
    state: GameState,
    actions: any
}

export interface BoardArgs {
    board: Array<Array<BoardField>>;
    onCellClick: (model: any) => any;
}

export const gameActions = {
    gameStarted: (model: any) => (state: GameState) => {
        const opponent = model.model.game.player1.id === model.player.id ? model.model.game.player2 : model.model.game.player1;
        placeShipsRandomly(state.playerBoard);
        return { isActive: true, opponent: opponent, playerBoard: state.playerBoard }
    },
    fireShot: (shot: Shot) => () => {
        gamehub.fireShot(shot);
    },
    shotFired: (model: ShotModel) => (state: GameState) => {
        const cell = state.playerBoard[model.x][model.y];

        if (cell == BoardField.Ship) {
            model.result = BoardField.ShipHit;
        }
        else if (cell == BoardField.Free) {
            model.result = BoardField.Miss
        }

        state.playerBoard[model.x][model.y] = model.result;
        gamehub.shotResult(model);

        return { playerBoard: state.playerBoard }
    },
    onShotResult: (model: ShotModel) => (state: GameState) => {
        state.opponentBoard[model.x][model.y] = model.result;
        return { opponentBoard: state.opponentBoard }
    }
};

export const Board = (args: BoardArgs) => (
    <table>
        <tbody>
        <tr>
            <td class="marker"/>
            {[...Array(args.board.length)].map((x, i) =>
                <td class="marker">{String.fromCharCode(65 + i)}</td>
            )}
        </tr>

        {args.board.map((row, i) =>
            <tr key={i}>
                {row.map((col, j) => {
                        const c = cl({
                            'free': col == BoardField.Free,
                            'ship': col == BoardField.Ship,
                            'shiphit': col == BoardField.ShipHit,
                            'miss': col == BoardField.Miss
                        });

                    const r = [];
                    if (j == 0) {
                        r.push(<td class="marker">{i + 1}</td>)
                    }

                    r.push(<td key={j} className={c} onclick={() => args.onCellClick({ x: i, y: j })}/>);
                    return r
                    }
                )}
            </tr>
        )}
        </tbody>
    </table>
);

export const GameScreen = (args: GameArgs) => (
    <div id="game-screen">
        <h2 class="ta-center">
            {args.player.name} vs. {args.state.opponent.name}
        </h2>

        <div style={{ display: "flex", justifyContent: "center" }}>
            <div>
                <Board board={args.state.playerBoard}
                       onCellClick={() => {
                       }}/>
            </div>
            <div style={{ width: "5rem" }}>
            </div>
            <div>
                <Board board={args.state.opponentBoard}
                       onCellClick={args.actions.fireShot}/>
            </div>
        </div>
    </div>
);