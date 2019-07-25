import Blob from './blob';
import Tree from './tree';
import Commit from './commit';
import { Refs } from '../refs';
import { Index, IndexNode } from '../index-file';

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
  const refs = new Refs();
  const tree = createTree(index.toTree().root.children);
  const parent = refs.parentCommitHash;

  const commit = Commit.create({
    tree: tree.hash,
    parent: parent,
    message: message,
  });

  refs.update(commit.hash);

  return commit;
}
