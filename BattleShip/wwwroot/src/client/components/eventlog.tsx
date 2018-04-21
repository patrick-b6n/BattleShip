import { h } from "hyperapp";
import { EventEntry as Event, EventType } from "../models"

interface MessageEventArgs {
    event: Event
}

export const MessageEvent = (args: MessageEventArgs) => (
    <div>{args.event.message}</div>
);

export const ChallengeEvent = (args: MessageEventArgs) => (
    <div>{args.event.message}
        <button onclick={() => args.event.data.accept()}>Accept</button>
    </div>
);

interface EventLogArgs {
    events: Event[]
}

export const EventLog = (args: EventLogArgs) => (
    <div id="event-log" style={{overflowY: "scroll", height: "200px", border: "1px solid black", padding: "1rem"}}>
        {args.events.map(e => RenderEvent(e))}
    </div>
);

function RenderEvent(e: Event) {
    switch (e.type) {
        case EventType.Message:
            return <MessageEvent event={e}/>;
        case EventType.Challenge:
            return <ChallengeEvent event={e}/>;
    }
}

