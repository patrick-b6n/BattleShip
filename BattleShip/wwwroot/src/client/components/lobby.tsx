import { h } from "hyperapp";
import { EventLog } from "./eventlog";
import { PlayerList } from "./playerlist";
import { PlayerModel } from "../models";
import { LobbyState } from "../states";

export interface LobbyArgs {
    player: PlayerModel;
    lobby: LobbyState;
    actions: any;
    onPlayerNameChanged: any;
}

export const LobbyScreen = (args: LobbyArgs) => (
    <div oncreate={() => args.actions.init(args)}>
        <div style={{ marginBottom: "1rem" }}>
            <span>Hello</span>
            <input type="text" value={args.lobby.playerNameInput}
                   oninput={(e: Event) => args.actions.onPlayerNameInput((e.target as HTMLInputElement).value)}/>
            <button onclick={() => args.actions.sendPlayerName({ callback: args.onPlayerNameChanged })}>Set
            </button>
        </div>
        <div style={{ marginBottom: "1rem" }}>
            <div>
                <span> Current lobby: </span> <span>{args.lobby.lobbyId}</span>
            </div>
            <div>
                <span>Share your lobby: </span>{" "} <a href={buildLobbyUrl(args.lobby.lobbyId)}> {buildLobbyUrl(args.lobby.lobbyId)} </a>
            </div>
            <div>
                <button onClick={() => args.actions.createLobby()}>
                    Create custom lobby
                </button>
            </div>
        </div>
        <div style={{ marginBottom: "1rem" }}>
            <span>Spieler:</span>
            <PlayerList player={args.player} players={args.lobby.playersInLobby} challengePlayer={args.actions.challengePlayer}/>
        </div>
        <div>
            <span>Events:</span>
            <EventLog events={args.lobby.events}/>
        </div>
    </div>
);

function buildLobbyUrl(id: string): string {
    return window.location.host + "?lobby=" + id;
}

// export interface LobbyActions {
//     addEvent: (value: Event) => (state: LobbyState) => any;
//     playerJoined: (value: PlayerModel) => (state: LobbyState, actions: any) => any;
//     playerLeft: (value: PlayerModel) => (state: LobbyState, actions: any) => any;
//     connected: (model: ConnectedModel) => () => any;
//     playerNameInput: (value: string) => () => any;
//     enterLobby: (value: EnterLobbyAnswerModel) => (state: State, actions: any) => any;
// }