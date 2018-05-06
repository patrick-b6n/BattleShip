import * as signalr from "@aspnet/signalr";
import {
    AcceptChallengeModel,
    ChallengePlayerModel,
    EnterLobbyModel,
    FireShotModel,
    GameStateModel,
    PlayerModel,
    Shot,
    ShotFeedback,
    ShotFeedbackModel,
    UpdatePlayerModel
} from "@src/client/models";

export class GameHub {
    private static instance: GameHub;
    private connection: signalr.HubConnection;

    public static DefaultLobbyId = "F93B7255-6B78-42B0-A16B-AB80B9F57DD5";

    public static Commands = {
        AcceptChallenge: "AcceptChallenge",
        ChallengePlayer: "ChallengePlayer",
        ChallengeRequest: "ChallengeRequest",
        Connected: "Connected",
        CreateLobby: "CreateLobby",
        EnterLobby: "EnterLobby",
        FireShot: "FireShot",
        GameState: "GameState",
        LeaveGame: "LeaveGame",
        LobbyEntered: "LobbyEntered",
        PlayerChanged: "PlayerChanged",
        PlayerJoined: "PlayerJoined",
        PlayerLeft: "PlayerLeft",
        ShotFired: "ShotFired",
        ShotFeedback: "ShotFeedback",
        StartGame: "StartGame",
        UpdatePlayer: "UpdatePlayer"
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
        const model: UpdatePlayerModel = {
            name: name
        };

        this.connection.send(GameHub.Commands.UpdatePlayer, model);
    }

    public enterLobby(id: string) {
        const model: EnterLobbyModel = {
            lobbyId: id
        };

        this.connection.send(GameHub.Commands.EnterLobby, model);
    }

    public challengePlayer(player: PlayerModel): any {
        const model: ChallengePlayerModel = {
            playerId: player.playerId
        };
        this.connection.send(GameHub.Commands.ChallengePlayer, model);
    }

    public acceptChallenge(playerId: string): any {
        const model: AcceptChallengeModel = {
            playerId: playerId
        };
        this.connection.send(GameHub.Commands.AcceptChallenge, model);
    }

    public fireShot(shot: Shot): any {
        const model: FireShotModel = {
            x: shot.x,
            y: shot.y,
        };

        this.connection.send(GameHub.Commands.FireShot, model);
    }

    public shotFeedback(feedback: ShotFeedback): any {
        const model: ShotFeedbackModel = {
            x: feedback.x,
            y: feedback.y,
            remainingShipCount: feedback.remainingShipCount,
            result: feedback.result
        };
        this.connection.send(GameHub.Commands.ShotFeedback, model);
    }

    public start(): Promise<void> {
        return this.connection.start();
    }

    public gameState(model: GameStateModel) {
        this.connection.send(GameHub.Commands.GameState, model);
    }

    public leaveGame() {
        this.connection.send(GameHub.Commands.LeaveGame);
    }

    public on(name: string, args: (...args: any[]) => void) {
        this.connection.on(name, args);
    }
}
