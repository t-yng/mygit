import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

export interface IndexEntry {
    hash: string,
    file: string
}

export class Index {
    private _file: string;

    constructor() {
        this._file = path.join('.mygit', 'index');
    }

    get entries(): IndexEntry[] {
        if(!fs.existsSync(this._file)) return [];

        const content = fs.readFileSync(this._file).toString();
        const lines = content.split(os.EOL);
        return lines.map( (line) => {
            const [ hash, file ] = line.split(' ');
            return { hash, file };
        });
    }

    add = (hash: string, file: string): void => {
        const entries = this.entries;
        const index = entries.findIndex( entry => entry.file === file );
        if(index > -1) {
            entries[index].hash = hash;
            this.write(entries);
        } else {
            let newEntry = `${hash} ${file}`;
            if(entries.length > 0) {
                newEntry = os.EOL + newEntry;
            }

            fs.appendFileSync(this._file, newEntry);
        }
    }

    private write = (entries: IndexEntry[]) => {
        const lines = entries.map( entry => `${entry.hash} ${entry.file}`);
        fs.writeFileSync(this._file, lines.join(os.EOL));
    }
}