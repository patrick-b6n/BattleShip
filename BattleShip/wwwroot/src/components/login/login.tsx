import { h } from "hyperapp";
import Swal from 'sweetalert2'
import { GameHub } from "@src/client/gameHub";
import { LoginCallups, LoginState } from "@src/client/states";
import Constants from "@src/constants";

const gamehub = GameHub.getInstance();

export const loginActions = {
    init: (callups: LoginCallups) => (state: LoginState, actions: any) => {
        actions.setCallups(callups)
    },
    setCallups: (callups: any) => () => {
        return callups
    },
    onCreate: () => (state: LoginState, actions: any) => {
        function start(name: string) {
            // bind global events
            gamehub.start().then(function () {
                localStorage.setItem(Constants.LS_PLAYER_NAME, name);

                state.setPlayerName(name);
                state.changeView(Constants.V_Lobby);

                const params = new URLSearchParams(location.search.slice(1));
                const lobbyId = params.get("lobby");

                if (lobbyId) {
                    gamehub.enterLobby(lobbyId);
                } else {
                    gamehub.enterLobby(GameHub.DefaultLobbyId);
                }
            });
        }

        if (localStorage.getItem(Constants.LS_PLAYER_NAME)) {
            start(localStorage.getItem(Constants.LS_PLAYER_NAME))
        }
        else {
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
                    start(result.value)
                }
            );
        }
    }
};

export const Login = (args: any) => (
    <div oncreate={() => args.actions.onCreate()}/>
);