// 后续做服务更新
function sendMessage(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            console.log("get response:", response)
            if (callback) callback(response)
        });
    });
}


// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('bg receive content-script message：', request, sender, sendResponse);
    if (request.event === 'get-dom-comment') {
        fetch("https://www.haier.com/").then(response => {
            console.log(response.text())
        })
        setTimeout(function () {
            sendResponse({"data": {}})
        }, 20000)
        return true;
    } else {
        sendResponse('bg： copy that');
    }
});


function getProjects() {
    chrome.storage.local.get(['token'], function (result) {
        console.log('Value currently is ' + result.token);
        var token = result.token;
        if (!token) {
            console.log("open login");
            sendMessage({"event": "show-login"}, null);
            return;
        }

        fetch("http://localhost:8080/project", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: {}
        }).then(response => console.log(response)).catch(error => console.error(error))

    });
}
