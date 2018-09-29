import { PlayerModel } from "@src/client/communicationModels";
import Constants from "@src/constants";
import { GameState } from "@src/components/game/models";
import { LoginState } from "@src/components/login/models";
import { LobbyState } from "@src/components/lobby/models";

export class State {
    view: String = Constants.V_Login;

    game: GameState = new GameState();
    lobby: LobbyState = new LobbyState();
    login: LoginState = new LoginState();
        
    currentPlayer: PlayerModel = { id: "", name: "..." };
}