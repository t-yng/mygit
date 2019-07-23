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

program.parse(process.argv);
