import { Module } from "./types/module";
import { readdirSync } from "fs";
import { Client, Message } from "discord.js";
import { BaseCommand, InternalCommand } from "./types/command";
import { ArgumentQueue } from "../utils/queue";
import * as logger from "../utils/logger";

let commands: BaseCommand[] = [];
// TODO: move this into config
let prefix: string = ">";

// TODO: move this into config
const moduleFolder = process.cwd() + "/dist/modules/";

export function loadModules(client: Client) {
    // TODO: turn into async
    let moduleFiles = readdirSync(moduleFolder);
    client.on('message', readCommand);
    
    for(let module of moduleFiles) {
        const tempModule = new (require(moduleFolder + module).default)() as Module;
        for(const key of Object.getOwnPropertyNames(Object.getPrototypeOf(tempModule)))
        {
            let cmdKey = Reflect.getMetadata("__command", tempModule, key);
            if(cmdKey != null) {
                commands.push(new InternalCommand(cmdKey, tempModule[key]));
            }

            let evtKey = Reflect.getMetadata("__event", tempModule, key);
            if(evtKey != null) {
                client.on(evtKey, tempModule[key]);
            }
        }
    }
}

async function readCommand(m: Message) {
    if(m.author.bot) {
        return;
    }

    let splitContent = m.content.split(' ');
    if(!splitContent[0].startsWith(prefix)) {
        return;
    }
    splitContent[0] = splitContent[0].substring(prefix.length);

    let args = new ArgumentQueue(splitContent);
    for(let command in commands) {
        let matches = commands[command].canRun(m, args);
        if(matches) {
            logger.accept(`found '${commands[command].getName()}'`);
            await Promise.resolve(
                commands[command].runCommandAsync(m, args));
            return;
        }
    }
    logger.reject(`couldn't find a command with id '${args.peek()}'`);
}