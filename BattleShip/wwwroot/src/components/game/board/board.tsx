import { h } from "hyperapp";
import * as cl from "classnames";
import { BoardField } from "@src/client/models";

export interface BoardArgs {
    board: Array<Array<BoardField>>;
    onCellClick: (model: any) => any;
    isEnabled: boolean;
}

export const Board = (args: BoardArgs) => {
    const tableClasses = cl({
        'disabled': !args.isEnabled
    });

    return <table className={tableClasses}>
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
                        const cellClasses = cl({
                            'free': col == BoardField.Free,
                            'ship': col == BoardField.Ship,
                            'shiphit': col == BoardField.ShipHit,
                            'miss': col == BoardField.Miss
                        });

                        const row = [];
                        if (j == 0) {
                            row.push(<td class="marker">{i + 1}</td>)
                        }

                        row.push(<td key={j} className={cellClasses} onclick={() => args.onCellClick({ x: i, y: j })}/>);
                        return row
                    }
                )}
            </tr>
        )}
        </tbody>
    </table>
};