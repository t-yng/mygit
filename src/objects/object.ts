import * as fs from 'fs-extra';
import * as path from 'path';
import * as zlib from 'zlib';

export default class MyGitObject {
    private _hash: string;

    constructor(hash: string) {
      this._hash = hash;
    }

    get hash(): string {
      return this._hash;
    }

    get file(): string {
      const hash = this._hash;
      return this.createFilePath(hash);
    }

    write = (content: string): void => {
      const compressed = zlib.deflateSync(content);

      const file = this.createFilePath(this.hash);
      const dir = path.dirname(file);
      if(!fs.existsSync(dir)) {
        fs.mkdirpSync(dir);
      }

      fs.writeFileSync(file, compressed);
    }

    restore = () => {
      const compressed = fs.readFileSync(this.file);
      const unCompressed = zlib.unzipSync(compressed);
      const content = unCompressed.toString().split("\0")[1];

      return content;
    }

    protected createFilePath = (hash: string): string => {
        return path.resolve(path.join('.mygit', 'objects', hash.slice(0, 2), hash.slice(-38)));
    }
}