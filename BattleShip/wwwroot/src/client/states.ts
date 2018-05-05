import { createTwoDimArray } from "@src/client/helper";
import { BoardField, EventEntry, PlayerModel } from "@src/client/models";

export class State {
    view: String = "login";

    game: GameState = new GameState();
    lobby: LobbyState = new LobbyState();
    login: LoginState = new LoginState();

    player: PlayerModel = { playerId: "", name: "..." };
}

export interface LoginCallups {
    setPlayerName: (name: string) => any;
    changeView: (view: string) => any;
}

export class LoginState implements LoginCallups {
    setPlayerName: (name: string) => any;
    changeView: (view: string) => any;
}

export class LobbyState {
    lobbyId = "";
    playerName = "...";
    playersInLobby: PlayerModel[] = [];
    events: EventEntry[] = [];
}

export class GameState {
    gameId: string | null = null;
    isMyTurn = false;
    isOver = false;
    opponent: PlayerModel | null = null;
    playerBoard = createTwoDimArray(10, 10, BoardField.Free);
    opponentBoard = createTwoDimArray(10, 10, BoardField.Free);

    // constructor() {
    //     this.gameId = "asd"
    //     this.opponent = { playerId: "", name: "" }
    // }
}