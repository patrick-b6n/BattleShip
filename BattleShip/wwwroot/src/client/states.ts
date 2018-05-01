import { createTwoDimArray } from "@src/client/helper";
import { BoardField, EventEntry, PlayerModel } from "@src/client/models";

export class State {
    player: PlayerModel = { playerId: "", name: "..." };
    lobby: LobbyState = new LobbyState();
    game: GameState = new GameState();
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
    opponent: PlayerModel | null = null;
    playerBoard = createTwoDimArray(10, 10, BoardField.Free);
    opponentBoard = createTwoDimArray(10, 10, BoardField.Free);
}