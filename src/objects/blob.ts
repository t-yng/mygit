import * as fs from 'fs-extra';
import * as crypto from 'crypto';
import * as zlib from 'zlib';
import * as path from 'path';

export default class Blob {
  private blob: string;

  constructor(blob: string) {
    this.blob = blob;
  }

  static create = (file: string): Blob => {
    const content = fs.readFileSync(file);
    const header = `blob ${content.length}\0`;
    const store = header + content;
    const hash = Blob.sha1Hash(store);
    const compressed = zlib.deflateSync(store);

    const blob = path.join('.mygit', 'objects', hash.slice(0, 2), hash.slice(-38));
    const dir = path.dirname(blob);
    if(!fs.existsSync(dir)) {
      fs.mkdirpSync(dir);
    }

    fs.writeFileSync(blob, compressed);

    return new Blob(blob);
  }

  restore = () => {
    const compressed = fs.readFileSync(this.blob);
    const unCompressed = zlib.unzipSync(compressed);
    const content = unCompressed.toString().split("\0")[1];

    return content;
  }

  private static sha1Hash = (text: string): string => {
    const hashsum = crypto.createHash('sha1');
    hashsum.update(text);
    return hashsum.digest('hex');
  }

}