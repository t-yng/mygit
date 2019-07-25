import * as objects from '../objects';
import { Index } from '../index-file';

export const add = (file: string) => {
    // blobオブジェクトを生成
    const blob = objects.createBlob(file);

    // Indexファイルを更新
    const index = new Index();
    index.add(blob.hash, file);
}
