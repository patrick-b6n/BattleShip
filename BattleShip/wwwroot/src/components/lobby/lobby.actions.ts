import { GameHub } from "@src/client/gameHub";
import { LobbyCallups, LobbyState } from "@src/client/states";
import Swal from 'sweetalert2'
import Constants from "@src/constants";
import { LobbyJoinedModel, PlayerModel, RequestMatchModel } from "@src/client/communicationModels";
import { EventEntry } from "@src/components/lobby/eventlog/models";

const gamehub = GameHub.getInstance();
const matchRequestTimeout = 30 * 1000;

export interface RequestMatchDto {
    fromPlayer: PlayerModel;
    toPlayer: PlayerModel;
}

export const lobbyActions = {
    init: (callups: LobbyCallups) => (state: LobbyState, actions: any) => {
        actions.setCallups(callups)
    },
    setCallups: (callups: any) => () => {
        return callups
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
    playerChanged:
        (value: PlayerModel) => (state: LobbyState) => {
            const index = state.playersInLobby.findIndex((p: PlayerModel) => p.id === value.id);
            state.playersInLobby[index] = value;

            return { playersInLobby: state.playersInLobby };
        },
    playerJoined:
        (value: PlayerModel) => (state: LobbyState, actions: any) => {
            actions.addEvent(new EventEntry(`${value.name} joined the lobby`));

            state.playersInLobby.push(value);
            state.playersInLobby.sort((a, b) => a.name.localeCompare(b.name));
            return { playersInLobby: state.playersInLobby };
        },
    playerLeft:
        (value: PlayerModel) => (state: LobbyState, actions: any) => {
            actions.addEvent(new EventEntry(`${value.name} left the lobby`));

            const index = state.playersInLobby.findIndex((p: PlayerModel) => p.id === value.id);
            if (index > -1) {
                state.playersInLobby.splice(index, 1);
            }

            return { playersInLobby: state.playersInLobby };
        },
    lobbyJoined: (model: LobbyJoinedModel) => (state: LobbyState, actions: any) => {
        actions.addEvent(new EventEntry(`You joined Lobby ${model.lobby.id}`));
        return { lobbyId: model.lobby.id, playersInLobby: model.lobby.players };
    },
    createLobby: () => () => {
        gamehub.joinLobby({ lobbyId: "00000000-0000-0000-0000-000000000000" });
    },
    setPlayerName: (value: string) => () => {
        return { playerName: value };
    },
    editName: () => (state: LobbyState) => {
        Swal({
            title: 'What is your nickname?',
            input: 'text',
            inputPlaceholder: 'Enter your nickname',
            allowOutsideClick: false,
            allowEscapeKey: false,
            inputValidator: (value) => {
                return !value && 'You need to write something!'
            }
        }).then((result) => {
                localStorage.setItem(Constants.LS_PLAYER_NAME, result.value);
                state.setPlayerName(result.value);
            }
        );
    },
    requestMatch: (dto: RequestMatchDto) => (state: LobbyState, actions: any) => {
        gamehub.requestMatch({ from: dto.fromPlayer, to: dto.toPlayer })
            .then(async () => {

                let timerInterval;
                Swal({
                    title: `Match request sent`,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    cancelButtonText: 'Cancel request',
                    showConfirmButton: false,
                    showCancelButton: true,
                    html: `Waiting for <strong>${dto.toPlayer.name}</strong> to accept the match. <br/> Time left: <span></span>s`,
                    timer: matchRequestTimeout,
                    onOpen: () => {
                        let element = Swal.getContent().querySelector('span');

                        element.textContent = (Swal.getTimerLeft() / 1000.0).toFixed(0);
                        timerInterval = setInterval(() => element.textContent = (Swal.getTimerLeft() / 1000.0).toFixed(0), 1000)
                    },
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.cancel || result.dismiss == Swal.DismissReason.timer) {
                        actions.cancelMatchRequest(dto)
                    }
                })
            })
            .catch(() => {
                Swal({
                    title: `Couldn't send match request to ${dto.toPlayer.name}`,
                    showCloseButton: true,
                })
            });

        return { isMatchRequestActive: true }
    },
    cancelMatchRequest: (dto: RequestMatchDto) => (state: LobbyState) => {
        if (state.isMatchRequestActive) {
            Swal.close()
        }

        gamehub.cancelRequestMatch({ from: dto.fromPlayer, to: dto.toPlayer });

        return { isMatchRequestActive: false }
    },
    declineMatchRequest: (model: RequestMatchModel) => () => {
        gamehub.declineMatchRequest({ from: model.from, to: model.to });
    },
    acceptMatchRequest: (model: RequestMatchModel) => (state: LobbyState) => {
        gamehub.acceptMatchRequest({ from: model.from, to: model.to });
        state.onAcceptRequestMatch(model);
    },
    onMatchRequested: (model: RequestMatchModel) => (state: LobbyState, actions: any) => {
        Swal({
            title: `Match request received from ${model.from.name}`,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Accept',
            cancelButtonText: 'Decline',
            showConfirmButton: true,
            showCancelButton: true,
        }).then((result) => {
            if (result.value) {
                actions.acceptMatchRequest(model)
            }
            if (result.dismiss === Swal.DismissReason.cancel) {
                actions.declineMatchRequest(model)
            }
        });

        return { isMatchRequestActive: true }
    },
    onCancelMatchRequested: (model: RequestMatchModel) => (state: LobbyState, actions: any) => {
        if (state.isMatchRequestActive) {
            Swal.close()
        }

        actions.addEvent(new EventEntry(`${model.from.name} cancelled the match request`));

        return { isMatchRequestActive: false }
    },
    onDeclineRequestMatch: (model: RequestMatchModel) => (state: LobbyState, actions: any) => {
        if (state.isMatchRequestActive) {
            Swal.close()
        }

        actions.addEvent(new EventEntry(`${model.from.name} declined the match request`));

        Swal({
            title: `${model.from.name} declined the match request`,
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonText: 'Ok',
            showConfirmButton: true,
            timer: 5000
        });

        return { isMatchRequestActive: false }
    },
    onAcceptRequestMatch: () => (state: LobbyState) => {
        if (state.isMatchRequestActive) {
            Swal.close()
        }

        return { isMatchRequestActive: false }
    }
};