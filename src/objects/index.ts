import * as path from 'path';
import Blob from './blob';
import Tree from './tree';
import Commit from './commit';
import { Index, IndexEntry } from '../index-file';

interface IndexNode {
  name: string,
  hash?: string,
  children: IndexNode[]
}

interface IndexTree {
  root: IndexNode
}

export const createBlob = (file: string): Blob => {
  const blob = Blob.create(file);
  return blob;
}

const createTree = (children: IndexNode[]): Tree => {
  // 空ディレクトリは対象から除外
  // TODO: 空ディレクトリは本来ここで扱うべきでないので、もっと前の呼び出し側で加工する
  const treeEntries = children.filter( child => {
    return (child.hash || child.children.length > 0);
  })
  .map( (child) => {
    if( (child.hash == null)) {
      const tree = createTree(child.children);
      child.hash = tree.hash;
    }

    return {
      name: child.name,
      hash: child.hash
    }
  });

  return Tree.create(treeEntries);
}

export const createCommit = (index: Index, message: string): Commit => {
  const indexTree = indexEntriesToTree(index.entries);
  const tree = createTree(indexTree.root.children);
  const commit = Commit.create({
    tree: tree.hash,
    message: message
  });

  return commit;
}

const indexEntriesToTree = (entries: IndexEntry[]): IndexTree => {
  let tree: IndexTree = {
    root: {
      name: 'root',
      children: []
    }
  }

  entries.forEach( entry => {
    let current = tree.root;
    const parts = entry.file.split(path.sep);

    parts.forEach( (part, i) => {
      if(current.children == null) current.children = [];

      if(i === parts.length - 1) {
        current.children.push({
          name: part,
          hash: entry.hash,
          children: []
        });

        return;
      }

      const exists = current.children.find( (child: any) => child.name === part);
      if(exists) {
        current = exists
      } else {
        const newEntry = {
          name: part,
          children: []
        };
        current.children.push(newEntry);
        current = newEntry;
      }
    });
  });

  return tree;
}