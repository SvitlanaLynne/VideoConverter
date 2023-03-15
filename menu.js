const { Menu, dialog, app } = require("electron");
const { ipcRenderer } = require('electron');
const electron = require('electron');


const isMac = process.platform === "darwin";


const customMenu = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            {role: 'about'}
        ]
    }] : []),
    {
        label:"File",
        submenu:
        [

            {label: "Video",
            id: "Video",
            submenu:
            [
                {
                    label: "Load...",
                    click:  () => app.emit('selectFile')
                },
            
                {type: "separator"},

                {label: "Convert to AVI...",
                enabled: false,
                click:  (event, focusedWindow) => app.emit('convertToAvi', focusedWindow)
               }, 
               
               {label: "Convert to MP4...",
               enabled: false,
               click:  (event, focusedWindow) => app.emit('convertToMp4', focusedWindow)},

                {label: "Convert to WEBM...",
                enabled: false,
                click:  (event, focusedWindow) => app.emit('convertToWebm', focusedWindow)}
            ]},

            {type: "separator"},

            isMac ? {role: "close"} : {label: "Quit", role: "quit"}
        ]
    },
    {

        label: "Developer",
        submenu:
        [
            { role: "toggleDevTools"}
        ]
    }
];

if(isMac)
{
    menuTemplate.unshift(
        {
            label: 'placeholder'
        }
    )
};



const menu = Menu.buildFromTemplate(customMenu);

module.exports = menu;




