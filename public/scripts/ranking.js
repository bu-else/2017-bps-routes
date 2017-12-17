function retrieveData() {
    return firebase.database().ref('/submissions/').orderByChild('average').limitToLast(10).once('value').then(function(snapshot) {
        this.data = []
        snapshot.forEach(function(child) {
            if (child.child('average').val() === null) {
                return false
            }
            this.data.push(child.val())
        }.bind(this))
        return this.data;
    })
}

function renderRanking() {
    retrieveData().then(function(collection) {
        var dom = ''
        var ranking = 1
        collection.forEach(function(data) {
            var date = new Date()
            var readableDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
            dom += `<tr>
                        <th scope="row">${ranking++}</th>
                        <td>${(data.average / 1000).toFixed(2)}km</td>
                        <td>${readableDate}</td>
                        <td>
                            <a href="#">${data.displayName}</a>
                        </td>
                    </tr>`
        })
        var rankingBody = document.getElementById('ranking-body')
        rankingBody.innerHTML = dom
    })
}

window.onload = function() {
    setTimeout(function() {
        renderRanking()
    }, 1000)
}