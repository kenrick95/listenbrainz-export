#!/usr/bin/env node
// @ts-check
import fetch from 'node-fetch';
import { Command } from 'commander';
import { writeFile } from 'fs/promises';
import { cwd } from 'process';
import { join } from 'path';

/**
 * @typedef {Object} Listen
 * @property {string} inserted_at full date string
 * @property {number} listened_at timestamp
 * @property {string} recording_msid
 * @property {TrackMetadata} track_metadata
 * @property {string} user_name
 */
/**
 * @typedef {Object} TrackMetadata
 * @property {Record<string, string>} additional_info
 * @property {Record<string, string>} mbid_mapping
 * @property {string} artist_name
 * @property {string} track_name
 * @property {string} release_name
 */

/**
 *
 * @param {{ username: string, maxTs?: number | null | undefined, count?: number | null | undefined }} opts
 * @returns {Promise<Listen[]>}
 */
async function fetchChunk({ username, maxTs, count }) {
  console.log(`Fetching listening data of ${username} before ${maxTs}`);

  const endpoint = `https://api.listenbrainz.org/1/user/${username}/listens`;
  const urlParams = new URLSearchParams();
  if (count == null) {
    count = 500;
  }
  urlParams.append('count', String(count));
  if (maxTs != null) {
    urlParams.append('max_ts', String(maxTs));
  }

  const url = endpoint + '?' + urlParams.toString();
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch error: ${res.status}`);
  }
  const data = await res.json();
  return data['payload']['listens'];
}

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

  /** @type {number | null} */
  let maxTs = null;
  /** @type {Listen[]} */
  const allListens = [];
  while (true) {
    const newListens = await fetchChunk({ username, maxTs });
    if (newListens.length === 0) {
      break;
    }
    allListens.push(...newListens);
    maxTs = allListens[allListens.length - 1]['listened_at'];
  }

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
