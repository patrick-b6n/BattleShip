import { ChallengePlayerModel, EventEntry, EventType, LobbyEnteredModel, PlayerModel } from "../models";
import { LobbyArgs } from "./lobby";
import { GameHub } from "../gameHub";
import { LobbyState } from "../states";

const gamehub = GameHub.getInstance();

export const lobbyActions = {
    init: (args: LobbyArgs) => () => {
        return { playerNameInput: args.player.name }
    },
    addEvent: (value: EventEntry) => (state: LobbyState) => {
        setTimeout(() => {
            const objDiv = document.getElementById("event-log");
            if (objDiv) {
                objDiv.scrollTop = objDiv.scrollHeight;
            }
        }, 1);

        state.events.push(value);
        return { events: state.events };
    },
    playerJoined:
        (value: PlayerModel) => (state: LobbyState, actions: any) => {
            actions.addEvent(new EventEntry(`Player ${value.name} joined the lobby`));

            state.playersInLobby.push(value);
            state.playersInLobby.sort((a, b) => a.name.localeCompare(b.name));
            return { playersInLobby: state.playersInLobby };
        },
    playerLeft:
        (value: PlayerModel) => (state: LobbyState, actions: any) => {
            actions.addEvent(new EventEntry(`Player ${value.name} left the lobby`));

            const index = state.playersInLobby.findIndex((p: PlayerModel) => p.playerId === value.playerId);
            if (index > -1) {
                state.playersInLobby.splice(index, 1);
            }

            return { playersInLobby: state.playersInLobby };
        },
    playerChanged:
        (value: PlayerModel) => (state: LobbyState) => {
            const index = state.playersInLobby.findIndex((p: PlayerModel) => p.playerId === value.playerId);
            state.playersInLobby[index] = value;

            return { playersInLobby: state.playersInLobby };
        },
    onPlayerNameInput:
        (value: string) => () => {
            return { playerNameInput: value };
        },
    sendPlayerName:
        (model: any) => (state: LobbyState) => {
            gamehub.setPlayerName(state.playerNameInput);

            model.callback()
        },
    lobbyEntered:
        (value: LobbyEnteredModel) => (state: LobbyState, actions: any) => {
            actions.addEvent(new EventEntry(`Lobby ${value.lobbyId} entered`));
            return { lobbyId: value.lobbyId, playersInLobby: value.players };
        },
    challengePlayer:
        (player: PlayerModel) => (state: LobbyState, actions: any) => {
            actions.addEvent(new EventEntry(`Challenged ${player.name}`));

            gamehub.challengePlayer(player);
        },
    challengeRequest:
        (model: ChallengePlayerModel) => (state: LobbyState, actions: any) => {
            const opponent = state.playersInLobby.find(p => p.playerId == model.playerId);
            if (opponent) {
                const event = new EventEntry(
                    `You got challenged by ${opponent.name}`,
                    EventType.Challenge,
                    { accept: () => gamehub.acceptChallenge(opponent.playerId) });
                actions.addEvent(event);
            }

        },
    createLobby: () => () => {
        gamehub.enterLobby("00000000-0000-0000-0000-000000000000");
    }
};