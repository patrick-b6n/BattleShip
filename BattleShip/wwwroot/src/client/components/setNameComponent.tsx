import { h } from "hyperapp";

interface SetNameComponentArgs {
    playerName: string;
    onPlayerNameInput: (value: string) => any;
    onSetPlayerNameClick: (value: string) => any;
}

export const SetNameComponent = (args: any) => (
    <div>
        <span>Hello</span>
        <input
            type="text"
            value={args.playerName}
            oninput={(e: Event) => {
                const el = e.target as HTMLInputElement;
                args.onPlayerNameInput(el.value);
            }}
        />
        <button onclick={() => args.onSetPlayerNameClick()}>Set</button>
    </div>
);
