import { h } from "hyperapp";
import { PlayerModel as Player } from "../models";

interface PlayerListArgs {
    player: Player;
    players: Player[];
    challengePlayer: (id: Player) => any;
}

export const PlayerList = (args: PlayerListArgs) => (
    <div style={{ border: "1px solid black", padding: "1rem" }}>
        {args.players.map(p => <div>{p.name}
            {p.id !== args.player.id &&
            <button onclick={() => args.challengePlayer(p)}>Challenge</button>
            }
        </div>)}
    </div>
);
