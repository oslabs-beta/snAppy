//this file should be automatically ran upon a button via a task: node ./functionalities/childprocess.ts
import { workspace } from 'vscode';
const {exec} = require('child_process');

exec('npx webpack --profile --json > compilation-stats.json', {cwd: workspace.workspaceFolders[0].uri.path});
