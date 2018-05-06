import { h } from "hyperapp";
import { State } from "@src/client/states";
import { LobbyScreen } from "@src/components/lobby/lobby";
import { GameScreen } from "@src/components/game/game";
import { Login } from "@src/components/login/login";
import Constants from "@src/constants";

interface CurrentViewArgs {
    state: State;
    actions: any
}

export const ViewSwitcher = (args: CurrentViewArgs) => {
    switch (args.state.view) {
        case Constants.V_Login:
            return <Login actions={args.actions.login} state={args.state.login}/>;
        case Constants.V_Lobby:
            return <LobbyScreen player={args.state.player} lobby={args.state.lobby} actions={args.actions.lobby}
                                onPlayerNameChanged={args.actions.onPlayerNameChanged}/>;
        case Constants.V_Game:
            return <GameScreen actions={args.actions.game} state={args.state.game} player={args.state.player}/>;
    }
};