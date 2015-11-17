var JOB = "job/";
var BUILD_NUMBER = "lastBuild";
var API_SUB  = "api/json";
var DEPTH="?depth=2&tree=jobs[displayName,buildable,lastCompletedBuild[number,timestamp,result,url,duration,actions,fullDisplayName]]";
var POLLING_TIME = 60 * 1000;

var jenkins = {
    url: localStorage["jenkins-url"],
    apiUrl: function() {
        var url = localStorage["jenkins-url"];
        var lastChar = url.substring(url.length - 1);
        if (lastChar != "/") {
            url += "/";
        }
        return url + API_SUB + DEPTH;
    },
    init: function () {
        var username = localStorage["username"] || "";
        var password = localStorage["password"] || "";
        $.ajaxSetup({
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus);
                console.log(errorThrown);
                var option = {
                    type: 'basic',
                    title: "Failed to access to Jenkins",
                    iconUrl: jenkins.getIcon("FAILURE"),
                    message : jenkins.apiUrl()
                };
                chrome.notifications.create("", option, function (id) { /* Do nothing */ });
            },
            beforeSend: function(xhr) {
                var credentials = window.btoa(username + ":" + password);
                xhr.setRequestHeader("Authorization", "Basic " + credentials);
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
    },

    sortJobs: function(jobs) {
        jobs.sort(function(a, b) {
            if (a.lastCompletedBuild == null || b.lastCompletedBuild == null) return 1000;
            return b['lastCompletedBuild']['timestamp'] - a['lastCompletedBuild']['timestamp'];
        });
        return jobs;
    },

    fetchJobs: function(jobs) {
        var ptns = localStorage['job-name-ptn'];
        ptns = ptns.split(" ");
        
        var views = localStorage['job-views'];
        views = views.split(" ");

        var selectedJobs = [];
        for (var i = 0; i < jobs.length; i++) {
            for (var p = 0; p < ptns.length; p++) {
                 if (jobs[i].displayName.indexOf(ptns[p]) != -1) {
                    selectedJobs.push(jobs[i]);
                    break;
                 }
            }

        }
        return selectedJobs;
    }
};



