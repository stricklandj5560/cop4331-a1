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
   
    const hashedPassword = md5(password);

    try {
        console.log("Signing in...");

        // Call the API to log in
        API.login(username, hashedPassword).then((res) => {
            if (res.error === '') {
                console.log("Login successful.");
                alert('User ID: ' + res.id)

            //redirect to landing page
            window.location.href = "contacts.html";
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
    
    // hash password 
    const hashedPassword = md5(password);

    try {
        API.registerUser(firstname,lastname,username.toLowerCase(),hashedPassword).then((res) => {
            if (res.error === '') {
                // set
                document.querySelector('#sign-in-username').value = username;
                toggleSignType();
            } else {
                alert(res.error);
            }
        })
    } catch (error) {
        console.log("Uknown error when attempting to call sign up API");
    }
}