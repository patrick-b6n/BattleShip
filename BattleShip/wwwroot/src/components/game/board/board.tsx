import { h } from "hyperapp";
import * as cl from "classnames";
import { BoardField } from "@src/client/models";
import "./board.scss"
import { ShotArgs } from "@src/components/game/game.actions";

export interface CellClickArgs {
    x: number;
    y: number;
}

export interface BoardArgs {
    board: Array<Array<BoardField>>;
    onCellClick: (model: ShotArgs) => any;
    isEnabled: boolean;
}

export const Board = (args: BoardArgs) => {

    const boardClasses = cl({
        'game-board clickable': args.isEnabled,
        'game-board': !args.isEnabled,
    });

    return <div className={boardClasses}>
        <div class="grid">
            <div class="cell marker"/>
            {[...Array(args.board.length)].map((x, i) =>
                <div class="cell marker">{String.fromCharCode(65 + i)}</div>
            )}

            {
                args.board.map((row, i) =>
                    row.map((col, j) => {
                        const cellClasses = cl({
                            'cell free': col == BoardField.Free,
                            'cell ship': col == BoardField.Ship,
                            'cell shiphit': col == BoardField.ShipHit,
                            'cell miss': col == BoardField.Miss
                        });

                        const row = [];
                        if (j == 0) {
                            row.push(<div class="cell marker">{i + 1}</div>)
                        }

                        if (col == BoardField.Free) {
                            row.push(<div className={cellClasses} onclick={() => args.onCellClick({ x: i, y: j })}/>);
                        }
                        else {
                            row.push(<div className={cellClasses}/>);
                        }
                        return row;
                    })
                )
            }
        </div>
    </div>
};