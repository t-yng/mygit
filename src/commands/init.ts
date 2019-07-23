import * as fs from 'fs-extra';
import * as path from 'path';

export const init = () => {
    const mygit = '.mygit';
    const dirs = [
      mygit,
      path.join(mygit, 'objects'),
    ];

    dirs.forEach((dir) => {
      fs.mkdirpSync(dir);
    });

    const absolute = path.resolve(mygit);
    console.log(`Initialized empty MyGit repository in ${absolute}`);
}
