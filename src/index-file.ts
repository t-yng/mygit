import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

export interface IndexEntry {
    hash: string,
    file: string
}

export interface IndexNode {
    name: string,
    hash?: string,
    children: IndexNode[]
}

export interface IndexTree {
    root: IndexNode
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

    toTree = (): IndexTree => {
        const entries = this.entries;

        let tree: IndexTree = {
            root: {
                name: 'root',
                children: []
            }
        }

        entries.forEach(entry => {
            let current = tree.root;
            const parts = entry.file.split(path.sep);

            parts.forEach((part, i) => {
                if (current.children == null) current.children = [];

                if (i === parts.length - 1) {
                    current.children.push({
                        name: part,
                        hash: entry.hash,
                        children: []
                    });

                    return;
                }

                const exists = current.children.find((child: any) => child.name === part);
                if (exists) {
                    current = exists
                } else {
                    const newEntry = {
                        name: part,
                        children: []
                    };
                    current.children.push(newEntry);
                    current = newEntry;
                }
            });
        });

        return tree;
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