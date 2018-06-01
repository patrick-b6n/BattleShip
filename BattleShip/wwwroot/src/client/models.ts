export enum BoardField {
    Free,
    Miss,
    Ship,
    ShipHit
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
}

export interface PlayerModel {
    id: string;
    name: string;
}