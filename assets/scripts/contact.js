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
    User.getInstance().signOut();
}


function cancelAddContact() {
    document.getElementById("addContactForm").classList.add("hidden");
    document.getElementById("contactContainer").classList.remove("hidden");
}

//saving a new contact
async function saveNewContact() {
    const firstName = document.getElementById("newFirstName").value;
    const lastName = document.getElementById("newLastName").value;
    const phone = document.getElementById("newPhone").value;
    const email = document.getElementById("newEmail").value;

    
    if (!firstName || !lastName || !phone || !email) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        console.log("Sending request to add contact with data:", {
            firstName,
            lastName,
            phone,
            email,
        });

        const response = await API.addContact(firstName, lastName, phone, email);

        console.log("API response:", response);

        if (response && response.success) {
            alert("Contact added successfully!");
            cancelAddContact(); 
        } else {
            alert("Failed to add contact. Please try again.");
        }
    } catch (error) {
        console.error("Error adding contact:", error);
        alert("An error occurred while adding the contact. Check console for details.");
    }

    //add searching for contact
}



