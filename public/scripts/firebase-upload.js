// This function requires an instance of native File object
function uploadToDB(file) {
    return new Promise(function(resolve, reject) {
        if (!globalUser) {
            reject('Must be signed in to upload solution!')
        } else {
            var storageRef = firebase.storage().ref();
            var solutionRef = storageRef.child(`solutions/${globalUser.uid}/${file.name}`);
            solutionRef.put(file).then(function(snapshot) {
                resolve(`solutions/${globalUser.uid}/${file.name}`)
            }).catch(function(err) {
                reject(err)
            })
        }
    })
}