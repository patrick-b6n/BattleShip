import { ActionsType, app, h } from "hyperapp";
import { GameHub } from "@src/client/gameHub";
import { State } from "@src/client/states";
import { lobbyActions } from "@src/components/lobby/lobby.actions";
import { gameActions } from "@src/components/game/game.actions";
import { ViewSwitcher } from "@src/components/mainView";
import 'bulma/css/bulma.css'
import './app.scss'
import { Navbar } from "@src/components/navbar/navbar";
import { loginActions } from "@src/components/login/login";
import { ConnectedModel, LobbyJoinedModel, PlayerModel, RequestMatchModel } from "@src/client/models";
import Constants from "@src/constants";

const gamehub = GameHub.getInstance();

const state = new State();

const actions = {
    lobby: lobbyActions,
    game: gameActions,
    login: loginActions,
    init: () => (state: State, actions: any) => {
        actions.login.init({
            setPlayerName: actions.setPlayerName,
            changeView: actions.onChangeView
        });
        actions.lobby.init({
            setPlayerName: actions.setPlayerName,
        })
    },
    setPlayerName: (model: string) => (state: State) => {
        state.currentPlayer.name = model;
        state.lobby.playerName = model;
        return { player: state.currentPlayer, lobby: state.lobby }
    },
    joinLobby: (lobbyId: string) => (state: State) => {
        const params = new URLSearchParams(location.search.slice(1));
        gamehub.joinLobby({ lobbyId: (params.get("lobby") || lobbyId) });
    },
    onConnected: (model: ConnectedModel) => (state: State, actions: any) => {
        state.currentPlayer = model.player;

        actions.joinLobby(model.defaultLobbyId);

        return { currentPlayer: state.currentPlayer }
    },
    onLobbyJoined: (model: LobbyJoinedModel) => (state: State, actions: any) => {
        actions.onChangeView(Constants.V_Lobby);
        actions.lobby.lobbyJoined(model)
    },
    onPlayerJoinedLobby: (model: PlayerModel) => (state: State, actions: any) => {
        actions.lobby.playerJoined(model)
    },
    onPlayerLeftLobby: (model: PlayerModel) => (state: State, actions: any) => {
        actions.lobby.playerLeft(model)
    },
    onChangeView: (view: string) => () => {
        return { view: view }
    },
    onMatchRequested: (model: RequestMatchModel) => (state: State, actions: any) => {
        actions.lobby.onMatchRequested(model)
    }
    // onStartGame: (model: StartGameModel) => (state: State, actions: any) => {
    //     actions.game.startGame({ model: model, player: state.player });
    // },
    // onPlayerLeft: (model: PlayerModel) => (state: State, actions: any) => {
    //     actions.lobby.playerLeft(model);
    //     actions.game.playerLeft(model);
    // }
};

const view = (state: State, actions: any) => (
    <div>
        <Navbar/>

        <ViewSwitcher state={state} actions={actions}/>
    </div>
);

// compose hyperapp
gamehub.start().then(() => {
        const happ = app(state, actions, view, document.getElementById("app"));
        happ.init();

        gamehub.on(GameHub.Commands.Connected, function (model: ConnectedModel) {
            happ.onConnected(model);
        });

        gamehub.on(GameHub.Commands.LobbyJoined, function (model: LobbyJoinedModel) {
            happ.onLobbyJoined(model)
        });

        gamehub.on(GameHub.Commands.PlayerJoinedLobby, function (model: PlayerModel) {
            happ.onPlayerJoinedLobby(model)
        });

        gamehub.on(GameHub.Commands.PlayerLeftLobby, function (model: PlayerModel) {
            happ.onPlayerLeftLobby(model)
        });

        gamehub.on(GameHub.Commands.RequestMatch, function (model: RequestMatchModel) {
            happ.onMatchRequested(model)
        });
    }
);

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
//

//
// gamehub.on(GameHub.Commands.LobbyEntered, function (model: LobbyEnteredModel) {
//     happ.lobby.lobbyEntered(model);
// });
//
// gamehub.on(GameHub.Commands.PlayerJoined, function (model: PlayerModel) {
//     happ.lobby.playerJoined(model);
// });
//
// gamehub.on(GameHub.Commands.PlayerLeft, function (model: PlayerModel) {
//     happ.onPlayerLeft(model);
// });
//
// gamehub.on(GameHub.Commands.ChallengeRequest, function (model: ChallengePlayerModel) {
//     happ.lobby.challengeRequest(model);
// });
//
// gamehub.on(GameHub.Commands.StartGame, function (model: StartGameModel) {
//     happ.onStartGame(model);
// });
//
// gamehub.on(GameHub.Commands.PlayerChanged, function (model: PlayerModel) {
//     happ.lobby.playerChanged(model);
// });
//
// gamehub.on(GameHub.Commands.ShotFired, function (model: FireShotModel) {
//     happ.game.shotFired(model);
// });
//
// gamehub.on(GameHub.Commands.ShotFeedback, function (model: ShotFeedbackModel) {
//     happ.game.onShotFeedback(model);
// });
//
// gamehub.on(GameHub.Commands.GameState, function (model: GameStateModel) {
//     happ.game.onGameState(model);
// });
