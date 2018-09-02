import { app, h } from "hyperapp";
import { State } from "@src/client/states";
import { Board } from "@src/components/game/board/board";
import { gameActions } from "@src/components/game/game.actions";
import { BoardService } from "@src/components/game/board/boardService";
import { GameScreen } from "@src/components/game/game";

const boardService = new BoardService();

const state = new State();

const { ships, board } = boardService.generateBoard();
state.game.ships = ships;
state.game.playerBoard = board;
state.game.opponent = { id: "", name: "..." };

const actions = {
    game: gameActions,
    noop: () => () => {
    }
};

const view = (state: State, actions: any) => (
    <GameScreen actions={actions.game} state={state.game} player={state.currentPlayer}/>
);

const happ = app(state, actions, view, document.getElementById("app-dev"));
