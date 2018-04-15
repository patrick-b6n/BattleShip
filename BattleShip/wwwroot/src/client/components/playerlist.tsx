import { h } from "hyperapp";
import { Player } from "../models";

interface PlayerListArgs {
    players: Player[];
}

export const PlayerList = (args: PlayerListArgs) => (
    <div>{args.players.map(p => <div>{p.name}</div>)}</div>
);
