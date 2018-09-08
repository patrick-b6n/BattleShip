import { h } from "hyperapp";
import "./playerList.scss"
import { PlayerModel } from "@src/client/communicationModels";
import { RequestMatchDto } from "@src/components/lobby/lobby.actions";

export interface PlayerListArgs {
    currentPlayer: PlayerModel;
    players: PlayerModel[];
    requestMatch: (dto: RequestMatchDto) => any;
}

export interface ChallengeButtonArgs {
    currentPlayer: PlayerModel;
    otherPlayer: PlayerModel;
    requestMatch: (dto: RequestMatchDto) => any;
}

const ChallengeButton = (args: ChallengeButtonArgs) => {
    if (args.otherPlayer.id !== args.currentPlayer.id) {
        return (
            <button class="button is-small"
                    onclick={() => {
                        args.requestMatch({ fromPlayer: args.currentPlayer, toPlayer: args.otherPlayer })
                    }}>
                ⚔️Challenge
            </button>
        )
    }
};

export const PlayerList = (args: PlayerListArgs) => (
    <div class="player-list">
        <table class="table is-fullwidth">
            <tbody>

            <tr>
                <td class="is-selected" colSpan="2">
                    {args.currentPlayer.name} (you)
                </td>
            </tr>

            {args.players.filter(p => p.id !== args.currentPlayer.id).map(p => {
                return (
                    <tr>
                        <td>
                            {p.name}
                        </td>

                        <td class="is-narrow">
                            <ChallengeButton requestMatch={args.requestMatch} currentPlayer={args.currentPlayer} otherPlayer={p}/>
                        </td>
                    </tr>
                )
            })}

            </tbody>
        </table>
    </div>
);
