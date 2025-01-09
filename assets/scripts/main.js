
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

    // TODO: connect the api
    alert(`Username: ${username}\nPassword: ${password}`);
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