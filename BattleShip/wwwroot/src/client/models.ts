export class State {
    player: PlayerModel = null;
    playerName = "";
    lobbyId = "";
    playersInLobby: PlayerModel[] = [];
    events: Event[] = [];
    game: GameModel = null;
}

export enum EventType {
    Message,
    Challenge
}

export class Event {
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
    player: PlayerModel;
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
