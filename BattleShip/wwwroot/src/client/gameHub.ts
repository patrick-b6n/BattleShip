import * as signalr from "@aspnet/signalr";
import { ConnectModel, JoinLobbyModel, RequestMatchModel } from "@src/client/models";

export class GameHub {
    private static instance: GameHub;
    private connection: signalr.HubConnection;

    public static DefaultLobbyId = "F93B7255-6B78-42B0-A16B-AB80B9F57DD5";

    public static Commands = {
        Connect: "Connect",
        JoinLobby: "JoinLobby",

        Connected: "Connected",
        LobbyJoined: "LobbyJoined",
        PlayerJoinedLobby: "PlayerJoinedLobby",
        PlayerLeftLobby: "PlayerLeftLobby",
        RequestMatch: "RequestMatch"
    };

    private constructor() {
        this.connection = new signalr.HubConnectionBuilder().withUrl("/hubs/game").build();
    }

    static getInstance() {
        if (!GameHub.instance) {
            GameHub.instance = new GameHub();
        }
        return GameHub.instance;
    }

    public on(name: string, args: (...args: any[]) => void) {
        this.connection.on(name, args);
    }

    public start(): Promise<void> {
        return this.connection.start()
    }

    public connect(model: ConnectModel): Promise<void> {
        return this.connection.send(GameHub.Commands.Connect, model)
    }

    public joinLobby(model: JoinLobbyModel): Promise<void> {
        return this.connection.send(GameHub.Commands.JoinLobby, model)
    }

    public requestMatch(model: RequestMatchModel): Promise<void> {
        return this.connection.send(GameHub.Commands.RequestMatch, model)
    }
}
