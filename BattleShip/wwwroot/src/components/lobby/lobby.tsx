import { h } from "hyperapp";
import "./styles.scss"
import { PlayerModel } from "@src/client/communicationModels";
import { PlayerList } from "@src/components/lobby/playerlist";
import { EventLog } from "@src/components/lobby/eventlog";
import { LobbyState } from "@src/components/lobby/models";

export interface LobbyArgs {
    currentPlayer: PlayerModel;
    lobby: LobbyState;
    actions: any;
    onPlayerNameChanged: any;
}

export const LobbyScreen = (args: LobbyArgs) => (
    <div id="lobby" oncreate={() => args.actions.init(args)}>

        <section className="hero">
            <div className="hero-body mb-2">
                <div className="container has-text-centered">

                    <h1 className="title">
                        ⚔️BattleShip 🚢
                    </h1>

                </div>
            </div>
        </section>

        <div class="container overlap box">
            <div class="columns ">

                <div className="column is-8">
                    <p className="title">Messages</p>
                    <EventLog events={args.lobby.events}/>
                </div>

                <div class="column is-narrow separator"/>

                <div class="column is-4">
                    <p className="title">Players</p>
                    <PlayerList currentPlayer={args.currentPlayer} players={args.lobby.playersInLobby}
                                requestMatch={args.actions.requestMatch}/>
                </div>

            </div>
        </div>
    </div>
);