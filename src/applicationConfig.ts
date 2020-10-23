import * as fs from "fs";
import * as util from "util";
import { warning } from "./utils/logger";

const existsAsync = util.promisify(fs.exists);
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

export interface ApplicationConfig {
    token : string
    // Add your config here.
}

export async function loadAppConfig<T>(filePath : string): Promise<T> {
    let config = {} as T;
    let exists = await existsAsync(filePath);
    if(!exists) {
        warning(`Couldn't find a file '${filePath}', writing a new one...`);
        await writeFileAsync(filePath, JSON.stringify(config));
    } else {
        let file = await readFileAsync(filePath);
        config = JSON.parse(file.toString());
    }
    return config;
}