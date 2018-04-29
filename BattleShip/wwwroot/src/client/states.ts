import { createTwoDimArray, generateName } from "./helper";
import { BoardField, EventEntry, PlayerModel } from "./models";

export class State {
    player: PlayerModel = { playerId: "", name: generateName() };
    lobby: LobbyState = new LobbyState();
    game: GameState = new GameState();
}

export class LobbyState {
    playerNameInput = "";
    lobbyId = "";
    playersInLobby: PlayerModel[] = [];
    events: EventEntry[] = [];
}

export class GameState {
    gameId: string | null = null;
    isMyTurn = false;
    opponent: PlayerModel | null = null;
    playerBoard = createTwoDimArray(10, 10, BoardField.Free);
    opponentBoard = createTwoDimArray(10, 10, BoardField.Free);
}