import { PlayerModel } from "@src/client/models";
import { RequestMatchDto } from "@src/components/lobby/lobby.actions";

export interface PlayerListArgs {
    currentPlayer: PlayerModel;
    players: PlayerModel[];
    requestMatch: (dto: RequestMatchDto) => any;
}