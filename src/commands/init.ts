import * as fs from 'fs-extra';
import * as path from 'path';

export const init = () => {
    const mygit = '.mygit';
    const dirs = [
      mygit,
      path.join(mygit, 'objects'),
      path.join(mygit, 'refs', 'heads'),
    ];

    dirs.forEach((dir) => {
      fs.mkdirpSync(dir);
    });

    fs.writeFileSync(path.join(mygit, 'HEAD'), 'ref: refs/heads/master');

    const absolute = path.resolve(mygit);
    console.log(`Initialized empty MyGit repository in ${absolute}`);
}
