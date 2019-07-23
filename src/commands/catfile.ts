import * as fs from 'fs-extra';
import * as path from 'path';
import Blob from '../objects/blob';

/**
 * リポジトリのルートへの絶対パスを取得
 */
const root = (): string => {
    let paths = [
      '.',
      '.mygit'
    ]

    let absolute = path.resolve(path.join(...paths));
    while(absolute !== '/') {
      if(fs.existsSync(absolute)) {
        return path.dirname(absolute);
      } else {
        paths.unshift('..');
      }
      absolute = path.resolve(path.join(...paths));
    }

    return '';
}

export const catfile = (hash: string) => {
    const file = path.join(...[
      root(),
      '.mygit',
      'objects',
      hash.slice(0,2),
      hash.slice(-38)
    ]);
    const blob = new Blob(file);

    return blob.restore();
}

