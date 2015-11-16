var JOB = "job/";
var BUILD_NUMBER = "lastBuild";
var API_SUB  = "/api/json";
var DEPTH="?depth=2";
var POLLING_TIME = 20 * 1000;

var jenkins = {
    url: localStorage["jenkins-url"],
    apiUrl: function() {
        var url = localStorage["jenkins-url"];
        var lastChar = url.substring(url.length - 1);
        if (lastChar != "/") {
            return url + "/";
        }
        return url + API_SUB + DEPTH;
    },
    init: function () {
        $.ajaxSetup({
            "error": function() {
                var option = {
                    type: 'basic',
                    title: "Failed to access to Jenkins",
                    iconUrl: getIcon("FAILURE"),
                    message : apiUrl
                };
                chrome.notifications.create("", option, function (id) { /* Do nothing */ });
            }
        });

    },
    getIcon: function(result) {
        var url = "images/blue.png";
        if (result == "UNSTABLE") {
            url = "images/yellow.png";
        } else if (result == "FAILURE") {
            url = "images/red.png";
        } else if (result == "ABORTED") {
            url = "images/grey.png";
        }
        return url;
    },

    getColor: function(result) {
        var color = [0, 0, 255, 200];
        if (result == "UNSTABLE") {
            color =  [255, 255, 0, 200];
        } else if (result == "FAILURE") {
            color = [255, 0, 0, 200];
        } else if (result == "ABORTED") {
            color = [200, 200, 200, 200];
        }
        return color;
    }
};
