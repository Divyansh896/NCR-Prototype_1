const user = JSON.parse(sessionStorage.getItem("currentUser"))

//geting all the inputs from html
const modal = document.getElementById("popup")
const span = document.getElementById("closePopup")
const starElements = document.querySelectorAll('.required');
let suppliername = document.getElementById("supplierName")
let country = document.getElementById("country")
let address = document.getElementById("address")
let city = document.getElementById("city")
let postalcode = document.getElementById("postalCode")
let contact = document.getElementById("contact")
let shippingmethod = document.getElementById("shippingMethod")
const notificationlist = document.getElementById('notification-list');
const notificationCount = document.getElementById('notification-count');
setNotificationText()
//All the validation of the add supplier page
document.getElementById("submit-btn").addEventListener('click', function (e) {
    e.preventDefault()
    if (suppliername.value == "") {
        showPopup('Required fields missing', 'Please enter the supplier name.', 'images/1382678.webp')
        suppliername.nextElementSibling.style.display = "block"
        suppliername.nextElementSibling.textContent = "Supplier name is required !"
    }
    if (address.value == "") {
        showPopup('Required fields missing', 'Please enter the address.', 'images/1382678.webp')
        address.nextElementSibling.style.display = "block"
        address.nextElementSibling.textContent = "Address name is required !"
    }
    if (city.value == "") {
        showPopup('Required fields missing', 'Please enter the city.', 'images/1382678.webp')
        city.nextElementSibling.style.display = "block"
        city.nextElementSibling.textContent = "City name is required !"
    }
    if (country.value == "") {
        showPopup('Required fields missing', 'Please enter the country.', 'images/1382678.webp')
        country.nextElementSibling.style.display = "block"
        country.nextElementSibling.textContent = "Country name is required !"
    }
    if (postalcode == "" || !/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(postalcode.value)) {
        showPopup('Required fields missing', 'Please enter the valid postal code.', 'images/1382678.webp')
        postalcode.nextElementSibling.style.display = "block"
        postalcode.nextElementSibling.textContent = "Postalcode name is required !"
    }
    if (contact.value.length !== 10 || !/^\d+$/.test(contact.value)) {
        showPopup('Required fields missing', 'Please enter the valid phone number.', 'images/1382678.webp')
        contact.nextElementSibling.style.display = "block"
        contact.nextElementSibling.textContent = "Contact name is required !"
    }
    if (shippingmethod.value == "") {
        showPopup('Required fields missing', 'Please select the valid shipping method.', 'images/1382678.webp')
        shippingmethod.nextElementSibling.style.display = "block"
        shippingmethod.nextElementSibling.textContent = "Shipping method name is required !"
    }
})
//event for clear button
document.getElementById("btn-clear").addEventListener('click', function () {

    document.querySelector("form").reset();
})
// for footer
const footer = document.getElementById('footer-scroll')
footer.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})
//functions for popups
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
function logout() {
    localStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('breadcrumbTrail')
    location.replace('index.html')
}

function openTools() {
    document.querySelector(".tools-container").classList.toggle("show-tools");

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
