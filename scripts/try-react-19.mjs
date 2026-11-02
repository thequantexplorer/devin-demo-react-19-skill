// Runs the test suite against React 19 in a throwaway copy of the repo.
// Your working tree, package.json and node_modules are not changed.
import { cpSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REACT_19 = '19.2.9';
const root = fileURLToPath(new URL('..', import.meta.url));
const dir = mkdtempSync(join(tmpdir(), 'react19-'));
const skip = /^(node_modules|\.git|dist)(\/|$)/;

cpSync(root, dir, { recursive: true, filter: (src) => !skip.test(relative(root, src)) });

function run(cmd, args) {
  const result = spawnSync(cmd, args, { cwd: dir, stdio: 'inherit' });
  return result.status ?? 1;
}

console.log(`Installing react@${REACT_19} and react-dom@${REACT_19} in ${dir}`);
let status = run('npm', ['install', '--no-audit', '--no-fund', '--save-exact', `react@${REACT_19}`, `react-dom@${REACT_19}`]);
if (status === 0) status = run('npx', ['vitest', 'run']);
rmSync(dir, { recursive: true, force: true });
process.exit(status);
