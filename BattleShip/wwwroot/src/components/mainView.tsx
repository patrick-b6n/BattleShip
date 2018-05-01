import { h } from "hyperapp";
import { State } from "@src/client/states";
import { LobbyScreen } from "@src/components/lobby/lobby";
import { GameScreen } from "@src/components/game/game";

interface CurrentViewArgs {
    state: State;
    actions: any
}

export const MainView = (args: CurrentViewArgs) => {
    if (null === args.state.game.gameId) {
        return <LobbyScreen player={args.state.player} lobby={args.state.lobby} actions={args.actions.lobby}
                            onPlayerNameChanged={args.actions.onPlayerNameChanged}/>
    }
    else {
        return <GameScreen actions={args.actions.game} state={args.state.game} player={args.state.player}/>
    }
};