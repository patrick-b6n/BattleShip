import { h } from "hyperapp";
import * as cl from "classnames";
import { BoardField, GameState, PlayerModel } from "../models";
import { placeShipsRandomly } from "../helper";

export interface GameArgs {
    player: PlayerModel;
    state: GameState,
    actions: any
}

export interface BoardArgs {
    board: Array<Array<BoardField>>;
}

export const gameActions = {
    gameStarted: (model: any) => (state: GameState) => {
        const opponent = model.model.game.player1.id === model.player.id ? model.model.game.player2 : model.model.game.player1;
        placeShipsRandomly(state.playerBoard);
        return { isActive: true, opponent: opponent, playerBoard: state.playerBoard }
    }
};

export const Board = (args: BoardArgs) => (
    <table>
        <tbody>
        {args.board.map((row, i) =>
            <tr key={i}>
                {row.map((col, j) => {
                        const c = cl({
                            'free': col == BoardField.Free,
                            'ship': col == BoardField.Ship,
                            'shiphit': col == BoardField.ShipHit,
                            'miss': col == BoardField.Miss
                        });

                        return <td key={j} className={c}/>
                    }
                )}
            </tr>
        )}
        </tbody>
    </table>
);

export const GameScreen = (args: GameArgs) => (
    <div id="game-screen">
        <h2>
            {args.player.name} vs. {args.state.opponent.name}
        </h2>

        <div style={{ display: "flex" }}>
            <div>
                <Board board={args.state.playerBoard}/>
            </div>
            <div style={{ padding: "0 1rem" }}>
                vs.
            </div>
            <div>
                <Board board={args.state.opponentBoard}/>
            </div>
        </div>
    </div>
);