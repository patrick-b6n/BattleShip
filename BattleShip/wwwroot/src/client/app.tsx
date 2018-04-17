import { h, app } from "hyperapp";
import { State, Player } from "./models";
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
    onSetPlayerName: (value: string) => (state: State, actions: any) => {
        gamehub.setPlayerName(state.playerName);
    },
    playerNameInput: (value: string) => (state: State, actions: any) => {
        return { playerName: value };
    },
    setLobbyId: (value: string) => (state: State, actions: any) => {
        return { lobbyId: value };
    },
    setPlayers: (value: Player[]) => (state: State, actions: any) => {
        return { playersInLobby: value };
    },
    onCreateLobby: () => (state: State, actions: any) => {
        gamehub.enterLobby("00000000-0000-0000-0000-000000000000");
    }
};

const view = (state: State, actions: any) => (
    <div oncreate={() => actions.init()}>
        <div
            style={{
                paddingBottom: "1rem"
            }}
        >
            <SetNameComponent
                playerName={state.playerName}
                onPlayerNameInput={actions.playerNameInput}
                onSetPlayerNameClick={actions.onSetPlayerName}
            />
        </div>
        <div
            style={{
                paddingBottom: "1rem"
            }}
        >
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
        <div>
            <span>Spieler:</span>
            <PlayerList players={state.playersInLobby} />
        </div>
    </div>
);

function buildLobbyUrl(id: string): string {
    return window.location.host + "?lobby=" + id;
}

function initGameHub(s: State, a: any) {
    gamehub.start().then(function() {
        gamehub.setPlayerName(state.playerName);

        const params = new URLSearchParams(location.search.slice(1));
        const lobbyId = params.get("lobby");

        if (lobbyId) {
            gamehub.enterLobby(lobbyId);
        } else {
            gamehub.enterLobby("F93B7255-6B78-42B0-A16B-AB80B9F57DD5");
        }
    });

    gamehub.on(GameHub.Commands.EnterLobby, function(message) {
        a.setLobbyId(message.id);
        a.setPlayers(message.players);
    });
}

app(state, actions, view, document.getElementById("app"));
