import { createTwoDimArray } from "@src/client/helper";
import { IShip, PlayerModel, RequestMatchModel } from "@src/client/communicationModels";
import Constants from "@src/constants";
import { Ship } from "@src/components/game/board/boardService";
import { BoardField } from "@src/components/game/models";

export class State {
    view: String = Constants.V_Login;

    game: GameState = new GameState();
    lobby: LobbyState = new LobbyState();
    login: LoginState = new LoginState();

    currentPlayer: PlayerModel = { id: "", name: "..." };
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
    onAcceptRequestMatch: (model: RequestMatchModel) => any;
}

export class LobbyState implements LobbyCallups {
    lobbyId = "";
    playerName = "...";
    playersInLobby: PlayerModel[] = [];
    events: any[] = [];
    setPlayerName: (name: string) => any;
    onAcceptRequestMatch: (model: RequestMatchModel) => any;
    isMatchRequestActive: boolean = false;
}

export interface GameCallups {
}

export class GameState implements GameCallups {
    gameId: string | null = null;
    isMyTurn = false;
    isOver = false;
    opponent: PlayerModel | null = null;
    playerBoard = createTwoDimArray(10, 10, BoardField.Free);
    ships: Array<Ship> = [];
    opponentBoard = createTwoDimArray(10, 10, BoardField.Free);
    opponentShips: Array<IShip> = [];
}