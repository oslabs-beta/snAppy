//this file should be automatically ran upon a button via a task: node ./functionalities/childprocess.ts
const {exec} = require('child_process');

console.log('running child process');
console.log(__dirname)
exec('npx webpack --profile --json > compilation-stats.json', {cwd: __dirname});