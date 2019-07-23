#!/usr/bin/env node

import * as fs from 'fs-extra';
import * as path from 'path';
import * as objects from './objects';
import * as program from 'commander';
import Blob from './objects/blob';

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

const init = () => {
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

const add = (file: string) => {
  objects.createBlob(file);
}

const catFile = (hash: string) => {
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

program
  .command('init')
  .action(init);

program
  .command('add <file>')
  .action(add);

program
.command('cat-file <hash>')
.action((hash) => {
  const content = catFile(hash);
  console.log(content);
});

program.parse(process.argv);
