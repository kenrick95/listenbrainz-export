//@ts-check
import { makeApi } from './lib/api.js';

const { fetchAllListens } = makeApi(fetch);
const elForm = /** @type {HTMLFormElement} */ (document.querySelector('#form'));
const elUsername = /** @type {HTMLInputElement} */ (
  document.querySelector('#username')
);
const elError = /** @type {HTMLDivElement} */ (
  document.querySelector('#error')
);
const elSubmit = /** @type {HTMLInputElement} */ (
  document.querySelector('#submit')
);
const elLoading = /** @type {HTMLDivElement} */ (
  document.querySelector('#loading')
);

elLoading.innerHTML = '';
elError.innerHTML = '';
elUsername.value = '';
enableForm();
elForm.addEventListener('submit', async (event) => {
  event.stopPropagation();
  event.preventDefault();

  let username = elUsername.value;

  disableForm();
  try {
    if (!username) {
      throw new Error('Username must not be empty');
    }

    elLoading.textContent = `Starting to fetch data`;
    const allListens = await fetchAllListens({
      username,
      onFetchedCallback: ({ done, total }) => {
        const percentage = total > 0 ? Math.floor((100 * done) / total) : 0;
        elLoading.textContent = `Fetched ${done} / ${total} (${percentage}%)`;
      },
    });
    elLoading.textContent = `All done!`;
    saveFile(`listenbrainz-listens-${username}.json`, allListens);

    enableForm();
  } catch (error) {
    console.error(error);
    elError.textContent = error;

    elLoading.textContent = 'Encountered error';
    enableForm();
  }
});

function disableForm() {
  elUsername.disabled = true;
  elSubmit.disabled = true;
}
function enableForm() {
  elUsername.disabled = false;
  elSubmit.disabled = false;
}
/**
 *
 * @see https://stackoverflow.com/a/65939108/917957
 * @param {string} filename
 * @param {any} data
 */
function saveFile(filename, data) {
  const blob = new Blob([JSON.stringify(data)], { type: 'text/json' });
  const link = document.createElement('a');

  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');

  const evt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  link.dispatchEvent(evt);
  link.remove();
}
