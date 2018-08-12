import { app, h } from "hyperapp";
import { State } from "@src/client/states";
import { Board } from "@src/components/game/board/board";
import { gameActions } from "@src/components/game/game.actions";
import { BoardService } from "@src/components/game/board/boardService";

const boardService = new BoardService();

const state = new State();
state.game.playerBoard = boardService.generateBoard();

const actions = {
    game: gameActions,
    noop: () => () => {
    }
};

const view = (state: State, actions: any) => (
    <div id="game-screen">
        <Board board={state.game.playerBoard} onCellClick={actions.noop} isEnabled={true}/>
    </div>
);

const happ = app(state, actions, view, document.getElementById("app-dev"));
