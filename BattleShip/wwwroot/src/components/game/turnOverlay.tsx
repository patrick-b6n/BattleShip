import { h } from "hyperapp";

interface TurnOverlayArgs {
    isMyTurn: boolean
}

export const TurnOverlay = (args: TurnOverlayArgs) => {
    if (!args.isMyTurn) {
        return (
            <div class="turn-overlay">
                <div>Wait for your opponent</div>
            </div>
        )
    }  
};