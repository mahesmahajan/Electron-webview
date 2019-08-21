
window.ELECTRONWEBVIEW = window.ELECTRONWEBVIEW || {};
ELECTRONWEBVIEW.readyStateLoader = (callback) => {
    if (document && document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else if (document) {
        callback();
    }
};


(function () {
    const webviewInit =  () => {
        var count = 0;
        const webex = document.querySelector(".join-webex");
        const zoom = document.querySelector(".join-zoom");
        const exitMeeting = document.querySelector(".exit-meeting-btn");
        const loader = document.querySelector(".loader");
        const switchConsole = document.querySelector('.pretty.p-switch input');
        const meetingInfoScreen = document.querySelector('.meeting-info-screen');
        const consoleControl = document.querySelector('.console-controls');
        const webviewContainer = document.querySelector('.webview-container');
        let webviewEle = document.querySelector('webview');
        let getwebViewHTML;

        exitMeeting && exitMeeting.addEventListener("click",  () => {
            loader.classList.remove("hide");
            reRender();
        });

        switchConsole && switchConsole.addEventListener('change', (e) => {
            if (e.target.checked) {
                meetingInfoScreen.classList.remove('hide');
            } else {
                meetingInfoScreen.classList.add('hide');
                consoleControl.classList.add('hide');
                if (webviewEle !== null) {
                    webviewEle.style.minHeight = '100vh';
                }
            }
        });

        webex && webex.addEventListener('click', (e) => {
            showLoader();
            getwebViewHTML = getWebView('https://hanitsaffting-f117-ae9b.my.webex.com/hanitsaffting-f117-ae9b.my/j.php?MTID=m8befee18b15366004c841cf46e3cb9b1');
            webviewContainer.innerHTML = getwebViewHTML;
            bindEvents();
        });

        zoom && zoom.addEventListener('click', (e) => {
            showLoader('zoom')
            //getwebViewHTML = getWebView(require('electron').remote.process.argv.slice(1)[0]);
            getwebViewHTML = getWebView('https://zoom.us/wc/4507475950/join?prefer=1&un=TXIuUmlnZWw=');
            webviewContainer.innerHTML = getwebViewHTML;
            bindEvents();
        });

        const showLoader = (name) => {
            name === 'zoom' ? loader.classList.add('hide') : loader.classList.remove('hide');
            webex.classList.add("hide");
            zoom.classList.add("hide");
        };

        const showMeetingBtn = (name) => {
            loader.classList.add('hide');
            webex.classList.remove("hide");
            zoom.classList.remove("hide");
        };

        const executeZoomScript = () => {
            setTimeout(() => {
            
                webviewEle.executeJavaScript(
                    `document.querySelectorAll(".left-tool-item button")[2].click();`
                );
            }, 20000);
        }

        const executeWebexScript = (flag) => {
            if(!flag) {
            setTimeout(()=>{
               
                webviewEle.executeJavaScript(
                    `document.querySelector(".meeting-join .user-email .el-input__inner").value = "maheshwar@gmail.com";`
                );
                webviewEle.executeJavaScript(
                    `document.querySelector(".meeting-join .el-input__inner").value = "Mahesh";`
                );

                webviewEle.executeJavaScript(
                    `document.querySelector(".el-button.el-button--success.el-button--large").removeAttribute("disabled")`
                );
                webviewEle.executeJavaScript(
                    `document.querySelector(".meeting-join  .el-input__inner").dispatchEvent(new Event("input"))`
                );

                webviewEle.executeJavaScript(
                    `document.querySelector(".meeting-join .user-email .el-input__inner").dispatchEvent(new Event("input"))`
                );

                webviewEle.executeJavaScript(
                    `document.querySelectorAll("#smartJoinButton li")[2].click();`
                );

                webviewEle.executeJavaScript(
                    `document.querySelector(".el-button.el-button--success.el-button--large").click();`
                );
            
            },1000);
        }
    };

        const loadstop = () => {
            let page = webviewEle.getAttribute("src");
            webviewEle.openDevTools();
            if (page.indexOf("zoom") > 0) {
                executeZoomScript();
            } else {
                executeWebexScript('load-stop');
            }

        };

        const loadFinish = () => {
            let page = webviewEle.getAttribute("src");
            if (page.indexOf("zoom") > 0) {
                showLoader('zoom');
                executeZoomScript();
                consoleControl.classList.remove("hide");
                webviewEle.send("bind-end-meeting", "zoom");
            } else {
                count = count + 1;
                if (count >= 1) {
                    executeWebexScript();
                    loader.classList.add("hide");
                    consoleControl.classList.remove("hide");
                    setTimeout(() => {
                        webviewEle.send("bind-end-meeting", "webex");
                    }, 5000);
                }
            }
        };

        const getWebView = (url) => {
            return ` <webview src=${url} autosize preload = "renderer.js" id="foo"  style="min-width: 786px;min-height:80vh"></webview>`;
        }

        const reRender = () => {
            setTimeout(function () {
                if (webviewEle) {
                    document.querySelector("webview").remove();
                }
                showMeetingBtn()
                // document.querySelector(".console-controls").classList.add('hide');
            }, 500);
        };

        // In embedder page
        const bindEvents = () => {
            webviewEle = document.querySelector('webview');
            webviewEle.addEventListener('ipc-message', (event) => {
                console.log(event.channel);
                loader.classList.remove("hide");
                switch (event.channel) {
                    case 'close meeting': reRender(); break;
                    default: console.log(event.channel);
                }
            })

            webviewEle.addEventListener("did-finish-load", loadFinish);
            webviewEle.addEventListener("did-stop-loading", loadstop);
        }
    }
    ELECTRONWEBVIEW.readyStateLoader(webviewInit);
})()