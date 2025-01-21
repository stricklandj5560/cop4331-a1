class API {
    // todo: make sure this is production URL by the time we deploy.
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