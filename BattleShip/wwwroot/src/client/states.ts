import { createTwoDimArray } from "@src/client/helper";
import { BoardField, PlayerModel } from "@src/client/models";
import Constants from "@src/constants";

export class State {
    view: String = Constants.V_Login;

    game: GameState = new GameState();
    lobby: LobbyState = new LobbyState();
    login: LoginState = new LoginState();

    player: PlayerModel = { id: "", name: "..." };
}

export interface LoginCallups {
    setPlayerName: (name: string) => any;
    changeView: (view: string) => any;
}

export class LoginState implements LoginCallups {
    setPlayerName: (name: string) => any;
    changeView: (view: string) => any;
}

export interface LobbyCallups {
    setPlayerName: (name: string) => any;
}

export class LobbyState implements LobbyCallups {
    lobbyId = "";
    playerName = "...";
    playersInLobby: PlayerModel[] = [];
    events: any[] = [];
    setPlayerName: (name: string) => any;
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