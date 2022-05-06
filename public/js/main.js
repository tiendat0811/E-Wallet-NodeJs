//------------------REGISTER------------------
const firebaseConfig = {
    apiKey: "AIzaSyAE3iSUktZd7j0f9QFVggfBC8VUULeQUlk",
    authDomain: "ewallet-15217.firebaseapp.com",
    projectId: "ewallet-15217",
    storageBucket: "ewallet-15217.appspot.com",
    messagingSenderId: "262381671989",
    appId: "1:262381671989:web:30550658b1e455f829c37c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function register() {
    const user = {
        'phone': $('#phone').val(),
        'email': $('#email').val(),
        'fullname': $('#fullname').val(),
        'address': $('#address').val(),
        'birthday': $('#birthday').val(),
        'cmndfront': '',
        'cmndback': ''
    }

    const ref = firebase.storage().ref();
    //cmnd truoc
    const cmndfront = document.querySelector("#cmndfront").files[0];
    const cmndback = document.querySelector("#cmndback").files[0];


    if (cmndfront == null || cmndback == null) {
        //console.log("chua nhap anh CMND")
        $.ajax({
            url: '/auth/register',
            type: 'post',
            data: {
                user: user
            }
        }).then(data => {
            if (data.success) {
                alert(data.msg)
                window.location.href = '/auth/login';
            }
            else {
                alert(data.msg)
            }
        })
    } else {
        const cmndfrontName = +new Date() + "-" + cmndfront.name;
        const cmndfrontMetadata = {
            contentType: cmndfront.type
        };
        const cmndbackName = +new Date() + "-" + cmndback.name;
        const cmndbackMetadata = {
            contentType: cmndback.type
        };



        const task1 = ref.child(cmndfrontName).put(cmndfront, cmndfrontMetadata);
        //cmnd sau
        const task2 = ref.child(cmndbackName).put(cmndback, cmndbackMetadata);




        //run task
        task1
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                //console.log(`front: ${url}`)
                task2
                    .then(snapshot => snapshot.ref.getDownloadURL())
                    .then(url2 => {
                        // console.log(`front: ${url}`)
                        // console.log(`back: ${url2}`)
                        user.cmndfront = url
                        user.cmndback = url2
                        $.ajax({
                            url: '/auth/register',
                            type: 'post',
                            data: {
                                user: user
                            }
                        }).then(data => {
                            if (data.success) {
                                alert(data.msg)
                                window.location.href = '/auth/login';
                            }
                            else {
                                alert(data.msg)
                            }
                        })
                    })
                    .catch(console.error);
            })
            .catch(console.error);
    }

}
//------------------REGISTER END------------------

//------------------LOGIN------------------
function login() {
    $.ajax({
        url: '/auth/login',
        type: 'post',
        data: {
            username: $('#username').val(),
            password: $('#password').val(),
        }
    }
    ).then(data => {
        if (data.success) {
            alert(data.msg)
            setCookie('token', data.token, 1);
            window.location.href = "/"
        } else {
            alert(data.msg)
            window.location.href = "/"
        }

    }).catch(err => {
        console.log(err)
    })
}

//Get Set cookies
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function logout() {
    $.ajax({
        url: '/auth/logout',
        type: 'post',
    }
    ).then(data => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/"
    }).catch(err => {
        console.log(err)
    })
}
//------------------LOGIN END------------------

//------------------FIRST LOGIN_CHANGE PASSWORD------------------
function changePassword(username) {
    const password = $('#password').val();
    const password2 = $('#password2').val();
    if (password != password2 && (password != null && password2 != null)) {
        alert("Your passwords not match!!! Please enter again!")
    } else {
        $.ajax({
            url: '/auth/changePassword',
            type: 'post',
            data: {
                password: password,
                username: username
            }
        }
        ).then(data => {
            if (data.success) {
                alert(data.msg)
                setTimeout(function () {
                    //your code to be executed after 1 second
                }, 1000);
                window.location.href = "/"
            } else {
                alert(data.msg)
            }

        }).catch(err => {
            console.log(err)
        })
    }
}

//------------------FIRST LOGIN_CHANGE PASSWORD END------------------