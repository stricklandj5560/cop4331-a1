// check to see if user exists.
function pageLoad() {
    let user = User.getInstance();

    // if a user is null, that means we don't have a login
    if (!user.isLoggedIn()) {
        console.log("User not logged in... redirection to login page.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById('welcome-header-lbl').innerHTML = "Welcome, " + user.getFirstName() + "!";
}

function logUserOut() {
    User.getInstance().logOut();
    window.location.href = "index.html";
}


function showDeleteConfirmation() {
    document.getElementById("deleteConfirmation").classList.remove("hidden");
}


function cancelDelete() {
    document.getElementById("deleteConfirmation").classList.add("hidden");
}

// delete contact goes here
async function deleteContact() {
    alert("Contact deleted!"); 
    cancelDelete(); 
}

//shows add contact form
function addContact() {
    document.getElementById("addContactForm").classList.remove("hidden");
    document.getElementById("contactContainer").classList.add("hidden");
}


function cancelAddContact() {
    document.getElementById("addContactForm").classList.add("hidden");
    document.getElementById("contactContainer").classList.remove("hidden");
}

function emailKeyTyped() {
    const email      = document.getElementById("newEmail").value;
    const emailError = document.getElementById("errorMessageEmail");
    if (isEmailFormatValid(email))
        emailError.style.display = "none";
    else
        emailError.style.display = "inline";
        
}

function phoneKeyTyped() {
    const phone      = document.getElementById("newPhone").value;
    const phoneError = document.getElementById("errorMessagePhone");
    if (isValidPhoneNumber(phone))
        phoneError.style.display = "none";
    else
        phoneError.style.display = "inline";
}

function isEmailFormatValid(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);  
}

function isValidPhoneNumber(phone) {
    const regex = /^\d{3}-\d{3}-\d{4}$/;
    return regex.test(phone);
  }

/**
 * Adds a new contact to a user.
 * @returns Nothing
 */
async function saveNewContact() {
    const firstName = document.getElementById("newFirstName").value;
    const lastName = document.getElementById("newLastName").value;
    const phone = document.getElementById("newPhone").value;
    const email = document.getElementById("newEmail").value;

    
    if (!firstName || !lastName || !phone || !email) {
        alert("Please fill in all fields.");
        return;
    }


    const result = User.getInstance().addContact(firstName,lastName,phone,email);
    if (result) {
        console.log("Added contact")
    } else {
        console.error("Unable to add contact!")
    }
    //add searching for contact
}


const contactCodeBlock = (contact) => {
    return "<p>"+ contact['FirstName'] + "</p>"
}

/**
 * Searches a user's contacts.
 */
async function searchContact() {
    const search = document.getElementById("searchInput").value;
    if (search === '')
        return;
    await User.getInstance().searchContacts(search).then((res) => {
        if (res === null)
            return;
        if (res.error != '')
            return;
        const contactList = res.results;
        const table = document.getElementById("loadedContacts");
        let codeBlock = "";
        for(var i = 0; i < contactList.length; i++) {
            const contact = contactList[i];
            codeBlock += contactCodeBlock(contact);
         }
         table.innerHTML = codeBlock;
    });
}
