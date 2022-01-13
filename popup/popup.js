function sendContentMessage(message, callback) {
    console.log("send message to start dom comment", message)
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            console.log("get response:", response)
            if (callback) callback(response);
        });
    });
}

function setDomComment() {
    var textarea = document.getElementsByTagName("textarea")[0];
    if (textarea) {
        console.log(textarea.value)
        sendContentMessage({"event": "show-dom-comment", "data": textarea.value}, null);
    }
}

function sync() {
    var backgroundPage = chrome.extension.getBackgroundPage();
    backgroundPage.getProjects();
}


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("ceph-popup-start-btn").onclick = function () {
        sendContentMessage({"event": "start-dom-comment"}, null);
    }
    document.getElementById("ceph-popup-set-data-btn").onclick = function () {
        setDomComment();
    }
    document.getElementById("ceph-popup-sync-data").onclick = function () {
        sync();
    }
});
