//@ts-check
/** @typedef {import('./type').Listen} Listen */

/**
 *
 * @param {typeof fetch} fetch
 */
export function makeApi(fetch) {
  /**
   *
   * @param {{ username: string }} opts
   * @returns {Promise<number>}
   */
  async function fetchListenCount({ username }) {
    console.log(`Fetching listening count of username ${username}`);
    const endpoint = `https://api.listenbrainz.org/1/user/${username}/listen-count`;
    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error(`Fetch error: ${res.status}`);
    }
    const data = await res.json();
    return data['payload']['count'];
  }

  /**
   *
   * @param {{ username: string, maxTs?: number | null | undefined, count?: number | null | undefined }} opts
   * @returns {Promise<Listen[]>}
   */
  async function fetchListens({ username, maxTs, count }) {
    console.log(`Fetching listening data of ${username} before ${maxTs}`);

    const endpoint = `https://api.listenbrainz.org/1/user/${username}/listens`;
    const urlParams = new URLSearchParams();
    if (count == null) {
      count = 100;
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
   * @param {{ username: string, onFetchedCallback?: ({ current, done, total }: { current: number, done: number, total: number }) => void }} opts
   * @returns  {Promise<Listen[]>}
   */
  async function fetchAllListens({ username, onFetchedCallback }) {
    const allListenCount = await fetchListenCount({ username });
    /** @type {number | null} */
    let maxTs = null;
    /** @type {Listen[]} */
    const allListens = [];
    while (true) {
      const newListens = await fetchListens({ username, maxTs });
      if (newListens.length === 0) {
        break;
      }

      allListens.push(...newListens);
      maxTs = allListens[allListens.length - 1]['listened_at'];

      if (typeof onFetchedCallback == 'function') {
        onFetchedCallback({
          current: newListens.length,
          done: allListens.length,
          total: allListenCount,
        });
      }
    }
    return allListens;
  }

  return { fetchListenCount, fetchListens, fetchAllListens };
}
