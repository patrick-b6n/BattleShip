export class State {
    player: Player;
    playerName = "";
    lobbyId = "";
    playersInLobby: Player[] = [];
    events: String[] = [];
}

export interface Player {
    id: string;
    name: string;
}

export interface EnterLobbyAnswerModel {
    id: string;
    players: Player[];
}

export interface ConnectedModel {
    player: Player;
}

export interface ChallengePlayerModel {
    player: Player;
}
