// This function requires an instance of native File object
function upload_to_db(file) {
    if (!globalUser) {
        throw 'Must be signed in to upload solution!'
    } else {
        var storageRef = firebase.storage().ref();
        var solutionRef = storageRef.child(`solutions/${globalUser.uid}/${file.name}`);
        solutionRef.put(file).then(function(snapshot) {
            console.log(`uploaded ${file.name}`)
        });
    }
}