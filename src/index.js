#!/usr/bin/env node
const inquirer = require('inquirer');
const path = require('path');
const { writeFile, readdir, readFile } = require('fs').promises;

const configFiles = {};
const configFolderPath = path.resolve(__dirname, 'config');

(async () => {
  const files = await readdir(configFolderPath).catch(console.log);

  for (let i of files) {
    // framework name is situated between 2 dots eg- react between 2 '.'(s)
    const frameworkName = i.split('.')[1];
    configFiles[frameworkName] = path.join(configFolderPath, i);
  }

  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      message: "Pick the framework you're using:",
      name: 'framework',
      choices: Object.keys(configFiles),
    },
  ]);

  const config = await readFile(configFiles[framework]).catch(console.log);

  const jsconfig = path.join(process.cwd(), 'jsconfig.json');

  const jsonFile = JSON.stringify(JSON.parse(config.toString()), null, 4);

  await writeFile(jsconfig, jsonFile);

  console.log('jsconfig.json successfully created');
})();
