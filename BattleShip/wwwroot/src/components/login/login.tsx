import { h } from "hyperapp";
import Swal from 'sweetalert2'
import { GameHub } from "@src/client/gameHub";
import Constants from "@src/constants";
import { LoginCallups, LoginState } from "@src/components/login/models";

const gamehub = GameHub.getInstance();

export const loginActions = {
    init: (callups: LoginCallups) => (state: LoginState, actions: any) => {
        actions.setCallups(callups)
    },
    setCallups: (callups: any) => () => {
        return callups
    },
    onCreate: () => (state: LoginState) => {
        async function start(name: string) {
            localStorage.setItem(Constants.LS_PLAYER_NAME, name);

            await gamehub.connect({ name: name });

            state.setPlayerName(name);
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
    <div oncreate={() => args.actions.onCreate()}>
        <section className="hero">
            <div className="hero-body mb-2">
                <div className="container has-text-centered">

                    <h1 className="title">
                        🚀 BattleShip 🚢
                    </h1>

                </div>
            </div>
        </section>
    </div>
);