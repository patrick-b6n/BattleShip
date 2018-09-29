import { PlayerModel, RequestMatchModel } from "@src/client/communicationModels";

export enum EventType {
    Message,
    Challenge
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

export interface LobbyCallups {
    setPlayerName: (name: string) => any;
    onAcceptRequestMatch: (model: RequestMatchModel) => any;
}

export class LobbyState implements LobbyCallups {
    lobbyId = "";
    playerName = "...";
    playersInLobby: PlayerModel[] = [];
    events: any[] = [];
    setPlayerName: (name: string) => any;
    onAcceptRequestMatch: (model: RequestMatchModel) => any;
    isMatchRequestActive: boolean = false;
}