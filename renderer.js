// inyector.js// Get the ipcRenderer of electron
const { ipcRenderer } = require('electron');


ipcRenderer.on("bind-end-meeting", function (event, data) {
    switch(data) {
        case 'webex': loadWebexMeeting(); break;
        case 'zoom':  loadZoomMeeting(); break;
        default : console.log('channel name is missing'); break;
    }
});

/**
 * Simple function to excute the zoom meeting 
 * of the <webview>
 *
 **/
function loadZoomMeeting() {
    debugger;
    let meetingIdentifier = document.querySelector('.footer__leave-btn.ax-outline');
    setTimeout(function(){
        document.querySelectorAll(".left-tool-item button")[2] && document.querySelectorAll(".left-tool-item button")[2].click(); 
    },10000)
    if (meetingIdentifier) {
        meetingIdentifier.addEventListener('click', function () {
            setTimeout(function(){   
            let endmeeting = document.querySelector('.zm-btn.zm-btn-legacy.zm-btn-primary');
                endmeeting.addEventListener('click', function () { 
                    ipcRenderer.sendToHost('close meeting');
                })
            },500);
        })
    }
}
/**
 * Simple function to excute the webex meeting 
 * of the <webview>
 *
 **/
function loadWebexMeeting() {
    setTimeout(function () {
        let crossLink = document.querySelector('.pb-meeting-loader.pb-ani-home .loading-action .leave-meeting');
        setTimeout(function () {
            let mainContainer = document.querySelector('#pb_iframecontainer');
            if (mainContainer.childNodes[0]) {
                let video = mainContainer.childNodes[0].contentDocument.querySelectorAll('.menu-item.haspop.icon-video.item-preview.btn-52');
                let red = mainContainer.childNodes[0].contentDocument.querySelectorAll('.menu-item.haspop.red.icon-leave.item-leave.btn-52');
                video[0].classList.remove('unavailable');
                video[0].click();
                red[0].click();
                let startMeeting = mainContainer.childNodes[0].contentDocument.querySelectorAll('.button.green.start-my-video');
                startMeeting[0].removeAttribute("disabled");
                startMeeting[0].click();

                let leaveMeeting = mainContainer.childNodes[0].contentDocument.querySelectorAll('.button.leave-btn.first-item.last-item');
                if (leaveMeeting.length > 0) {
                    leaveMeeting[0].addEventListener('click', function () {
                        ipcRenderer.sendToHost('close meeting');
                    })
                }
            }
        }, 5000)

        if (crossLink) {
            crossLink.addEventListener('click', function () {
                ipcRenderer.sendToHost('close meeting webex');
            })
        }

    }, 1000)
}