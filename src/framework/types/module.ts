import { Message } from "discord.js";
import { Queue } from "../../utils/queue";

export interface EventBinding {
    event: string;
    fn: (context: any) => void;
}

export class Module {
    name: string = null;
    commands: { [id: string]:(context: Message, args: Queue<string>) => void } = {};
    events: EventBinding[] = [];

    constructor() {
        this.name = null;
        this.commands = {};
        this.events = [];
    }
}