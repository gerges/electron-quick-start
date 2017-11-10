const ipcRenderer = require('electron').ipcRenderer;
let consoleDiv = document.querySelector('#console');
ipcRenderer.on('log', (e, ...args) => {
  consoleDiv.innerText = consoleDiv.innerText  + '\n\n' + args.join(' ');
});