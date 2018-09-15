import { IShip } from "@src/client/communicationModels";
import * as cl from "classnames";
import { h } from "hyperapp";


interface RemainingShipsArgs {
    ships: Array<IShip>
}

export const RemainingShips = (args: RemainingShipsArgs) => {
    return (
        <div class="remaining-ships">
            <div class="desc">Remaining Ships</div>
            <div class="columns is-gapless">
                {args.ships.map(s => <div><RemainingShip ship={s}/></div>)}
            </div>
        </div>
    )
};

interface RemainingShipsArg {
    ship: IShip
}

export const RemainingShip = (args: RemainingShipsArg) => {
    const cellClasses = cl({
        'ship-cell sunk': args.ship.isSunk,
        'ship-cell': !args.ship.isSunk,
    });

    const cells = [];
    for (let i = 0; i < args.ship.length; i++) {
        cells.push(<div class={cellClasses}/>);
    }
    return cells;
};