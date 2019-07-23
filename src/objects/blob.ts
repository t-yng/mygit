import * as fs from 'fs-extra';
import { sha1 } from './hash';
import MyGitObject from './object';

export default class Blob extends MyGitObject {
  static create = (file: string): Blob => {
    const content = fs.readFileSync(file);
    const header = `blob ${content.length}\0`;
    const store = header + content;
    const hash = sha1(store);

    const blob = new Blob(hash);
    blob.write(store);

    return blob;
  }
}