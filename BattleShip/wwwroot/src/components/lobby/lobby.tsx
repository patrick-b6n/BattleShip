import { h } from "hyperapp";
import { PlayerModel } from "@src/client/models";
import { LobbyState } from "@src/client/states";
import { PlayerList } from "@src/components/lobby/playerlist/playerlist";
import { EventLog } from "@src/components/lobby/eventlog/eventlog";
import "./lobby.scss"

export interface LobbyArgs {
    currentPlayer: PlayerModel;
    lobby: LobbyState;
    actions: any;
    onPlayerNameChanged: any;
}

export const LobbyScreen = (args: LobbyArgs) => (
    <div id="lobby" oncreate={() => args.actions.init(args)}>

        <section className="hero is-primary">
            <div className="hero-body">
                <div className="container">
                    <div class="level">
                        <div class="level-item level-left is-narrow">
                            <h1 className="title">
                                Hello {args.lobby.playerName}!
                            </h1>
                        </div>
                        <div class="level-item level-left" style={{ paddingLeft: "1rem" }}>
                                <span className="icon" style={{ fontSize: "1rem", cursor: "pointer" }}
                                      onclick={() => args.actions.editName()}><i
                                    className="fas fa-edit"/></span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="container pt-3">

            <div className="tile">
                <div className="tile is-parent is-8 ">
                    <div className="tile is-child box">
                        <p className="title">Messages</p>
                        <EventLog events={args.lobby.events}/>
                    </div>
                </div>
                <div className="tile is-parent is-4">
                    <div className="tile is-child box">
                        <p className="title">Players</p>
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