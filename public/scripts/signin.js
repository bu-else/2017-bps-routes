// Initialize Firebase
const config = {
    apiKey: "AIzaSyD_tyvYrbaoXMATNTJv5mx22C9_n5VbwG4",
    authDomain: "bps-bus.firebaseapp.com",
    databaseURL: "https://bps-bus.firebaseio.com",
    projectId: "bps-bus",
    storageBucket: "",
    messagingSenderId: "480595233088"
};
firebase.initializeApp(config);


let globalUser = null;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in
        console.log("User is signed in");
        globalUser = user;
        dispSigninBtn.loggedIn = true;
        console.log(user);
        appLogin.name = user.displayName;
        appLogin.profilePic = user.photoURL;
        appLogin.email = user.email;
    }
});


/** Login
 *  This function will be execute when user click on the login button.
 *  Run through the login flow from Firebase.
 */
const login = () => {
    if (globalUser) {
        // User is signed in
        console.log("User is signed in");
        return globalUser;
    } else {
        let provider = new firebase.auth.GithubAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }
};

const appLogin = new Vue(
    {
        el: "#login-text",
        data: {
            name: "",
            profilePic: "",
            email: "",
        }
    }
);

const dispSigninBtn = new Vue(
    {
        el: "#login-btn",
        data: {
            loggedIn: false
        }
    }
);