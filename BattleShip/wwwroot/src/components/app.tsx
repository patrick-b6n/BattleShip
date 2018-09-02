import { app, h } from "hyperapp";
import { GameHub } from "@src/client/gameHub";
import { State } from "@src/client/states";
import { lobbyActions } from "@src/components/lobby/lobby.actions";
import { gameActions } from "@src/components/game/game.actions";
import { ViewSwitcher } from "@src/components/mainView";
import 'bulma/css/bulma.css'
import './app.scss'
import { Navbar } from "@src/components/navbar/navbar";
import { loginActions } from "@src/components/login/login";
import {
    ConnectedModel,
    FireShotModel,
    FireShotResponseModel,
    LobbyJoinedModel,
    PlayerModel,
    RequestMatchModel
} from "@src/client/communicationModels";
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
            onAcceptRequestMatch: actions.onAcceptRequestMatch,
        });
        actions.game.init({
            changeView: actions.onChangeView
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
        actions.lobby.lobbyJoined(model);

        // TODO Start Game
        // actions.onAcceptRequestMatch({ from: state.currentPlayer, to: state.currentPlayer });
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
    },
    onCancelMatchRequested: (model: RequestMatchModel) => (state: State, actions: any) => {
        actions.lobby.onCancelMatchRequested(model)
    },
    onDeclineRequestMatch: (model: RequestMatchModel) => (state: State, actions: any) => {
        actions.lobby.onDeclineRequestMatch(model)
    },
    onFireShot: (model: FireShotModel) => (state: State, actions: any) => {
        actions.game.onFireShot(model)
    },
    onFireShotResponse: (model: FireShotResponseModel) => (state: State, actions: any) => {
        actions.game.onFireShotResponse(model)
    },
    onAcceptRequestMatch: (model: RequestMatchModel) => (state: State, actions: any) => {
        actions.lobby.onAcceptRequestMatch();
        actions.onChangeView(Constants.V_Game);

        if (state.currentPlayer.id == model.to.id) {
            actions.game.onStartGame({ opponent: model.from, isFirstTurn: true });
        }
        else {
            actions.game.onStartGame({ opponent: model.to, isFirstTurn: false });
        }
    }
};

const view = (state: State, actions: any) => (
    <div>
        {/*<Navbar/>*/}

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

    gamehub.on(GameHub.Commands.CancelRequestMatch, function (model: RequestMatchModel) {
        happ.onCancelMatchRequested(model)
    });

    gamehub.on(GameHub.Commands.DeclineRequestMatch, function (model: RequestMatchModel) {
        happ.onDeclineRequestMatch(model)
    });

    gamehub.on(GameHub.Commands.AcceptRequestMatch, function (model: RequestMatchModel) {
        happ.onAcceptRequestMatch(model)
    });

    gamehub.on(GameHub.Commands.FireShot, function (model: FireShotModel) {
        happ.onFireShot(model)
    });

    gamehub.on(GameHub.Commands.FireShotResponse, function (model: FireShotResponseModel) {
        happ.onFireShotResponse(model)
    });
    }
);