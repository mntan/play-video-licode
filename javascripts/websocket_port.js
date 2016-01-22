
var websocketPort = 8080;
var init_callback = null;

var testResults = {};
var testFinished = {};
var errors = [];
var interval_id;
var ws_available = false;
var ws_version = '';

function randomString(string_length) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}

function test_ws(port, secure) {
    var res_key;
    var stream_cnt = 0;
    var url;
    if (secure) {
        url = "wss://wss.websocketstest.com:"+port+"/service";
        res_key = 's'+port;
    }
    else {
        url = "ws://ws.websocketstest.com:"+port+"/service";
        res_key = port;
    }
    testResults[res_key] = {"connected" : false, "send" : false, "receive" : false, "echo" : false};
    testFinished[res_key] = false;
    var ws;
    if ("WebSocket" in window) {
        ws = new WebSocket(url);
    }
    else if ("MozWebSocket" in window) {
        ws = new MozWebSocket(url);
    }
    var title;
    if (secure) {
        title = 'WebSockets (Port '+port+', SSL)';
    } else {
        title = 'WebSockets (Port '+port+')';
    }

    ws.onopen = function() {
        // Web Socket is connected. You can send data by send() method
        testResults[res_key]["connected"] = true;
        testFinished[res_key] = true;
    };
    ws.onerror = function() {
        console.log('connection error');
        if (testFinished[res_key] == false) {
            errors.push(res_key);
            testFinished[res_key] = true;
        }
    };
    ws.onclose = function(data) {
        console.log('connection close');
        if (document.ws_version == 'hybi-draft-07') {
            if (testResults[res_key]["fragments"] == undefined) {
                testResults[res_key]["fragments"] = false;
            }
        }
        if (testFinished[res_key] == false) {
            errors.push(res_key);
            testFinished[res_key] = true;
        }
    };
}

function check_finished_ws() {
    var done = 0;
    var count = 0;
    for (test in testFinished) {
        if (testFinished[test] == true) {
            done = done + 1;
        }
        count = count + 1;
    }

    if (count > 0 && done == count) {
        // send results
        if (done && errors.length == 0 ){
            console.log("WebSockets seem to", "Work for You!");
            websocketPort = 443;
        }
        else if (done != errors.length){
            console.log("WebSockets", "Might Work for You!");
            websocketPort = 8080;
        }
        else {
            console.log("WebSockets seem to", "Not Work for you :(");
            websocketPort = 8080;
        }
        return true;
    }
    return false;
}

function check_finished() {
    if (("WebSocket" in window) || ("MozWebSocket" in window)) {
        ws_res  = check_finished_ws();
    }
    else {
        ws_res = false;
    }

    if (ws_res) {
        window.clearInterval(interval_id);
        console.log(websocketPort);

        var my_name = Math.uuid(15);
        DEMO.init_demo(my_name);
    }
}


function test_websocket() {
    if (("WebSocket" in window) || ("MozWebSocket" in window)) {
        ws_available = true;
        //final_status("Your browser supports WebSockets!", "Testing...")

        if (document.location.protocol == "http:"){
            test_ws(80, false);
            test_ws(443, false);
            test_ws(8080, false);
        }

        test_ws(443, true);
    } else {
        //final_status("Seems like your browser has", "No WebSockets");
    }
}


function getWebsocketPort(cb) {
    document.fragmentTest = randomString(512);
    test_websocket();
    interval_id = setInterval("check_finished()", 1000);

    init_callback = cb;
}
