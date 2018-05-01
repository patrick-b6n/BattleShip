import { h } from "hyperapp";
import { GameState } from "@src/client/states";
import { PlayerModel } from "@src/client/models";
import { Board } from "@src/components/game/board/board";
import "./game.scss"

export interface GameArgs {
    player: PlayerModel;
    state: GameState,
    actions: any
}

interface TurnMarkerArgs {
    isMyTurn: boolean
}

const TurnMarker = (args: TurnMarkerArgs) => {
    if (args.isMyTurn) {
        return <div>Your Turn</div>
    }
    else {
        return <div>Waiting for Opponent</div>
    }
};

export const GameScreen = (args: GameArgs) => (
    <div id="game-screen">

        <section className="hero is-light">
            <div className="hero-body">
                <div className="container">
                    <h1 className="title has-text-centered">
                        {args.player.name} vs. {args.state.opponent.name}
                    </h1>
                    <h2 class="subtitle has-text-centered">
                        <TurnMarker isMyTurn={args.state.isMyTurn}/>
                    </h2>
                </div>
            </div>
        </section>

        <div class="container pt-3">
            <div class="columns is-centered">
                <div class="column">
                    <Board board={args.state.playerBoard} onCellClick={args.actions.noop} isEnabled={false}/>
                </div>
                <div class="column" style={{ position: "relative" }}>
                    {!args.state.isMyTurn && <div class="turn-overlay"/>}
                    <Board board={args.state.opponentBoard} onCellClick={args.actions.fireShot} isEnabled={args.state.isMyTurn}/>
                </div>
            </div>
        </div>

        <div class="container pt-3">
            <div class="columns is-centered">
                <button class="button" onClick={() => args.actions.backToLobby()}>Quit game</button>
            </div>
        </div>
    </div>
);