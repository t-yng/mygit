import * as fs from 'fs';
import * as path from 'path';

export class Refs {
    get HEAD(): string {
        const ref = fs.readFileSync('.mygit/HEAD').toString();
        return ref.split(' ')[1];
    }

    get parentCommitHash(): string | undefined {
        const refsFile = path.join('.mygit', this.HEAD);
        if(!fs.existsSync(refsFile)) {
            return undefined;
        }

        return fs.readFileSync(refsFile).toString();
    }

    update = (hash: string): void => {
        const refsFile = path.join('.mygit', this.HEAD);
        fs.writeFileSync(refsFile, hash);
    }
}