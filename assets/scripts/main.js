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
    const username = document.querySelector("#sign-in-username").value.toLowerCase();
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
    }
}

const signUp = () => {
    const firstname = document.querySelector("#firstname").value;
    const lastname = document.querySelector("#lastname").value;
    const username = document.querySelector("#sign-up-username").value;
    // TODO: hash the password
    const password = document.querySelector("#sign-up-password").value;

    // check if anything is blank!
    if (firstname === '' || lastname === '' || username === '' || password === '')
        return;
    
    try {
        API.registerUser(firstname,lastname,username.toLowerCase(),password).then((res) => {
            if (res.error === '') {
                alert('Succesfully added user');
            } else {
                alert(res.error);
            }
        })
    } catch (error) {
        console.log("Uknown error when attempting to call sign up API");
    }
}

class API {
    static BASE_API_URL = 'http://answerstopoosfinal.online/dev/LAMPAPI/';

    /**
     * Function to make a basic post API call to a given endpoint.
     * @param {String} url API Url to post to
     * @param {Dict} body JSON Body 
     * @returns 
     */
    static async baseAPIPostCall(url, body) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open("POST", url);
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

    /**
     * Logs user in and returns user JSON object from API.
     * @param {String} username user's username
     * @param {String} password user's password
     * @returns JSON user object
     */
    static async login(username, password) {
       const body = {
        'login'   : username,
        'password': password
       }
       const url = this.BASE_API_URL + "Login.php";
       return this.baseAPIPostCall(url, body);
    }

    /**
     * Registers user
     * @param {*} firstName 
     * @param {*} lastName 
     * @param {*} userName 
     * @param {*} password 
     * @returns 
     */
    static async registerUser(firstName, lastName, userName, password) {
        const body = {
            'FirstName' : firstName,
            'LastName'  : lastName,
            'Login'     : userName,
            'Password'  : password
        };
        const url = this.BASE_API_URL + "AddUser.php";
        return this.baseAPIPostCall(url, body);
    }
}