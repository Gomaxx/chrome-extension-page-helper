// 后续做服务更新
function sendMessage(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            console.log("get response:", response)
            if (callback) callback(response)
        });
    });
}

var uri = '';
var projectId = 0;

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('bg receive content-script message：', request, sender, sendResponse);
    if (request.event === 'set-dom-uri') {
        uri = request['url'];
        chrome.storage.local.set({"dom-uri": uri}, function (result) {
            sendResponse("set dom success")
        })
        // fetch("https://www.haier.com/").then(response => {
        //     console.log(response.text())
        // })
        // setTimeout(function () {
        //     sendResponse({"data": {}})
        // }, 20000)
        return true;
    } else if (request.event === 'add-dom-comment') {
        saveDomComment(request.data, sendResponse);
        return true;
    } else {
        sendResponse('bg： copy that');
    }
});


function saveDomComment(data, sendResponse){
    chrome.storage.local.get(['token'], function (result) {
        var token = result.token;
        if (!token) {
            console.log("open login");
            sendMessage({"event": "show-login"}, null);
            return;
        }
        data['ukey'] = uri;
        data['projectId'] = projectId;
        fetch("http://localhost:8080/dom-comment", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).then(data => {
            console.log(data)
            sendResponse(JSON.stringify(data))
        }).catch(error => console.error(error))
    });
}


function getProjects() {
    chrome.storage.local.get(['token'], function (result) {
        console.log('Value currently is ' + result.token);
        var token = result.token;
        if (!token) {
            console.log("open login");
            sendMessage({"event": "show-login"}, null);
            return;
        }

        var data = {"projectId": projectId, "ukey": uri}
        fetch("http://localhost:8080/dom-comment/list", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).then(data => {
            console.log(data)
            sendMessage({"event": "show-dom-comment", "data": JSON.stringify(data)}, null);
        }).catch(error => console.error(error))


        // fetch("http://localhost:8080/project", {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': token
        //     }
        // }).then(response => response.json()).then(data => {
        //     console.log(data)
        // }).catch(error => console.error(error))

    });
}
