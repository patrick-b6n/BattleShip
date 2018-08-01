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

export interface ConnectModel {
    name: string;
}

export interface ConnectedModel {
    player: PlayerModel;
    defaultLobbyId: string;
}

export interface JoinLobbyModel {
    lobbyId: string;
}

export interface LobbyJoinedModel {
    lobby: LobbyModel;
}

export interface PlayerModel {
    id: string;
    name: string;
}

export interface LobbyModel {
    id: string;
    players: PlayerModel[];
}

export interface RequestMatchModel {
    from: PlayerModel;
    to: PlayerModel;
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