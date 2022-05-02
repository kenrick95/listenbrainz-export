#!/usr/bin/env node
// @ts-check
import fetch from 'node-fetch';
import { Command } from 'commander';
import { writeFile } from 'fs/promises';
import { cwd } from 'process';
import { join } from 'path';
import { makeApi } from './lib/api.js';

/** @typedef {import('./lib/type').Listen} Listen */

/**
 *
 * @param {{ username: string, outputFileName: string }} opts
 */
async function main({ username, outputFileName }) {
  if (!username) {
    throw new Error('username is required');
  }
  if (!outputFileName) {
    throw new Error('outputFileName is required');
  }
  const { fetchAllListens } = makeApi(
    // @ts-ignore
    fetch
  );
  const allListens = await fetchAllListens({ username });

  if (allListens.length) {
    const absoluteOutputFilePath = join(cwd(), outputFileName);
    console.log('Writing listening data to ', absoluteOutputFilePath);
    await writeFile(absoluteOutputFilePath, JSON.stringify(allListens));
  }
}

const program = new Command();
program
  .name('listenbrainz-export')
  .description('CLI to export listenbrainz listening data')
  .argument('<username>')
  .option('-o, --output [fileName]', 'output file name', 'output.json')
  .action(
    (
      /** @type {string} */ username,
      /** @type {Record<string, string>} */ options
    ) => {
      if (username === 'help') {
        program.help();
        return;
      }
      main({ username, outputFileName: options.output || 'output.json' });
    }
  );
program.parse();
