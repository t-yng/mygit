import MyGitObject from '../objects/object';

export const catfile = (hash: string) => {
    const object = new MyGitObject(hash);
    return object.restore();
}

