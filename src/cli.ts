#!/usr/bin/env node
import * as program from 'commander';
import * as command from './commands';

program
  .command('init')
  .action(command.init);

program
  .command('add <file>')
  .action(command.add);

program
  .command('cat-file <hash>')
  .action((hash) => {
    const content = command.catfile(hash);
    console.log(content);
  });

program
  .command('commit')
  .option('-m, --message <message>', 'commit message')
  .action((options) => {
    const commit = command.commit(options.message);
    console.log(commit.hash);
  });

program.parse(process.argv);
