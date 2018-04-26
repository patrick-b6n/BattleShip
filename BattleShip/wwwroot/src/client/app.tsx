import { app, h } from "hyperapp";
import {
    ChallengePlayerModel,
    ConnectedModel,
    EnterLobbyAnswerModel,
    GameStartedModel,
    PlayerModel,
    ShotModel,
    State
} from "./models";
import { GameHub } from "./gameHub";
import { lobbyActions } from "./components/lobby";
import { MainView } from "./components/mainView";
import { gameActions } from "./components/game";

const gamehub = GameHub.getInstance();

const state = new State();

const actions = {
    lobby: lobbyActions,
    game: gameActions,
    onConnected: (model: ConnectedModel) => (state: State) => {
        state.player.id = model.id;
        return { player: state.player }
    },
    onPlayerNameChanged: (model: string) => (state: State) => {
        state.player.name = model;
        return { player: state.player }
    },
    onGameStarted: (model: GameStartedModel) => (state: State, actions: any) => {
        actions.game.gameStarted({ player: state.player, model: model });
    }
};

const view = (state: State, actions: any) => (
    <div>
        <MainView state={state} actions={actions}/>
    </div>
);

// compose hyperapp
const happ = app(state, actions, view, document.getElementById("app"));

// bind global events
gamehub.start().then(function () {
    gamehub.setPlayerName(state.player.name);

    const params = new URLSearchParams(location.search.slice(1));
    const lobbyId = params.get("lobby");

    if (lobbyId) {
        gamehub.enterLobby(lobbyId);
    } else {
        gamehub.enterLobby("F93B7255-6B78-42B0-A16B-AB80B9F57DD5");
    }
});

gamehub.on(GameHub.Commands.Connected, function (model: ConnectedModel) {
    happ.onConnected(model);
});

gamehub.on(GameHub.Commands.EnterLobby, function (message: EnterLobbyAnswerModel) {
    happ.lobby.enterLobby(message);
});

gamehub.on(GameHub.Commands.PlayerJoined, function (player: PlayerModel) {
    happ.lobby.playerJoined(player);
});

gamehub.on(GameHub.Commands.PlayerLeft, function (player: PlayerModel) {
    happ.lobby.playerLeft(player);
});

gamehub.on(GameHub.Commands.ChallengeRequest, function (model: ChallengePlayerModel) {
    happ.lobby.challengeRequest(model);
});

gamehub.on(GameHub.Commands.GameStarted, function (model: GameStartedModel) {
    happ.onGameStarted(model);
});

gamehub.on(GameHub.Commands.PlayerChanged, function (model: PlayerModel) {
    happ.lobby.playerChanged(model);
});

gamehub.on(GameHub.Commands.ShotFired, function (model: ShotModel) {
    happ.game.shotFired(model);
});

gamehub.on(GameHub.Commands.ShotResult, function (model: ShotModel) {
    happ.game.onShotResult(model);
});
