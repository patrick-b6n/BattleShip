export class State {
    playerName = "";
    lobbyId = "";
    playersInLobby = new Array<Player>();
}

export class Player {
    id: string;
    name: string;
}
