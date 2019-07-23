import * as path from 'path';
import * as fs from 'fs';

export default class Index {
    private _file: string;

    constructor() {
        this._file = path.join('.mygit', 'index');
    }

    add = (hash: string, file: string): void => {
        const entry = `${hash} ${file}\0`;
        fs.appendFileSync(this._file, entry);
    }
}