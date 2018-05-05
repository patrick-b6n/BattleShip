import { h } from "hyperapp";
import Swal from 'sweetalert2'
import { GameHub } from "@src/client/gameHub";
import { LoginCallups, LoginState } from "@src/client/states";

const gamehub = GameHub.getInstance();


export const loginActions = {
    set: (callups: any) => () => {
        return callups
    },
    init: (callups: LoginCallups) => (state: LoginState, actions: any) => {
        actions.set(callups)
    },
    onCreate: () => (state: LoginState, actions: any) => {
        function start(name: string) {
            // bind global events
            gamehub.start().then(function () {
                localStorage.setItem("playerName", name);

                state.setPlayerName(name);
                state.changeView("lobby");

                const params = new URLSearchParams(location.search.slice(1));
                const lobbyId = params.get("lobby");

                if (lobbyId) {
                    gamehub.enterLobby(lobbyId);
                } else {
                    gamehub.enterLobby("F93B7255-6B78-42B0-A16B-AB80B9F57DD5");
                }
            });
        }

        if (localStorage.getItem("playerName")) {
            start(localStorage.getItem("playerName"))
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