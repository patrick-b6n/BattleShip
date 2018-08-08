import { h } from "hyperapp";
import { PlayerListArgs } from "@src/components/lobby/playerlist/playerListArgs";

export const PlayerList = (args: PlayerListArgs) => (
    <div style={{ overflowY: "auto", height: "400px", padding: "1rem" }}>
        {args.players.map(p => (
            <div class="level">
                <div class="level-left">
                    {p.name}
                </div>

                <div class="level-right">
                    {p.id !== args.currentPlayer.id &&
                    <button class="button is-small"
                            onclick={() => args.requestMatch({ fromPlayer: args.currentPlayer, toPlayer: p })}>Challenge</button>
                    } 
                </div>
            </div>
        ))}
    </div>
);
