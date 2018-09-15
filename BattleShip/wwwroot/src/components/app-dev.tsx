import { app, h } from "hyperapp";
import { State } from "@src/client/states";
import { BoardService } from "@src/components/game/board/boardService";
import { gameActions } from "@src/components/game/actions";
import { GameScreen } from "@src/components/game/gamescreen";

const boardService = new BoardService();

const state = new State();

const { ships, board } = boardService.generateBoard();
state.game.ships = ships;
state.game.playerBoard = board;
state.game.opponent = { id: "", name: "..." };
state.game.recentSunkShip = ships[0];

const actions = {
    game: gameActions,
    noop: () => () => {
    },
    clearRecentSunkShip: () => (state: State) => {
        state.game.recentSunkShip = null;
        return { game: state.game }
    }
};

const view = (state: State, actions: any) => (
    <div>
        <button onclick={actions.clearRecentSunkShip}>
            test
        </button>
        <GameScreen actions={actions.game} state={state.game} player={state.currentPlayer}/>
    </div>
);

const happ = app(state, actions, view, document.getElementById("app-dev"));
