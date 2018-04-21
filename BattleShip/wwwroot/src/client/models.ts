import { createTwoDimArray, generateName } from "./helper";

export class State {
    player: PlayerModel = { id: "", name: generateName() };
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
    isActive = false;
    opponent: PlayerModel = null;
    playerBoard = createTwoDimArray(10, 10, BoardField.Free);
    opponentBoard = createTwoDimArray(10, 10, BoardField.Free);

    constructor() {
        this.playerBoard[5][1] = BoardField.Ship;
        this.playerBoard[6][2] = BoardField.ShipHit;
        this.playerBoard[7][3] = BoardField.Miss;
    }
}

export enum EventType {
    Message,
    Challenge
}

export enum BoardField {
    Free,
    Miss,
    Ship,
    ShipHit
}

export class EventEntry {
    type: EventType;
    message: string;
    data: any;

    constructor(message: string, type: EventType = EventType.Message, data: any = null) {
        this.message = message;
        this.type = type;
        this.data = data;
    }
}

export interface PlayerModel {
    id: string;
    name: string;
}

export interface EnterLobbyAnswerModel {
    id: string;
    players: PlayerModel[];
}

export interface ConnectedModel {
    id: string;
}

export interface ChallengePlayerModel {
    player: PlayerModel;
}

export interface StartGameModel {
    player: PlayerModel;
}

export interface GameModel {
    id: string,
    player1: PlayerModel,
    player2: PlayerModel,
    phase: string
}

export interface GameStartedModel {
    game: GameModel;
}
