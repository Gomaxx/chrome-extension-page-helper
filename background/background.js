// 后续做服务更新

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

