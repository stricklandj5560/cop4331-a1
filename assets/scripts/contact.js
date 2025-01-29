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


function showDeleteConfirmation(userID) {
    toggleDeletePopUp(userID);
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
}


function cancelAddContact() {
    document.getElementById("addContactForm").classList.add("hidden");
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
        cancelAddContact();
        searchContact();
    } else {
        console.error("Unable to add contact!")
    }
}

function doToadSecret(id) {
    // toad is user id 0
    if (id != 0)
        return;
    
}

const contactCodeBlock = (contact) => {
    const firstName = contact["FirstName"];
    const lastName  = contact["LastName"];
    const phone     = contact["Phone"];
    const email     = contact["Email"];
    const UserID    = contact["UserID"];
    return `
    <div class="contact-card-wrapper">
        <div class="contact-card-container">
            <div class="contact-card">
                <div class="contact-avatar-container">
                    <img onClick="doToadSecret(` + UserID % 10 + `)" src="../img/contact_profile_` + UserID % 10 + `.png" alt="Contact Avatar" class="contact-avatar">
                </div>
                <div class="contact-info">
                    <div class="form-group">
                        <label>First Name:</label>
                        <input id="contactFirstName` + UserID + `" value="` + firstName + `" readonly value="">
                    </div>
                    <div class="form-group">
                        <label>Last Name:</label>
                        <input type="text" id="contactLastName` + UserID + `" value="` + lastName + `" readonly value="">
                    </div>
                    <div class="form-group">
                        <label>Phone:</label>
                        <input type="text" id="contactPhone` + UserID + `" value="` + phone + `" readonly value="">
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="text" id="contactEmail` + UserID + `" value="` + email + `" readonly value="">
                    </div>
                </div>
                <div class="contact-actions">
                    <button class="edit-btn" onclick="editContact(` + UserID + `)">✏️</button>
                    <button class="delete-btn" onclick="showDeleteConfirmation(` + UserID + `)">🗑️</button>
                </div>
            </div>
        </div>
    </div>`;
}

function editContact(index) {
    // todo
}



/**
 * Searches a user's contacts.
 */
async function searchContact() {
    const search = document.getElementById("searchInput").value;
    if (search === '') {
        // use paging!

        return;
    }
    await User.getInstance().searchContacts(search, 1).then((res) => {
        const contactList =(res === null || res.error != '') ? [] : res.results;
        const table = document.getElementById("loadedContacts");
        let codeBlock = "";
        for(var i = 0; i < contactList.length; i++) {
            const contact = contactList[i];
            codeBlock += contactCodeBlock(contact);
         }
         table.innerHTML = codeBlock;
    });

}

const toggleDeletePopUp = (userID) => {
    document.getElementById("delteContactBtn").setAttribute("userID",userID);
    const popup = document.querySelector(".delete-popup");
    if (popup == undefined) return;

    popup.classList.toggle('shown')
}


/**
 * Deletes contact.
 * @returns Nothing
 */
function deleteContact() {
    const userID = (document.getElementById("delteContactBtn").getAttribute("userID"));
    if (userID === '' || userID === -1)
        return;
    
    User.getInstance().deleteContact(userID).then((res) => {
        if (res.error === '') {
            console.log("Succesfully deleted contact with ID " + userID);
            return;
        } 
        console.error("Unable to delete contact with UserID " + userID + " error " + res.error);
    });
    
    toggleDeletePopUp(userID);
    searchContact()
}