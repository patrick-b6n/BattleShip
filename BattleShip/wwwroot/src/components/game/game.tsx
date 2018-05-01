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
        <button onclick={() => args.actions.backToLobby()}>Quit game</button>
        <h2 class="ta-center">
            {args.player.name} vs. {args.state.opponent.name}
        </h2>

        <div style={{ display: "flex", justifyContent: "center" }}>
            <TurnMarker isMyTurn={args.state.isMyTurn}/>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
            <div>
                <Board board={args.state.playerBoard} onCellClick={args.actions.noop} isEnabled={false}/>
            </div>
            <div style={{ width: "5rem" }}>
            </div>
            <div style={{ position: "relative" }}>
                {!args.state.isMyTurn && <div class="turn-overlay"/>}
                <Board board={args.state.opponentBoard} onCellClick={args.actions.fireShot} isEnabled={args.state.isMyTurn}/></div>
        </div>
    </div>
);