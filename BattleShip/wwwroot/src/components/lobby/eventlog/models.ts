export enum EventType {
    Message,
    Challenge
}

export class EventEntry {
    date: Date;
    type: EventType;
    message: string;
    data: any | null;

    constructor(message: string, type: EventType = EventType.Message, data: any = null) {
        this.date = new Date();
        this.type = type;
        this.message = message;
        this.data = data;
    }
}