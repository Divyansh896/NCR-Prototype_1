const user = JSON.parse(sessionStorage.getItem("currentUser"));
const ncrNo = localStorage.getItem('ncrNo')
const addEmp = document.getElementById("add");
const empID = document.getElementById("empId");
const email = document.getElementById("email");
const fName = document.getElementById("firstName");
const lName = document.getElementById("lastName");
const dob = document.getElementById("dob");
const pass = document.getElementById("password");
const dept = document.getElementById("department");
const notificationlist = document.getElementById('notification-list');
const notificationCount = document.getElementById('notification-count');
const ncrLink = document.querySelector('a[aria-label="Create a new Non-Conformance Report"]');
if (ncrLink && user.role == "QA Inspector") {
    ncrLink.href = `create_NCR.html?ncr_no=${ncrNo}`;
}
const modal = document.getElementById("popup")
const span = document.getElementById("closePopup")
setNotificationText()
document.getElementById("clear").addEventListener("click", function () {
    document.querySelector("form").reset();
});

function showPopup(title, message, icon, callback) {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.querySelector('h2').innerText = title; // Set the title
    modalContent.querySelector('p').innerText = message; // Set the message

    const iconDiv = document.querySelector('.icon');
    // Clear previous icons
    iconDiv.innerHTML = '';
    const imgElement = document.createElement('img');
    imgElement.src = icon; // Replace with your image URL
    iconDiv.appendChild(imgElement);

    modal.style.display = "block"; // Show the modal

    setTimeout(() => {
        modalContent.style.opacity = "1"; // Fade in effect
        modalContent.style.transform = "translate(-50%, -50%)"; // Ensure it's centered
    }, 10); // Short timeout to ensure the transition applies

    // Define the close function
    const closeModal = () => {
        modalContent.style.opacity = "0"; // Fade out effect
        modalContent.style.transform = "translate(-50%, -60%)"; // Adjust position for effect
        setTimeout(() => {
            modal.style.display = "none"; // Hide the modal after transition
            callback(); // Execute the callback after closing the modal
        }, 500); // Wait for the transition to finish before hiding
    };

    // Close modal when <span> (x) is clicked
    span.onclick = closeModal;

    // Close modal when clicking outside of it
    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };
}

addEmp.addEventListener("click", (e) => {
    e.preventDefault();

    // Get the current value of empID inside the event listener

    if (empID.value == "" || email.value == "" || fName.value == "" || lName.value == "" || dob.value == "" || pass.value =="" || dept.value == ""  ) {
        showPopup('Required field missing','All the fields are required and can not be empty', 'images/1382678.webp');
        empID.nextElementSibling.style.display = "block"
        empID.nextElementSibling.textContent = "Employee ID is required !"

        email.nextElementSibling.style.display = "block"
        email.nextElementSibling.textContent = "Email Address is required !"

        fName.nextElementSibling.style.display = "block"
        fName.nextElementSibling.textContent = "First Name is required !"

        lName.nextElementSibling.style.display = "block"
        lName.nextElementSibling.textContent = "Last Name is required !"

        dob.nextElementSibling.style.display = "block"
        dob.nextElementSibling.textContent = "Date Of Birth is required !"

        pass.nextElementSibling.style.display = "block"
        pass.nextElementSibling.textContent = "Password is required !"

        dept.nextElementSibling.style.display = "block"
        dept.nextElementSibling.textContent = "Department is required please select one !"

    } else if (empID.value.length > 4) {
        showPopup('Required field missing','Employee ID cannot be greater than 4 digits', 'images/1382678.webp');
        empID.nextElementSibling.style.display = "block"
        empID.nextElementSibling.textContent = "Employee ID cannot be greater than 4 digits"

    }else if (empID.value.length < 4) {
        showPopup('Required field missing','Employee ID cannot be less than 4', 'images/1382678.webp');
        empID.nextElementSibling.style.display = "block"
        empID.nextElementSibling.textContent = "Employee ID cannot be less than 4 digits"

    }else if(!email.value.includes("@crossfire.ca" )){
        showPopup('Required field missing','Email is not valid','images/1382678.webp');
        email.nextElementSibling.style.display = "block"
        email.nextElementSibling.textContent = "Email Address must follow the same pattern"

    }else{
        showPopup('Confirmation','Employee Added successfully','images/confirmationIcon.webp');

    }
    
});
function clearErrorMessage(inputField) {
    const errorMessage = inputField.nextElementSibling; // Select the corresponding error message
    if (inputField.value.trim() !== "") { // Check if the input is not empty
        errorMessage.style.display = "none"; // Hide the error message
        errorMessage.textContent = ""; // Clear the error message content
    }
}

// Attach input event listeners to all fields
[empID, email, fName, lName, dob, pass, dept].forEach((field) => {
    field.addEventListener("input", () => clearErrorMessage(field));
});


function openTools() {
    document.querySelector(".tools-container").classList.toggle("show-tools");

}

function setNotificationText() {
    // Retrieve and parse notifications from localStorage
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    // Set the notification count
    const count = document.getElementById('notification-count');
    count.innerHTML = notifications.length;

    // Clear any existing notifications in the list to avoid duplicates
    const notificationList = document.getElementById('notification-list'); // Ensure this element exists in your HTML
    notificationList.innerHTML = ''; // Clear existing list items

    // Append each notification as an <li> element
    notifications.forEach(notificationText => {
        const li = document.createElement('li');
        if(user.role == 'Lead Engineer'){

            if (notificationText.includes('Engineering')) {
                // engineering department person get the mail from qa (will show review and begin work)
                li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>Please review and begin work as assigned.`;
            } else {
                // engineering department person sends the form to purchasing (will show has been sent to purchasing department)
                li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>${notificationText.slice(17)}`;
            }
        }
        else{
            li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>${notificationText.slice(17)}`;

        }
        

        notificationList.prepend(li);
    });
}

if (user && user.role) {
    // Update the Create NCR link based on user role
    function updateNCRLink() {
        var ncrLink = document.querySelector('a[aria-label="Create a new Non-Conformance Report"]')

        if (ncrLink) { // Ensure ncrLink exists
            if (user.role === "Lead Engineer" || user.role === "Purchasing") {
                // Change to "Logged NCR" for lead engineers and purchasing roles
                ncrLink.href = `current_NCR.html`
                ncrLink.innerHTML = '<i class="fa fa-sign-in"></i>Current NCR'
                ncrLink.setAttribute("aria-label", "View logged Non-Conformance Reports")
            }
        } else {
            console.warn('Link with aria-label "Create a new Non-Conformance Report" not found.')
        }
    }

    updateNCRLink()
} else {
    console.warn("User data not found in sessionStorage or missing role.")
}

function logout() {
    localStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('breadcrumbTrail')
    location.replace('index.html')
}

function updateToolContent(){
    const toolsContainer = document.querySelector('.tools')
    const emp = document.getElementById('add-emp')
    const supplier = document.getElementById('add-sup')
    if(user.role == "QA Inspector"){
        emp.style.display= 'none'
    }
    else if(user.role == "Lead Engineer" || user.role == "Purchasing"){
        toolsContainer.style.display = 'none'
    }
}

updateToolContent()
function toggleSettings() {
    var settingsBox = document.getElementById("settings-box")
    if (settingsBox.style.display === "none" || settingsBox.style.display === "") {
        settingsBox.style.display = "block"
    } else {
        settingsBox.style.display = "none"
    }
}

function toggleNotifications() {
    var notificationBox = document.getElementById("notification-box")
    if (notificationBox.style.display === "none" || notificationBox.style.display === "") {
        notificationBox.style.display = "block"
    } else {
        notificationBox.style.display = "none"
    }
}
function openTools() {
    document.querySelector(".tools-container").classList.toggle("show-tools");

}

document.addEventListener("click", function (event) {
    var notificationBox = document.getElementById("notification-box")
    var iconBadge = document.querySelector(".icon-badge")
    var settingsBox = document.getElementById("settings-box")
    var settingsButton = document.getElementById("settings")

    if (!notificationBox.contains(event.target) && !iconBadge.contains(event.target)) {
        notificationBox.style.display = "none"
    }


    if (!settingsBox.contains(event.target) && !settingsButton.contains(event.target)) {
        settingsBox.style.display = "none"
    }
})
