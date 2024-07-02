import test from 'ava';
import sh from 'shelljs';
import sinon from 'sinon';
import { Shell, Logger } from '../../packages/lib/index.js';

const { stdout } = sh.exec('pwd');
const cwd = stdout.trim();

const shell = new Shell();

test('exec', async (t) => {
  t.is(await shell.exec('echo bar'), 'bar');
});

test('exec (with context)', async (t) => {
  const exec = (cmd) =>
    shell.exec(
      cmd,
      { verbose: false },
      {
        git: {
          releaseName: 'test-releaseName'
        },
        github: {
          tokenRef: 'GITHUB_TOKEN'
        }
      }
    );
  t.is(await exec(''), undefined);
  t.is(await exec('pwd'), cwd);
  // eslint-disable-next-line no-template-curly-in-string
  t.is(await exec('echo ${git.releaseName}'), 'test-releaseName');
  // eslint-disable-next-line no-template-curly-in-string
  t.is(await exec('echo -*- ${github.tokenRef} -*-'), '-*- GITHUB_TOKEN -*-');
});

test('exec (with args)', async (t) => {
  t.is(await shell.exec([]), undefined);
  t.is(await shell.exec(['pwd']), cwd);
  t.is(await shell.exec(['echo', 'a', 'b']), 'a b');
  t.is(await shell.exec(['echo', '"a"']), '"a"');
});

// test('exec (dry-run/read-only)', async (t) => {
//   const shell = new Shell();
//   {
//     const actual = await shell.exec('pwd', { write: false });
//     t.is(actual, cwd);
//     t.is(shell.log.exec.callCount, 1);
//     t.is(shell.log.exec.firstCall.args[0], 'pwd');
//   }
//   {
//     const actual = await shell.exec('pwd');
//     t.is(actual, undefined);
//     t.is(shell.log.exec.callCount, 2);
//     t.is(shell.log.exec.secondCall.args[0], 'pwd');
//     t.deepEqual(shell.log.exec.secondCall.lastArg, { isDryRun: true });
//   }
// });

// test('exec (verbose)', async (t) => {
//   const shell = sinon.createStubInstance(Shell);
//   const actual = await shell.exec('echo foo');
//   t.is(shell.log.exec.firstCall.args[0], 'echo foo');
//   t.is(shell.log.exec.callCount, 1);
//   t.is(shell.log.verbose.firstCall.args[0], 'foo');
//   t.is(shell.log.verbose.callCount, 1);
//   t.is(actual, 'foo');
// });

// test('should cache results of command execution', async (t) => {
//   const log = sinon.createStubInstance(Logger);
//   const shell = new Shell();
//   const result1 = await shell.exec('echo foo');
//   const result2 = await shell.exec('echo foo');
//   t.is(result1, result2);
//   t.deepEqual(log.exec.args, [
//     ['echo foo', { isExternal: false, isCached: false }],
//     ['echo foo', { isExternal: false, isCached: true }]
//   ]);
// });

test('should bail out on failed command execution', async (t) => {
  const shell = new Shell({ log: sinon.createStubInstance(Logger) });
  await t.throwsAsync(shell.exec('foo'));
});
