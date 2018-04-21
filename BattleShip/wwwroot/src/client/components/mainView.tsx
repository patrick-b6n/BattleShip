import { h } from "hyperapp";
import { State } from "../models";
import { GameScreen } from "./game";
import { LobbyScreen } from "./lobby";

interface CurrentViewArgs {
    state: State;
    actions: any
}

export const MainView = (args: CurrentViewArgs) => {
    if (args.state.game.isActive === false) {
        return <LobbyScreen player={args.state.player}
                            lobby={args.state.lobby}
                            actions={args.actions.lobby}
                            onPlayerNameChanged={args.actions.onPlayerNameChanged}/>
    }
    else {
        return <GameScreen actions={args.actions} state={args.state.game} player={args.state.player}/>
    }
};