var serverUrl = "https://video.pullerits.com/";

var DEMO = {};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

DEMO.create_token = function(userName, role, callback) {

    var req = new XMLHttpRequest();
    var url = serverUrl + 'token';
    var body = {roomId: '569e6ba510b92a0743eb8b73', username: userName, role: role};

    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            callback(req.responseText);
        }
    };

    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(body));
};

DEMO.resizeVideos = function (local, remotes) {
    local.player.resize();
    for (var r in remotes) {
        if ((remotes[r].hasVideo() || remotes[r].hasScreen()) && remotes[r].showing) {
            remotes[r].player.resize();
        }
    }
};

window.onload = function () {
    var connect_user = function () {
        /*var my_name = Math.uuid(15);
        DEMO.init_demo(my_name); Moved to websocket_port.js */

        getWebsocketPort();
    };

    connect_user();
};