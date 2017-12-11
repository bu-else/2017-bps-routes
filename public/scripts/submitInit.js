// initialization functions should be put in here
window.onload = function() {
    upload.init()
    routeMap.init()
    spinner.init()
    workbookProcessor.init()

    var save = document.getElementById('save').addEventListener('click', function(e) {
        var file = window.globalFile
        uploadToDB(file).then(function(msg) {
            showModal('Successfully uploaded ' + file.name)
        }).catch(function(err) {
            showModal(err)
        })
    })
}