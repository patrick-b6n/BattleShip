import { h } from "hyperapp";
import { EventEntry, EventType } from "@src/client/models"

interface EventArgs {
    event: EventEntry
}

interface EventLogArgs {
    events: EventEntry[]
}

export const EventMessageTime = (args: any) => (
    <span style={{ fontWeight: "bold" }}>{args.date.toLocaleTimeString()}</span>
);

export const MessageEvent = (args: EventArgs) => (
    <div style={{ display: "flex" }}>
        <EventMessageTime date={args.event.date}/>
        <div style={{ paddingLeft: "1rem" }}>{args.event.message}</div>
    </div>
);

export const ChallengeEvent = (args: EventArgs) => (
    <div style={{ display: "flex" }}>
        <EventMessageTime date={args.event.date}/>
        <div style={{ paddingLeft: "1rem" }}>{args.event.message}</div>
        <div style={{ paddingLeft: "1rem" }}>
            <button class="button is-small is-primary" onclick={() => args.event.data.accept()}>Accept</button>
        </div>
    </div>
);

export const EventLog = (args: EventLogArgs) => (
    <div id="event-log" style={{ overflowY: "auto", height: "400px", padding: "1rem" }}>
        {args.events.map(e => {
            switch (e.type) {
                case EventType.Message:
                    return <MessageEvent event={e}/>;
                case EventType.Challenge:
                    return <ChallengeEvent event={e}/>;
            }
        })}
    </div>
);

