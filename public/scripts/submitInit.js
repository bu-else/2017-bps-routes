// initialization functions should be put in here
window.onload = function() {
    upload.init()
    routeMap.init()
    spinner.init()
    workbookProcessor.init()

    var save = document.getElementById('save').addEventListener('click', function(e) {
        var file = window.globalFile
        uploadToDB(file).then(function(ref) {
            var score = window.score
            var submissionData = {
                displayName: window.globalUser.displayName,
                uid: window.globalUser.uid,
                timestamp: Date.now(),
                average: score.avg,
                max: score.max,
                ref: ref,
            };
            var newSubmissionKey = firebase.database().ref().child('submissions').push().key
            firebase.database().ref('submissions/' + newSubmissionKey).set(submissionData)
        }).then(function() {
            showModal('Successfully uploaded ' + file.name)
        }).catch(function(err) {
            showModal(err)
        })
    })
}