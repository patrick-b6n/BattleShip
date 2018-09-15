import { PlayerModel, RequestMatchModel } from "@src/client/communicationModels";
import Constants from "@src/constants";
import { GameState } from "@src/components/game/models";

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