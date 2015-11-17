var lastTime = $.now();

$(function(){
    jenkins.init();
    
    // replace popup event
    if (jenkins.url == "") {
        chrome.browserAction.setPopup({popup : "options.html"});    
        return;
    }

    function fetch() {
        console.log(jenkins.apiUrl());
        $.getJSON(jenkins.apiUrl(), function(json, result) {
            var currentTime = $.now();
            if (result != "success") {
                return;
            }

            var failedCount = 0;
            var jobs = json['jobs'];

            jobs = jenkins.fetchJobs(jobs);

            for (var i = 0; i < jobs.length; i++) {
                if (jobs[i].lastCompletedBuild == null) continue;

                var build = jobs[i].lastCompletedBuild
                if (build.result == "FAILURE") {
                    failedCount++;    
                }

                if (lastTime < build.timestamp && build.timestamp < currentTime) {
                    var option = {
                        type: 'basic',
                        title: build.fullDisplayName + " (" + build.result + ")",
                        message : build.actions[0].causes[0].shortDescription,
                        iconUrl: jenkins.getIcon(build.result)
                    };
                    chrome.notifications.create("", option, function (id) { /* Do nothing */ });
                }
            }
            
            jobs = jenkins.sortJobs(jobs);
            if (failedCount > 0) {
                chrome.browserAction.setBadgeText({text: String(failedCount)});
                chrome.browserAction.setBadgeBackgroundColor({color: jenkins.getColor("FAILURE")});
            } else {
                chrome.browserAction.setBadgeText({text: "Good"});
                chrome.browserAction.setBadgeBackgroundColor({color: jenkins.getColor("SUCCESS")});
            }

        });
    }

    var retryTime = 2500;
    
    fetch(); // first fetch
    setInterval(function() {
        fetch();
    }, POLLING_TIME);

});
