// src/index.ts
import { getInput, setFailed } from '@actions/core';
import { resolve } from 'path';
import { exec } from '@actions/exec';

const resolvePath = (relativePath: string): string =>
  resolve(`${process.env.GITHUB_WORKSPACE}/${relativePath}`);

const scriptName = getInput('scriptName', { required: true });
const scriptPathInput = getInput('scriptPath', { required: true });

const scriptPath = resolvePath(scriptPathInput);

async function failScript(result: string): Promise<void> {
  const message = `\`npm run ${scriptName}\` has failed\n\`\`\`${result}\`\`\``;
  return setFailed(message);
}

async function runScript(): Promise<number> {
  await exec('npm', ['ci'], { cwd: scriptPath });

  return exec('npm', ['run', scriptName], {
    cwd: scriptPath,
    listeners: { errline: failScript },
  });
}

runScript().catch((error) => setFailed(error.message));
