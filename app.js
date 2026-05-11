const romFileInput = document.getElementById('romFileInput');
const coreSelect = document.getElementById('coreSelect');
const curatedRomSelect = document.getElementById('curatedRomSelect');
const playUploadedBtn = document.getElementById('playUploadedBtn');
const playCuratedBtn = document.getElementById('playCuratedBtn');
const statusText = document.getElementById('statusText');

const defaultCuratedEntry = {
  name: 'No curated ROMs configured',
  core: 'gba',
  url: ''
};

let currentBlobUrl = null;

const setStatus = (message) => {
  statusText.textContent = message;
};

const escapeForScriptString = (value) =>
  String(value)
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

const bootEmulator = ({ core, romSource, displayName }) => {
  const gameEl = document.getElementById('game');

  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }

  const romUrl = typeof romSource === 'string' ? romSource : URL.createObjectURL(romSource);
  if (typeof romSource !== 'string') {
    currentBlobUrl = romUrl;
  }

  const safeCore = escapeForScriptString(core);
  const safeRomUrl = escapeForScriptString(romUrl);
  const safeGameName = escapeForScriptString(displayName);

  const iframe = document.createElement('iframe');
  iframe.title = 'EmulatorJS Player';
  iframe.allowFullscreen = true;
  iframe.className = 'emulator-frame';

  iframe.srcdoc = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body, #game { width: 100%; height: 100%; margin: 0; background: #070b1d; overflow: hidden; }
    </style>
  </head>
  <body>
    <div id="game"></div>
    <script>
      window.EJS_player = '#game';
      window.EJS_core = '${safeCore}';
      window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
      window.EJS_gameName = '${safeGameName}';
      window.EJS_gameUrl = '${safeRomUrl}';
      window.EJS_color = '#6ea8fe';
    </script>
    <script src="https://cdn.emulatorjs.org/stable/data/loader.js"></script>
  </body>
</html>`;

  gameEl.replaceChildren(iframe);
  setStatus(`Running: ${displayName} (${core.toUpperCase()})`);
};

const refreshUploadedButton = () => {
  playUploadedBtn.disabled = !romFileInput.files?.length;
};

romFileInput.addEventListener('change', refreshUploadedButton);

playUploadedBtn.addEventListener('click', () => {
  const file = romFileInput.files?.[0];
  if (!file) return;

  bootEmulator({
    core: coreSelect.value,
    romSource: file,
    displayName: file.name
  });
});

playCuratedBtn.addEventListener('click', () => {
  const selected = curatedRomSelect.selectedOptions[0];
  if (!selected || !selected.value) {
    setStatus('No curated ROM selected.');
    return;
  }

  bootEmulator({
    core: selected.dataset.core,
    romSource: selected.value,
    displayName: selected.textContent
  });
});

const loadCuratedRoms = async () => {
  try {
    const response = await fetch('roms/curated-roms.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to load curated ROM list.');

    const roms = await response.json();
    const safeRoms = Array.isArray(roms) && roms.length ? roms : [defaultCuratedEntry];

    curatedRomSelect.innerHTML = '';
    safeRoms.forEach((rom) => {
      const option = document.createElement('option');
      option.textContent = rom.name;
      option.value = rom.url;
      option.dataset.core = rom.core;
      curatedRomSelect.appendChild(option);
    });

    if (!safeRoms[0].url) {
      playCuratedBtn.disabled = true;
      setStatus('Add curated ROMs to roms/curated-roms.json to enable quick launch.');
    }
  } catch {
    curatedRomSelect.innerHTML = '';
    const option = document.createElement('option');
    option.textContent = 'Could not load curated ROM list';
    option.value = '';
    curatedRomSelect.appendChild(option);
    playCuratedBtn.disabled = true;
    setStatus('Could not load curated ROM list.');
  }
};

loadCuratedRoms();
refreshUploadedButton();
