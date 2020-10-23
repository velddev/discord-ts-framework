import { Message } from "discord.js";
import { Queue } from "../../utils/queue";
import { reject } from "../../utils/logger";

export abstract class BaseCommand {
    abstract getName(): string;
    abstract canRun(context : Message, args: Queue<string>): boolean;
    abstract runCommandAsync(context : Message, args: Queue<string>);
}

export class InternalCommand extends BaseCommand {
    name: string;
    fn: (c: Message, args: Queue<string>) => Promise<void> | void;

    constructor(name: string, fn: (c: Message, args: Queue<string>) => Promise<void> | void) {
        super();
        this.name = name;
        this.fn = fn;
    }

    getName(): string {
        return this.name;
    }

    canRun(context: Message, args: Queue<string>): boolean {
        if(args.peek().toLowerCase() == this.getName().toLowerCase())
        {
            args.pop();
            return true;
        }
        return false;
    }

    async runCommandAsync(context: Message, args: Queue<string>) {
        try {
            await Promise.resolve(this.fn(context, args));
        } catch(ex) {
            reject(`command '${this.name}' failed with error: '${ex}'`);
            await context.channel.sendMessage("❌ " + ex);
        }
    }
}
