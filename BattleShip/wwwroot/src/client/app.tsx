import { h, app } from "hyperapp";
import { State, Player, EnterLobbyAnswerModel, ConnectedModel, ChallengePlayerModel } from "./models";
import { SetNameComponent } from "./components/setNameComponent";
import { PlayerList } from "./components/playerlist";
import { makeid } from "./helper";
import { GameHub } from "./gameHub";

const gamehub = GameHub.getInstance();

const state = new State();
state.playerName = makeid();

const actions = {
    init: () => (state: State, actions: any) => {
        initGameHub(state, actions);
    },
    connected: (model: ConnectedModel) => () => {
        return {player: model.player}
    },
    sendPlayerName: () => (state: State) => {
        gamehub.setPlayerName(state.playerName);
    },
    playerNameInput: (value: string) => () => {
        return {playerName: value};
    },
    enterLobby: (value: EnterLobbyAnswerModel) => (state: State, actions: any) => {
        actions.addEvent(`Entered lobby ${value.id}`);
        return {lobbyId: value.id, playersInLobby: value.players};
    },
    onCreateLobby: () => () => {
        gamehub.enterLobby("00000000-0000-0000-0000-000000000000");
    },
    addEvent: (value: string) => (state: State) => {
        setTimeout(() => {
            const objDiv = document.getElementById("event-log");
            objDiv.scrollTop = objDiv.scrollHeight;
        }, 1);

        state.events.push(new Date().toLocaleTimeString() + " " + value);
        return {events: state.events};
    },
    playerJoined: (value: Player) => (state: State, actions: any) => {
        actions.addEvent(`Player ${value.name} joined the lobby`);

        state.playersInLobby.push(value);
        state.playersInLobby.sort((a, b) => a.name.localeCompare(b.name));
        return {playersInLobby: state.playersInLobby};
    },
    playerLeft: (value: Player) => (state: State, actions: any) => {
        actions.addEvent(`Player ${value.name} left the lobby`);

        const index = state.playersInLobby.findIndex((p: Player) => p.id === value.id);
        if (index > -1) {
            state.playersInLobby.splice(index, 1);
        }
        return {playersInLobby: state.playersInLobby};
    },
    challengePlayer: (player: Player) => (state: State, actions: any) => {
        actions.addEvent(`Challenged ${player.name}`);

        gamehub.challengePlayer(player);
    },
    challengeRequest: (model: ChallengePlayerModel) => (state: State, actions: any) => {
        actions.addEvent(`You got challenged by ${model.player.name}`);
    }
};

const view = (state: State, actions: any) => (
    <div oncreate={() => actions.init()}>
        <div style={{marginBottom: "1rem"}}>
            <SetNameComponent playerName={state.playerName} onPlayerNameInput={actions.playerNameInput} onSetPlayerNameClick={actions.sendPlayerName}/>
        </div>
        <div style={{marginBottom: "1rem"}}>
            <div>
                <span>Current lobby: </span> <span>{state.lobbyId}</span>
            </div>
            <div>
                <span>Share your lobby: </span>{" "}
                <a href={buildLobbyUrl(state.lobbyId)}>
                    {buildLobbyUrl(state.lobbyId)}
                </a>
            </div>
            <div>
                <button onclick={() => actions.onCreateLobby()}>
                    Create custom lobby
                </button>
            </div>
        </div>
        <div style={{marginBottom: "1rem"}}>
            <span>Spieler:</span>
            <div style={{border: "1px solid black", padding: "1rem"}}>
                <PlayerList player={state.player} players={state.playersInLobby} challengePlayer={actions.challengePlayer}/>
            </div>
        </div>
        <div>
            <span>Events:</span>
            <div id="event-log" style={{overflowY: "scroll", height: "200px", border: "1px solid black", padding: "1rem"}}>
                {state.events.map(e => <div>{e}</div>)}
            </div>
        </div>
    </div>
);

function buildLobbyUrl(id: string): string {
    return window.location.host + "?lobby=" + id;
}

function initGameHub(s: State, a: any) {
    gamehub.start().then(function () {
        gamehub.setPlayerName(state.playerName);

        const params = new URLSearchParams(location.search.slice(1));
        const lobbyId = params.get("lobby");

        if (lobbyId) {
            gamehub.enterLobby(lobbyId);
        } else {
            gamehub.enterLobby("F93B7255-6B78-42B0-A16B-AB80B9F57DD5");
        }
    });

    gamehub.on(GameHub.Commands.EnterLobby, function (message: EnterLobbyAnswerModel) {
        a.enterLobby(message);
    });

    gamehub.on(GameHub.Commands.PlayerJoined, function (player: Player) {
        a.playerJoined(player);
    });

    gamehub.on(GameHub.Commands.PlayerLeft, function (player: Player) {
        a.playerLeft(player);
    });

    gamehub.on(GameHub.Commands.Connected, function (model: ConnectedModel) {
        a.connected(model);
    });

    gamehub.on(GameHub.Commands.ChallengeRequest, function (model: ChallengePlayerModel) {
        a.challengeRequest(model);
    });
}

app(state, actions, view, document.getElementById("app"));
