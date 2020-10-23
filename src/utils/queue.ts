export class Queue<T> {
    _store: T[];
    constructor(t: T[] = []) { 
        this._store = t;
    }

    push(val: T) {
        this._store.push(val);
    }
    
    pop(): T | null {
        return this._store.shift();
    }

    peek(): T | null {
        if(this._store.length > 0)
        {
            return this._store[0];
        }
        return null;
    }
}

export class ArgumentQueue extends Queue<string> {
    constructor(t: string[] = []) {
        super(t);
    }

    popString(): string | null {
        let str = this.pop();
        if(str === null) {
            return null;
        }

        if(str.startsWith("\"")) {
            while(!str.endsWith("\"")) {
                let sub = this.pop();
                if(sub === null) {
                    throw "Error: start '\"' did not receieve and ender.";
                }
                str += " " + sub;
            }
        }

        return str;
    }
}