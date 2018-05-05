import { app, h } from "hyperapp";
import { GameHub } from "@src/client/gameHub";
import { State } from "@src/client/states";
import { lobbyActions } from "@src/components/lobby/lobby.actions";
import { gameActions } from "@src/components/game/game.actions";
import {
    ChallengePlayerModel,
    ConnectedModel,
    FireShotModel,
    GameStateModel,
    LobbyEnteredModel,
    PlayerModel,
    ShotFeedbackModel,
    StartGameModel
} from "@src/client/models";
import { MainView } from "@src/components/mainView";
import 'bulma/css/bulma.css'
import './app.scss'
import { Navbar } from "@src/components/navbar/navbar";
import Swal from 'sweetalert2'

const gamehub = GameHub.getInstance();

const state = new State();

const actions = {
    lobby: lobbyActions,
    game: gameActions,
    onConnected: (model: ConnectedModel) => (state: State) => {
        state.player.playerId = model.playerId;
        return { player: state.player }
    },
    setPlayerName: (model: string) => (state: State) => {
        state.player.name = model;
        state.lobby.playerName = model;
        gamehub.setPlayerName(model);
        return { player: state.player, lobby: state.lobby }
    },
    onStartGame: (model: StartGameModel) => (state: State, actions: any) => {
        actions.game.startGame({ model: model, player: state.player });
    },
    onPlayerLeft: (model: PlayerModel) => (state: State, actions: any) => {
        actions.lobby.playerLeft(model);
        actions.game.playerLeft(model);
    }
};

const view = (state: State, actions: any) => (
    <div>
        <Navbar/>

        <MainView state={state} actions={actions}/>
    </div>
);

// compose hyperapp
const happ = app(state, actions, view, document.getElementById("app"));

window.addEventListener('load', () => {
    Swal({
        title: 'What is your nickname?',
        input: 'text',
        inputPlaceholder: 'Enter your nickname',
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputValidator: (value) => {
            return !value && 'You need to write something!'
        }
    }).then((result) => {
            // bind global events
            gamehub.start().then(function () {
                happ.setPlayerName(result.value);

                const params = new URLSearchParams(location.search.slice(1));
                const lobbyId = params.get("lobby");

                if (lobbyId) {
                    gamehub.enterLobby(lobbyId);
                } else {
                    gamehub.enterLobby("F93B7255-6B78-42B0-A16B-AB80B9F57DD5");
                }
            });
        }
    );
});


// bind global events
// gamehub.start().then(function () {
//     gamehub.setPlayerName(state.player.name);
//
//     const params = new URLSearchParams(location.search.slice(1));
//     const lobbyId = params.get("lobby");
//
//     if (lobbyId) {
//         gamehub.enterLobby(lobbyId);
//     } else {
//         gamehub.enterLobby("F93B7255-6B78-42B0-A16B-AB80B9F57DD5");
//     }
// });

gamehub.on(GameHub.Commands.Connected, function (model: ConnectedModel) {
    happ.onConnected(model);
});

gamehub.on(GameHub.Commands.LobbyEntered, function (model: LobbyEnteredModel) {
    happ.lobby.lobbyEntered(model);
});

gamehub.on(GameHub.Commands.PlayerJoined, function (model: PlayerModel) {
    happ.lobby.playerJoined(model);
});

gamehub.on(GameHub.Commands.PlayerLeft, function (model: PlayerModel) {
    happ.onPlayerLeft(model);
});

gamehub.on(GameHub.Commands.ChallengeRequest, function (model: ChallengePlayerModel) {
    happ.lobby.challengeRequest(model);
});

gamehub.on(GameHub.Commands.StartGame, function (model: StartGameModel) {
    happ.onStartGame(model);
});

gamehub.on(GameHub.Commands.PlayerChanged, function (model: PlayerModel) {
    happ.lobby.playerChanged(model);
});

gamehub.on(GameHub.Commands.ShotFired, function (model: FireShotModel) {
    happ.game.shotFired(model);
});

gamehub.on(GameHub.Commands.ShotFeedback, function (model: ShotFeedbackModel) {
    happ.game.onShotFeedback(model);
});

gamehub.on(GameHub.Commands.GameState, function (model: GameStateModel) {
    happ.game.onGameState(model);
});
