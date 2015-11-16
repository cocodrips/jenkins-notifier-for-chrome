jenkins.init();

$.getJSON(jenkins.apiUrl(), function(json, result) {
    var currentTime = $.now();
    var jobs = json['jobs'];

    jobs.sort(function(a, b) {
        return b['lastCompletedBuild']['timestamp'] - a['lastCompletedBuild']['timestamp'];
    });

    for (var i = 0; i < jobs.length; i++) {
        var build = jobs[i].builds[0];
        console.log(build);
            $('.container').append("<div class='job'><img class='icon' src="+jenkins.getIcon(build.result)
                                +"> <div class='title'>" + build.fullDisplayName + "</div>"
                                + "<div class='time'>" + new Date(jobs[i].lastCompletedBuild.timestamp).toLocaleString()
                                + "</div></div>")

    }


    console.log(jobs);
    for (var i = 0; i < jobs.length; i++) {
        console.log(jobs[i].builds[0].fullDisplayName)
    }
    chrome.browserAction.setBadgeText({text: String(failedCount)});
    chrome.browserAction.setBadgeBackgroundColor({color: jenkins.getColor("blue")});
});
