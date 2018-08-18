import { h } from "hyperapp";
import { PlayerListArgs } from "@src/components/lobby/playerlist/playerListArgs";

export const PlayerList = (args: PlayerListArgs) => (
    <div style={{ overflowY: "auto", height: "400px" }}>
        <table class="table is-fullwidth">
            <tbody>

            <tr>
                <td className="is-selected" colSpan="2">
                    {args.currentPlayer.name}
                </td>
            </tr>

            {args.players.filter(p => p.id !== args.currentPlayer.id).map(p => {
                return <tr>
                    <td>
                        {p.name} {p.id === args.currentPlayer.id && <span>(you)</span>}
                    </td>

                    <td class="is-narrow">
                        {p.id !== args.currentPlayer.id &&
                        <button class="button is-small"
                                onclick={() => args.requestMatch({ fromPlayer: args.currentPlayer, toPlayer: p })}>
                            <i className="fab fa-telegram-plane"/> &nbsp; Challenge
                        </button>
                        }
                    </td>
                </tr>
            })}
            </tbody>
        </table>
    </div>
);
