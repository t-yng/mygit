import * as moment from 'moment';
import { sha1 } from './hash';
import * as os from 'os';
import MyGitObject from './object';
import { Index } from '../index-file';

interface Meta {
    tree: string,
    parent?: string,
    author: string,
    committer: string,
    message: string
}

export default class Commit extends MyGitObject {
    static create = (meta: Meta): Commit => {
        const timestamp = moment().format('X ZZ');
        const content = [
            `tree ${meta.tree}`,
            (meta.parent != null) ? `parent ${meta.parent}` : '',
            (meta.author != null) ? `author ${meta.author} ${timestamp}` : '',
            (meta.committer != null) ? `commiter ${meta.committer} ${timestamp}` : '',
            `${os.EOL}${meta.message}`
        ]
        .filter( str => str !== '')
        .join(os.EOL);

        const header = `commit ${content.length}\0`;
        const store = header + content;
        const hash = sha1(store);

        const commit = new Commit(hash);
        commit.write(store);

        return commit;
    }
}