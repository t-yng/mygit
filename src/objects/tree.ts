import { sha1 } from './hash';
import * as os from 'os';
import MyGitObject from './object';

interface TreeEntry {
    name: string,
    hash: string,
}

export default class Tree extends MyGitObject {
    static create = (children: TreeEntry[]): Tree => {
        const content = children.map( entry => `${entry.hash} ${entry.name}`).join(os.EOL);
        const header = `tree ${content.length}\0`;
        const store = header + content;
        const hash = sha1(store);

        const tree = new Tree(hash);
        tree.write(store);

        return tree;
    }
}