import { h } from "hyperapp";
import {
    ChallengePlayerModel,
    EnterLobbyAnswerModel,
    EventEntry,
    EventType,
    LobbyState,
    PlayerModel,
    State
} from "../models";
import { EventLog } from "./eventlog";
import { PlayerList } from "./playerlist";
import { GameHub } from "../gameHub";

const gamehub = GameHub.getInstance();

export interface LobbyArgs {
    player: PlayerModel;
    lobby: LobbyState;
    actions: any;
    onPlayerNameChanged: any;
}

export const lobbyActions = {
    init: (args: LobbyArgs) => () => {
        return { playerNameInput: args.player.name }
    },
    addEvent: (value: EventEntry) => (state: LobbyState) => {
        setTimeout(() => {
            const objDiv = document.getElementById("event-log");
            objDiv.scrollTop = objDiv.scrollHeight;
        }, 1);

        state.events.push(value);
        return { events: state.events };
    },
    playerJoined:
        (value: PlayerModel) => (state: LobbyState, actions: any) => {
            actions.addEvent(new EventEntry(`Player ${value.name} joined the lobby`));

            state.playersInLobby.push(value);
            state.playersInLobby.sort((a, b) => a.name.localeCompare(b.name));
            return { playersInLobby: state.playersInLobby };
        },
    playerLeft:
        (value: PlayerModel) => (state: LobbyState, actions: any) => {
            actions.addEvent(new EventEntry(`Player ${value.name} left the lobby`));

            const index = state.playersInLobby.findIndex((p: PlayerModel) => p.id === value.id);
            if (index > -1) {
                state.playersInLobby.splice(index, 1);
            }

            return { playersInLobby: state.playersInLobby };
        },
    playerChanged:
        (value: PlayerModel) => (state: LobbyState) => {
            const index = state.playersInLobby.findIndex((p: PlayerModel) => p.id === value.id);
            state.playersInLobby[index] = value;

            return { playersInLobby: state.playersInLobby };
        },
    onPlayerNameInput:
        (value: string) => () => {
            return { playerNameInput: value };
        },
    sendPlayerName:
        (model: any) => (state: LobbyState) => {
            gamehub.setPlayerName(state.playerNameInput);

            model.callback()
        },
    enterLobby:
        (value: EnterLobbyAnswerModel) => (state: State, actions: any) => {
            actions.addEvent(new EventEntry(`Entered lobby ${value.id}`));
            return { lobbyId: value.id, playersInLobby: value.players };
        },
    challengePlayer:
        (player: PlayerModel) => (state: State, actions: any) => {
            actions.addEvent(new EventEntry(`Challenged ${player.name}`));

            gamehub.challengePlayer(player);
        },
    challengeRequest:
        (model: ChallengePlayerModel) => (state: State, actions: any) => {
            const event = new EventEntry(
                `You got challenged by ${model.player.name}`, EventType.Challenge,
                { accept: () => gamehub.startGame(model.player) });
            actions.addEvent(event);
        },
    createLobby: () => () => {
        gamehub.enterLobby("00000000-0000-0000-0000-000000000000");
    }
};

export const LobbyScreen = (args: LobbyArgs) => (
    <div oncreate={() => args.actions.init(args)}>
        <div style={{ marginBottom: "1rem" }}>
            <span>Hello</span>
            <input
                type="text"
                value={args.lobby.playerNameInput}
                oninput={(e: Event) => args.actions.onPlayerNameInput((e.target as HTMLInputElement).value)}
            />
            <button onclick={() => args.actions.sendPlayerName({ callback: args.onPlayerNameChanged })}>Set
            </button>
        </div>
        <div style={{ marginBottom: "1rem" }}>
            <div>
                <span> Current lobby: </span> <span>{args.lobby.lobbyId}</span>
            </div>
            <div>
                <span>Share your lobby: </span>{" "} <a
                href={buildLobbyUrl(args.lobby.lobbyId)}> {buildLobbyUrl(args.lobby.lobbyId)} </a>
            </div>
            <div>
                <button onClick={() => args.actions.createLobby()}>
                    Create custom lobby
                </button>
            </div>
        </div>
        <div style={{ marginBottom: "1rem" }}>
            <span>Spieler:</span>
            <PlayerList player={args.player} players={args.lobby.playersInLobby}
                        challengePlayer={args.actions.challengePlayer}/>
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