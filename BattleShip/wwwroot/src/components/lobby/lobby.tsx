import { h } from "hyperapp";
import { LobbyState } from "@src/client/states";
import { PlayerList } from "@src/components/lobby/playerlist/playerlist";
import { EventLog } from "@src/components/lobby/eventlog/eventlog";
import "./lobby.scss"
import { PlayerModel } from "@src/client/communicationModels";

export interface LobbyArgs {
    currentPlayer: PlayerModel;
    lobby: LobbyState;
    actions: any;
    onPlayerNameChanged: any;
}

export const LobbyScreen = (args: LobbyArgs) => (
    <div id="lobby" oncreate={() => args.actions.init(args)}>

        <section className="hero is-primary">
            <div className="hero-body mb-2">
                <div className="container">
                    <div class="level">
                        <div class="level-item level-left is-narrow">
                            <h1 className="title">
                                Hello {args.lobby.playerName}!
                            </h1>
                        </div>
                        <div class="level-item level-left" style={{ paddingLeft: "1rem" }}>
                                <span className="icon change-name" onclick={() => args.actions.editName()} title="Change your name">
                                    <i className="fas fa-edit"/>
                                </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="container overlap">
            <div class="columns ">

                <div className="column is-8">
                    <div class="box">
                        <div>
                            <p className="title">Messages</p>
                        </div>
                        <EventLog events={args.lobby.events}/>
                    </div>
                </div>

                <div class="column is-4">
                    <div className="box">

                        <div>
                            <p className="title">Players</p>
                        </div>
                        <PlayerList currentPlayer={args.currentPlayer} players={args.lobby.playersInLobby}
                                    requestMatch={args.actions.requestMatch}/>
                    </div>
                </div>

            </div>
        </div>
    </div>
);

function buildLobbyUrl(id: string): string {
    return window.location.host + "?lobby=" + id;
}