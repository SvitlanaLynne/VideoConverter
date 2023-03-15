const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const menu = require('./menu');
const { dialog } = require('electron');
const { webContents } = require('electron')

const ffmpeg = require("fluent-ffmpeg");
const ffmpegStaticElectron = require("ffmpeg-static-electron");
const ffprobeStaticElectron = require('ffprobe-static-electron')

const ProgressBar = require('electron-progressbar');

Menu.setApplicationMenu(menu);


ffmpeg.setFfmpegPath(ffmpegStaticElectron.path);
ffmpeg.setFfprobePath(ffprobeStaticElectron.path);

let mainWindow;
let selectedVideoFilePath = null;



app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 605,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadFile('./index.html');
    mainWindow.setResizable(false);

  });
  


const selectFile = (event, focusedWindow) => {                 
    dialog.showOpenDialog(focusedWindow)
        .then(fileInfo => {

            
            if (fileInfo.canceled){
                console.log('User hit the cancel button')
            }
            else {
                
                let videoPath = fileInfo.filePaths[0]

                mainWindow.webContents.send("videoPath", videoPath);

                selectedVideoFilePath = videoPath;  

                Menu.getApplicationMenu(menu).getMenuItemById('Video').submenu.items.filter(x => x.enabled == false).map(x => (x.enabled = true));
            };
        });    
    };



let format = null;

const convertToAvi = (focusedWindow) => {

    format = 'avi';
    Conversion(focusedWindow);
};

const convertToMp4 = (focusedWindow) => {

    format = 'mp4';
    Conversion(focusedWindow);
};

const convertToWebm = (focusedWindow) => {

    format = 'webm';
    Conversion(focusedWindow);
};



    function Conversion (focusedWindow) {

        dialog.showSaveDialog(focusedWindow,
            { filters: [{ name: 'Video', extensions: [format] }]
            })
        .then (saveFileInfo => {

            if (saveFileInfo.canceled) {
                console.log('Saving file was canceled by the user');
            }
            else {
                let saveFilePath = saveFileInfo.filePath;

                let progressBar = new ProgressBar({
                    indeterminate: false,
                    text: 'Converting file...',
                    detail: 'Please wait...',
                    browserWindow: {parent: focusedWindow}
                });
                    progressBar
                        .on('completed', function() {
                        console.info(`Complete!`);
                        progressBar.detail = 'Task completed. Exiting...';
                        })
                        .on('aborted', function(value) {
                        console.info(`aborted... ${value}`);
                        })
                        .on('progress', function(value) {
                        progressBar.detail = `${Math.ceil(value)}% complete`;
                        });

                ffmpeg(selectedVideoFilePath)
                    .on('start', function() {
                        console.log('STARTED');
                    })
                    .toFormat(format)
                    .on('progress', function(progress) {
                        console.log(progress)
                        
                            if(!progressBar.isCompleted()){
                            progressBar.value = progress.percent;
                        }
                    })
                    .on('error', function(err) {
                        console.log('An error occurred: ' + err.message);
                    })
                    .on('end', function() {
                        console.log('Processing finished !');
                        progressBar.value = progressBar.getOptions().maxValue;
                        
                    })
                    .saveToFile(saveFilePath);
            };
        });    
    };


app.on('selectFile', selectFile);
app.on('convertToAvi', convertToAvi);
app.on('convertToMp4', convertToMp4);
app.on('convertToWebm', convertToWebm);






    




















  


            //NOTES

    // const obj = webContents.getAllWebContents();
    // const obj = mainWindow.webContents;
    // console.log ('OBJ', obj);
    // mainWindow.webContents.send('videopath', videoPath);
    // mainWindow.webContents.on('console-message', (event,level,message) => {
        
    
// });


// let win = BrowserWindow();
// win.webContents.on("console-message", () => {
//     console.log('PATH HAS BEEN RECIVED', );
// })



// console.log(Menu.getApplicationMenu(menu).items)
// console.log('SEE THE BUTTON first', Menu.getApplicationMenu(menu).items[1])

// Menu.getApplicationMenu(menu).items[0].submenu.items[0].submenu.enabled = false;

// Menu.getApplicationMenu(menu).getMenuItemById('Developer').enabled = false;
// console.log('I CAN SELECT BY id', Menu.getApplicationMenu(menu).getMenuItemById('Developer'))

// console.log('SEE THE BUTTON', Menu.getApplicationMenu(menu).getMenuItemById('Developer'))

// console.log('FILE SUBMENU IS', Menu.getApplicationMenu(menu).items[0].submenu.items[0].submenu)
// Menu.getApplicationMenu(menu).items[0].submenu.items[0].submenu.addEventListener("click", () => {
                    


















// ipcMain.on('selectFile', ()=>{
    
// })





// ipcMain.on('pathFromMenu', (event, recievedVideoPath)=>{

//     console.log('Main sees this data:', recievedVideoPath);

//     let pathFromMain = recievedVideoPath;

    // mainWindow.webContents.send('pathFromMain', pathFromMain);
    // mainWindow.webContents.send('filePath', filePath);

