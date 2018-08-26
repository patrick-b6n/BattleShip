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

export interface FireShotModel {
    x: number;
    y: number;
    to: PlayerModel;
}

export interface FireShotResponseModel {
    x: number;
    y: number;
    to: PlayerModel;
    isSunk: boolean;
    isHit: boolean;
    remainingShips: Array<IShip>;
}

export interface IShip {
    length: number;
    isSunk: boolean;
}