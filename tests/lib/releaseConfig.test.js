import test from 'ava';
import { readJSON } from '../../packages/utils/files.js';
import { resolve } from 'node:path';
import { ReleaseConfig } from '../../packages/lib/releaseConfig.js';

const feScriptsConfig = readJSON(resolve('./packages/config/fe-scripts.json'));
const releaseConfig = new ReleaseConfig();

test('.feScriptsConfig equeal to fe-scripts.json', (t) => {
  const feScripts = releaseConfig.feScriptsConfig;

  t.deepEqual(feScripts, feScriptsConfig);
});

test('call getRelease', (t) => {
  t.is(releaseConfig.getRelease('xx_xx'), undefined);
  t.is(releaseConfig.getRelease('xx_xx', 'defaultXXX'), 'defaultXXX');
  t.is(releaseConfig.getRelease('autoMergeType'), 'squash');
  t.is(releaseConfig.getRelease('autoMergeReleasePR'), true);
});

test('call getReleaseBranch', (t) => {
  const releaseConfig = new ReleaseConfig();

  releaseConfig.env = 'prod';
  releaseConfig.branch = 'release';

  t.is(releaseConfig.getReleaseBranch(), 'prod-release-');
  t.is(releaseConfig.getReleaseBranch(null), 'prod-release-');
  t.is(releaseConfig.getReleaseBranch(''), 'prod-release-');
  t.is(releaseConfig.getReleaseBranch(2.0), 'prod-release-2');
  t.is(releaseConfig.getReleaseBranch(2.1), 'prod-release-2.1');
  t.is(releaseConfig.getReleaseBranch('v1.0.1'), 'prod-release-v1.0.1');
  t.is(releaseConfig.getReleaseBranch('1.0.1'), 'prod-release-1.0.1');

  releaseConfig.branch = '';
  t.is(releaseConfig.getReleaseBranch('1.0.1'), 'prod--1.0.1');

  releaseConfig.env = '';
  t.is(releaseConfig.getReleaseBranch('1.0.1'), '--1.0.1');
});

test('call getReleasePRTitle', (t) => {
  const releaseConfig = new ReleaseConfig();

  t.is(releaseConfig.getReleasePRTitle(), '[Bot Release] Branch:, Tag:, Env:');
  t.is(
    releaseConfig.getReleasePRTitle(''),
    '[Bot Release] Branch:, Tag:, Env:'
  );
  t.is(
    releaseConfig.getReleasePRTitle(null),
    '[Bot Release] Branch:, Tag:, Env:'
  );
  t.is(
    releaseConfig.getReleasePRTitle(1.0),
    '[Bot Release] Branch:, Tag:1, Env:'
  );
  t.is(
    releaseConfig.getReleasePRTitle(1.1),
    '[Bot Release] Branch:, Tag:1.1, Env:'
  );
  t.is(
    releaseConfig.getReleasePRTitle('1.1.0'),
    '[Bot Release] Branch:, Tag:1.1.0, Env:'
  );

  releaseConfig.env = 'prod';
  releaseConfig.branch = 'release';

  t.is(
    releaseConfig.getReleasePRTitle('1.1.0'),
    '[Bot Release] Branch:release, Tag:1.1.0, Env:prod'
  );
});

test('call getReleasePRBody', (t) => {
  const releaseConfig = new ReleaseConfig();

  t.is(releaseConfig.getReleasePRBody(), 'This PR includes version bump to ');
  t.is(
    releaseConfig.getReleasePRBody('v1.1.0'),
    'This PR includes version bump to v1.1.0'
  );

  t.is(
    releaseConfig.getReleasePRBody('1.1.0-beta'),
    'This PR includes version bump to 1.1.0-beta'
  );
});
