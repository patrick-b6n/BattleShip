import { h } from "hyperapp";
import { PlayerModel as Player } from "../models";

interface PlayerListArgs {
    player: Player;
    players: Player[];
    challengePlayer: (id: Player) => any;
}

export const PlayerList = (args: PlayerListArgs) => (
    <div>{args.players.map(p => <div>{p.name}
        {p.id !== args.player.id &&
        <button onclick={() => args.challengePlayer(p)}>Challenge</button>
        }
    </div>)}</div>
);
