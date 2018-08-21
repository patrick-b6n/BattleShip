import { RequestMatchDto } from "@src/components/lobby/lobby.actions";
import { PlayerModel } from "@src/client/communicationModels";

export interface PlayerListArgs {
    currentPlayer: PlayerModel;
    players: PlayerModel[];
    requestMatch: (dto: RequestMatchDto) => any;
}