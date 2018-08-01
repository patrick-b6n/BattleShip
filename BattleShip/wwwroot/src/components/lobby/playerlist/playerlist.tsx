import { h } from "hyperapp";
import { PlayerModel as Player } from "@src/client/models";

interface PlayerListArgs {
    player: Player;
    players: Player[];
    challengePlayer: (id: Player) => any;
}

export const PlayerList = (args: PlayerListArgs) => (
    <div style={{ overflowY: "auto", height: "400px", padding: "1rem" }}>
        {args.players.map(p => (
            <div class="level">
                <div class="level-left">
                    {p.name}
                </div>

                <div class="level-right">
                    {p.id !== args.player.id &&
                    <button class="button is-small" onclick={() => args.challengePlayer(p)}>Challenge</button>
                    }
                </div>
            </div>
        ))}
    </div>
);
