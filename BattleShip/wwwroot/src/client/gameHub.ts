import * as signalr from "@aspnet/signalr";
import { ChallengePlayerModel, Player } from "./models";

export class GameHub {

    private static instance: GameHub;
    private connection: signalr.HubConnection;

    public static Commands = {
        Connected: "Connected",
        SetPlayerName: "SetPlayerName",
        EnterLobby: "EnterLobby",
        CreateLobby: "CreateLobby",
        PlayerJoined: "PlayerJoined",
        PlayerLeft: "PlayerLeft",
        ChallengePlayer: "challengePlayer",
        ChallengeRequest: "challengeRequest"
    };

    private constructor() {
        this.connection = new signalr.HubConnection("/hubs/game");
    }

    static getInstance() {
        if (!GameHub.instance) {
            GameHub.instance = new GameHub();
        }
        return GameHub.instance;
    }

    public setPlayerName(name: string) {
        this.connection.send(GameHub.Commands.SetPlayerName, {
            name: name
        });
    }

    public enterLobby(id: string) {
        this.connection.send(GameHub.Commands.EnterLobby, {
            id: id
        });
    }

    public challengePlayer(player: Player): any {
        const model: ChallengePlayerModel = {
            player: player
        };
        this.connection.send(GameHub.Commands.ChallengePlayer, model);
    }

    public start(): Promise<void> {
        return this.connection.start();
    }

    public on(name: string, args: (...args: any[]) => void) {
        this.connection.on(name, args);
    }
}
