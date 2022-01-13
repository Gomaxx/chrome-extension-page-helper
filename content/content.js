/**
 *  create by oma.onen
 *  参考：
 *  https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html
 *  https://developer.mozilla.org/en-US/docs/Web/API/Document/elementFromPoint
 *  https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate
 *
 *  https://www.cnblogs.com/hushaojun/p/6651491.html
 *
 */


// var data = {
//     '//*[@id="u4384_text"]/p/span': "111",
//     '//*[@id="u3857_text"]/p/span': 'xxxx',
//     '//*[@id="u6328_text"]/p[1]/span[1]': 'oma.onen demo'
// };
var data = {};

//获取xpath
function readXPath(element) {
    if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
        return '//*[@id=\"' + element.id + '\"]';
    }
    //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
    if (element === document.body) {//递归到body处，结束递归
        return '/html/' + element.tagName.toLowerCase();
    }
    var ix = 1,//在nodelist中的位置，且每次点击初始化
        siblings = element.parentNode.childNodes;//同级的子元素

    for (var i = 0, l = siblings.length; i < l; i++) {
        var sibling = siblings[i];
        //如果这个元素是siblings数组中的元素，则执行递归操作
        if (sibling === element) {
            return arguments.callee(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
            //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
        } else if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}

function createPickDomMask() {
    console.log("create pick dom mask")
    var div = document.createElement("div");
    div.setAttribute("id", "ceph-mask")
    div.setAttribute("class", "ceph-mask")
    var close = document.createElement("span");
    close.setAttribute("class", "ceph-mask-close");
    close.onclick = function (event) {
        console.log("close mask...")
        event.stopPropagation();
        this.parentNode.style.display = 'none';
    }
    div.appendChild(close)
    div.onclick = function (event) {
        this.style.display = "none";
        openCommentInformationWin(event.clientX, event.clientY)
        this.style.display = "block";
    }
    document.body.appendChild(div);
}


function openCommentInformationWin(x, y) {
    var dom = document.elementFromPoint(x, y);
    if (dom == null) {
        return;
    }
    dom.classList.add("ceph-dom-selected")
    setTimeout(function () {
        dom.classList.remove("ceph-dom-selected")
    }, 500)

    var xpath = readXPath(dom);
    console.log(xpath)
    setComment(xpath, data[xpath])

    var scrollTop = document.documentElement.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft;
    var maxWidth = document.body.scrollWidth;
    var maxHeight = document.body.scrollHeight;
    console.log("max:" + maxWidth + ":" + maxHeight)
    console.log("scroll:" + scrollLeft + ":" + scrollTop);
    var winTop = scrollTop + y > maxHeight - 400 ? maxHeight - 400 : scrollTop + y;
    var winLeft = scrollLeft + x > maxWidth - 400 ? maxWidth - 400 : scrollLeft + x;

    var win = document.getElementById("ceph-window");
    win.style.top = winTop + "px";
    win.style.left = winLeft + "px";
    win.style.display = 'block';
}

function setComment(path, value) {
    console.log("set comment", path, value)
    var inputPath = '//*[@id="ceph-window"]/div[2]/input';
    var input = document.evaluate(inputPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    input.value = path || '';
    var textareaPath = '//*[@id="ceph-window"]/div[2]/textarea';
    var textarea = document.evaluate(textareaPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    textarea.value = value || '';
}

function saveComment() {
    console.log("save comment===============")
    var inputPath = '//*[@id="ceph-window"]/div[2]/input';
    var input = document.evaluate(inputPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var textareaPath = '//*[@id="ceph-window"]/div[2]/textarea';
    var textarea = document.evaluate(textareaPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var xpath = input.value;
    var comment = textarea.value;
    if (!xpath || '' === xpath) {
        document.getElementById("ceph-window").style.display = "none";
        return
    }
    showCommentByXpath(xpath, comment)
    notifyBgAndPopup({"event": "addDomComment", "data": data}, null)
    if (!comment || '' === comment) {
        delete data[xpath]
    }
    data[xpath] = comment;
    document.getElementById("ceph-window").style.display = "none";
    console.log(data)

    notifyBgAndPopup({"event": "add-dom-comment", "data": {"xpath": xpath, "comment": comment}}, null);

}

function createCommentWindow() {
    var win = document.createElement("div");
    win.setAttribute("id", "ceph-window")
    win.setAttribute("class", "ceph-window");

    var title = document.createElement("div");
    title.setAttribute("class", "ceph-wind-title");

    var titleText = document.createElement("span");
    titleText.innerHTML = "comment add";

    title.appendChild(titleText);

    var close = document.createElement("span");
    close.setAttribute("class", "ceph-wind-close");
    close.onclick = function () {
        document.getElementById("ceph-window").style.display = "none";
    }
    title.appendChild(close);

    var save = document.createElement("span");
    save.setAttribute("class", "ceph-wind-save");
    save.onclick = function () {
        saveComment()
    }
    title.appendChild(save);
    win.appendChild(title);

    var content = document.createElement("div");
    content.setAttribute("class", "ceph-wind-content");

    var textarea = document.createElement("textarea");
    var input = document.createElement('input');
    input.setAttribute("type", "hidden");
    content.appendChild(textarea);
    content.appendChild(input)

    win.appendChild(content);
    document.body.appendChild(win)
}

function showCommentByXpaths(param) {
    for (var xpath in param) {
        showCommentByXpath(xpath, param[xpath]);
    }
}

function showCommentByXpath(xpath, title) {
    var result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    console.log(`find dom by {}, result: {}`, xpath, result)
    if (!result) {
        return;
    }
    for (var i = 0; i < result.snapshotLength; i++) {
        var snapshotItem = result.snapshotItem(i)
        snapshotItem.title = title;
        snapshotItem.style.color = 'red';
    }
}

function toJSON(param) {
    try {
        return eval("(" + param + ")");
    } catch (ex) {
        console.log(ex)
    }
    return {};
}

function notifyBgAndPopup(message, callback) {
    chrome.runtime.sendMessage(message, function (response) {
        console.log('get response：' + response);
        if (callback) callback(response)
    });
}

document.addEventListener('DOMContentLoaded', function () {
    createPickDomMask();
    createCommentWindow();
    // setTimeout(function () {
    //     showCommentByXpaths(data)
    // }, 50)

    var url = document.location.href;
    notifyBgAndPopup({"event": "set-dom-uri", "url": url}, function (response) {
        showCommentByXpaths(response)
    })

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
            if (request.event === "start-dom-comment") {
                document.getElementById("ceph-mask").style.display = "block";
            }
            if (request.event === "show-dom-comment") {
                console.log(request)
                var datax = toJSON(request.data);
                console.log(datax);
                showCommentByXpaths(datax)
            }
            if (request.event === 'show-login') {
                var width = window.screen.width / 2 - 170;
                var height = window.screen.height / 2 - 240;
                var top = height > 0 ? height : 0;
                var left = width > 0 ? width : 0;
                var xxx = chrome.runtime.getURL("./login/login.html");
                window.open(xxx, 'window-name', 'height=480, width=340, top=' + top + ',left=' + left + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
            }

            sendResponse({"content": "response"});
        }
    );
});
