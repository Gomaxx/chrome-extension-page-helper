function login() {
    var telephone = document.getElementById("telephone").value;
    var password = document.getElementById("password").value;

    if (!telephone || !password) {
        return;
    }
    fetch("http://localhost:8080/sign-in", {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        },
        body: "telephone=" + telephone + "&password=" + password
    }).then(response => response.json()).then(data => {
        chrome.storage.local.set({"token": data.data}, function () {
            var backgroundPage = chrome.extension.getBackgroundPage();
            backgroundPage.getProjects();
        });
        alert("xxxxx")
        window.close();
    }).catch(ex => console.log(ex));
}


document.addEventListener('DOMContentLoaded', function () {
    // fetch("https://www.haier.com/").then(response => {
    //     console.log(response.text())
    // })

    document.getElementById("ceph-login").onclick = function () {
        login();
    }

});