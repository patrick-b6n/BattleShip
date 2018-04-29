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

export class Shot {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class ShotFeedback {
    readonly x: number;
    readonly y: number;
    readonly remainingShipCount: number;
    readonly result: BoardField;

    constructor(x: number, y: number, remainingShipCount: number, result: BoardField) {
        this.x = x;
        this.y = y;
        this.remainingShipCount = remainingShipCount;
        this.result = result;
    }
}

export class EventEntry {
    date: Date;
    type: EventType;
    message: string;
    data: any | null;

    constructor(message: string, type: EventType = EventType.Message, data: any = null) {
        this.date = new Date();
        this.type = type;
        this.message = message;
        this.data = data;
    }
}

export interface ConnectedModel {
    playerId: string;
}

export interface EnterLobbyModel {
    lobbyId: string;
}

export interface LobbyEnteredModel {
    lobbyId: string;
    players: PlayerModel[];
}

export interface PlayerModel {
    playerId: string;
    name: string;
}

export interface ChallengePlayerModel {
    playerId: string;
}

export interface AcceptChallengeModel {
    playerId: string;
}

export interface StartGameModel {
    game: GameModel;
    firstTurn: boolean
}

export interface GameModel {
    gameId: string;
    player1: PlayerModel;
    player2: PlayerModel;
}

export interface GameStateModel {
    gameId: string,
    currentPlayerId: string,
    winnerPlayerId: string | null,
    disconnect: boolean
}

export interface UpdatePlayerModel {
    name: string;
}

export interface FireShotModel {
    x: number;
    y: number;
}

export interface ShotFeedbackModel {
    x: number;
    y: number;
    result: BoardField;
    remainingShipCount: number;
}