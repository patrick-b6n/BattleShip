import { h } from "hyperapp";
import { PlayerModel } from "@src/client/communicationModels";
import "./style.scss"
import { RemainingShips } from "@src/components/game/remainingShips";
import { TurnOverlay } from "@src/components/game/turnOverlay";
import { GameState } from "@src/components/game/models";
import { Board } from "@src/components/game/board";

export interface GameArgs {
    player: PlayerModel;
    state: GameState,
    actions: any
}

export const RecentSunkShip = (args: any) => {
    if (args.ship) {        
        return (
            <div class="notify-sunk">
                ✔️&nbsp; Ship sunk
            </div>
        )
    }
};

export const GameScreen = (args: GameArgs) => (
        <div id="game-screen">

            <section class="hero">
                <div class="hero-body mb-2">
                    <div class="container has-text-centered">

                        <h1 class="title">
                            {args.player.name} vs. {args.state.opponent.name}
                        </h1>

                    </div>
                </div>
            </section>

            <div class="container overlap box">
                <div class="columns">
                    <div class="column"/>
                    <div class="column is-narrow">
                        <div class="columns">
                            <div class="column has-text-centered">
                                <div class="title is-4">
                                    Your Board
                                </div>
                            </div>
                        </div>
                        <div class="columns">
                            <div class="column">
                                <Board board={args.state.playerBoard} onCellClick={args.actions.noop} isEnabled={false}/>
                            </div>
                        </div>
                        <RemainingShips ships={args.state.ships}/>
                    </div>
                    <div class="column"/>
                    <div class="column is-narrow">
                        <div class="columns">
                            <div class="column has-text-centered">
                                <div class="title is-4">
                                    Opponent Board
                                </div>
                            </div>
                        </div>
                        <div class="columns">
                            <div class="column" style={{ position: "relative" }}>
                                <TurnOverlay isMyTurn={args.state.isMyTurn}/>
                                <Board board={args.state.opponentBoard} onCellClick={args.actions.fireShot} isEnabled={args.state.isMyTurn}/>
                            </div>
                        </div>
                        <div style={{ "position": "relative" }}>
                            <RecentSunkShip ship={args.state.recentSunkShip}/>
                            <RemainingShips ships={args.state.opponentShips}/>
                        </div>
                    </div>
                    <div class="column"/>
                </div>

                <hr/>

                <div class="columns">
                    <div class="column">
                        <div class="level">
                            <div class="level-item has-text-centered">
                                <button class="button is-danger" onClick={() => {
                                } /*args.actions.askBackToLobby() */}>
                                    <i class="fas fa-sign-out-alt"/> &nbsp; Back to Lobby
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
;