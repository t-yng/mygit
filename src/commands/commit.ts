import Commit from '../objects/commit';
import { Index } from '../index-file';
import * as objects from '../objects';

export const commit = (message: string): Commit => {
    const index = new Index();
    return objects.createCommit(index, message);
}