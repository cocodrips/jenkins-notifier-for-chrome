jenkins.init();
console.log(jenkins.apiUrl());

$.getJSON(jenkins.apiUrl(), function(json, result) {
    var currentTime = $.now();
    var jobs = json['jobs'];

    jobs = jenkins.sortJobs(jobs);
    jobs = jenkins.fetchJobs(jobs);

    for (var i = 0; i < jobs.length; i++) {
        if (jobs[i].lastCompletedBuild == null) continue;
        var build = jobs[i].lastCompletedBuild;
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
