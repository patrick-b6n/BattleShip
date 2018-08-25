import { h } from "hyperapp";
import { GameState } from "@src/client/states";
import { IShip, PlayerModel } from "@src/client/communicationModels";
import { Board } from "@src/components/game/board/board";
import "./game.scss"
import * as cl from "classnames";

export interface GameArgs {
    player: PlayerModel;
    state: GameState,
    actions: any
}

interface TurnMarkerArgs {
    isMyTurn: boolean
}

interface RemainingShipsArgs {
    ships: Array<IShip>
}

interface RemainingShipsArg {
    ship: IShip
}

const TurnMarker = (args: TurnMarkerArgs) => {
    if (args.isMyTurn) {
        return <div>Your Turn</div>
    }
    else {
        return <div>Waiting for Opponent</div>
    }
};

const RemainingShips = (args: RemainingShipsArgs) => {
    return (
        <div class="remaining-ships">
            <div style={{ "marginBottom": ".25rem", "fontWeight": 500 }}>Remaining Ships</div>
            <div class="columns is-gapless">
                {args.ships.map(s => <div><RemainingShip ship={s}/></div>)}
            </div>
        </div>
    )
};

const RemainingShip = (args: RemainingShipsArg) => {

    const cellClasses = cl({
        'ship-cell sunk': args.ship.isSunk,
        'ship-cell': !args.ship.isSunk,
    });

    const cells = [];
    for (let i = 0; i < args.ship.length; i++) {
        cells.push(<div className={cellClasses}/>);
    }
    return cells;
};

export const GameScreen = (args: GameArgs) => (
    <div id="game-screen">

        <section className="hero is-light">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title has-text-centered">
                        {args.player.name} vs. {args.state.opponent.name}
                    </h1>
                </div>
            </div>
        </section>

        <div class="container mt-3">
            <div class="columns">
                <div className="column"/>
                <div class="column is-narrow">
                    <div class="columns">
                        <div class="column has-text-centered">
                            <div class="title is-4">
                                Your Board
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <Board board={args.state.playerBoard} onCellClick={args.actions.noop}
                                   isEnabled={false}/>
                        </div>
                    </div>
                    <RemainingShips ships={args.state.ships}/>
                </div>
                <div class="column"/>
                <div class="column is-narrow">
                    <div className="columns">
                        <div className="column has-text-centered">
                            <div class="title is-4">
                                Opponent Board
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div class="column" style={{ position: "relative" }}>
                            {!args.state.isMyTurn && <div class="turn-overlay">
                                <div>Wait for your opponent</div>
                            </div>}
                            <Board board={args.state.opponentBoard} onCellClick={args.actions.fireShot}
                                   isEnabled={args.state.isMyTurn}/>
                        </div>
                    </div>
                    <RemainingShips ships={args.state.opponentShips}/>
                </div>
                <div className="column"/>
            </div>
        </div>

        <div class="container mt-3">
            <div class="columns is-centered">
                <button class="button" onclick={() => args.actions.askBackToLobby()}>Leave game</button>
            </div>
        </div>
    </div>
);