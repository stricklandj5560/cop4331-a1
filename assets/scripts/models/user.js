class User {
    
    // singleton declaration
    static #singleton = null;
    
    // instance variables.
    #firstName    = null;
    #lastName     = null;
    #id           = null;
    #userLoggedIn = false;

    static getInstance() {
        if (User.#singleton === null)
            User.#singleton = new User(sessionStorage.getItem('user'));

        return User.#singleton;
    }

    constructor(jsonStrObj) {
        // check if user is valid.
        if (jsonStrObj === null || jsonStrObj === '') 
            return;

        let jsonParsed = JSON.parse(jsonStrObj);

        this.#userLoggedIn  = true;
        this.#id            = jsonParsed['id']
        this.#firstName     = jsonParsed['firstName'];
        this.#lastName      = jsonParsed['lastName'];
    }

    /**
     * User first name getter.
     * @returns User's first name.
     */
    getFirstName() {
        return this.#firstName;
    }

    /**
     * User's last name getter.
     * @returns User's last name.
     */
    getLastName() {
        return this.#lastName;
    }

    /**
     * Concatinates user's fist and last name.
     * @returns User's first name and last name.
     */
    getFullName() {
        return this.#firstName + ' ' + this.#lastName;
    }

    /**
     * User's ID getter.
     * @returns User's ID
     */
    getID() {
        return this.#id;
    }

    /**
     * Checks to see if the user is logged in.
     * @returns Returns true if user is logged in.
     */
    isLoggedIn() {
        return this.#userLoggedIn;
    }

    /**
     * Logs out the user.
     */
    logOut() {

        this.#firstName     = null;
        this.#lastName      = null;
        this.#id            = null;
        this.#userLoggedIn  = false;

        let user = sessionStorage.getItem('user');
        if (user === null || user === '');
            sessionStorage.setItem('user', '');
    }
}