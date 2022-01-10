function startDomComment(message, callback) {
    console.log("send message to start dom comment", message)
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            console.log("get response:", response)
            if (callback) callback(response);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("ceph-popup-start-btn").onclick = function () {
        startDomComment({"event": "start-dom-comment"}, null);
    }
});
