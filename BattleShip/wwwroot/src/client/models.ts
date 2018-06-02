export enum BoardField {
    Free,
    Miss,
    Ship,
    ShipHit
}

export enum EventType {
    Message,
    Challenge
}

export interface ConnectedModel {
    player: PlayerModel;
    defaultLobbyId: string;
}

export interface JoinLobbyModel {
    lobbyId: string;
}

export interface LobbyJoinedModel {
    lobbyId: string;
    players: PlayerModel[];
}

export interface PlayerModel {
    id: string;
    name: string;
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