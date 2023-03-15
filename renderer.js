const { ipcRenderer } = require('electron');
const electron = require('electron');



ipcRenderer.on('videoPath', (event, videoPath)=>{

    const videoSourceTag = document.getElementById('videoSourceTag');
    videoSourceTag.src = videoPath;
    document.getElementById("js-player").load();
});

