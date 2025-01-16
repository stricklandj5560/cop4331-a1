// import {API} from './api.js';
// import {User} from './models/user.js';

const toggleSignType = () => {
    const formBlock = document.querySelector('.auth-block');
    if (formBlock == undefined) {
        throw Error("Something went wrong");
    }

    formBlock.classList.toggle('sign-in-type');
}

const signIn = () => {
    const username = document.querySelector("#sign-in-username").value;
    // TODO: hash the password
    const password = document.querySelector("#sign-in-password").value;
    const incorrectUNPWlbl = document.querySelector('#un-pw-incorr-lbl');
   
    try {
        console.log("Signing in...");

        // Call the API to log in
        API.login(username, password).then((res) => {
            if (res.error === '') {
                console.log("Login successful.");
                alert('User ID: ' + res.id)
            // show error label.
            } else {
                incorrectUNPWlbl.style.display = 'inline';
            }
        })

    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred during login. Please try again.");
    }
}

const signUp = () => {
    const firstname = document.querySelector("#firstname").value;
    const lastname = document.querySelector("#lastname").value;
    const username = document.querySelector("#sign-up-username").value;
    // TODO: hash the password
    const password = document.querySelector("#sign-up-password").value;
    
    // TODO: connect the api
    alert(`Firstname: ${firstname}\nLastname: ${lastname}\nUsername: ${username}\nPassword: ${password}`);
}

class API {
    static BASE_API_URL = 'http://answerstopoosfinal.online/dev/LAMPAPI/';

    static async login(username, password) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            let apiurl = API.BASE_API_URL + "Login.php";
            const body = {
                "login": username,
                "password": password
            };
            request.open("POST", apiurl);
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify(body));
            // get that response
            request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                    resolve(JSON.parse(request.responseText));
                } else {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                }
            };
            request.onerror = () => {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            };
        });
    }
}