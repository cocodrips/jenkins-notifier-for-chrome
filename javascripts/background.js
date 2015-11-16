var lastTime = $.now();

$(function(){
    jenkins.init();
    
    // replace popup event
    //chrome.browserAction.setPopup({popup : ""});
    //chrome.browserAction.onClicked.addListener(function(tab) {
    //    window.open(jenkins.url);
    //});

    function fetch() {
        $.getJSON(jenkins.apiUrl(), function(json, result) {
            var currentTime = $.now();
            if (result != "success") {
                return;
            }

            var failedCount = 0;
            var jobs = json['jobs'];

            for (var i = 0; i < jobs.length; i++) {
                if (jobs[i].builds[0].result == "FAILURE") {
                    failedCount++;    
                }
                
                var jobTimeStamp = jobs[i]['lastCompletedBuild']['timestamp'];
                if (lastTime < jobTimeStamp && jobTimeStamp < currentTime) {
                    var build = jobs[i].builds[0];
                    var option = {
                        type: 'basic',
                        title: build.fullDisplayName + " (" + build.result + ")",
                        message : build.actions[0].causes[0].shortDescription,
                        iconUrl: jenkins.getIcon(build.result)
                    };
                    chrome.notifications.create("", option, function (id) { /* Do nothing */ });
                }
            }
            
            console.log(jobs);
            jobs.sort(function(a, b) {
                return b['lastCompletedBuild']['timestamp'] - a['lastCompletedBuild']['timestamp'];
            });

            chrome.browserAction.setBadgeText({text: String(failedCount)});
            chrome.browserAction.setBadgeBackgroundColor({color: jenkins.getColor("blue")});
        });
    }

    var retryTime = 2500;
    
    fetch(); // first fetch
    setInterval(function() {
        fetch();
    }, POLLING_TIME);

});
