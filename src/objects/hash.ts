import * as crypto from 'crypto';

export const sha1 = (text: string): string => {
    const hashsum = crypto.createHash('sha1');
    hashsum.update(text);
    return hashsum.digest('hex');
}