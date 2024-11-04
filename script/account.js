const starElements = document.querySelectorAll('.required');
const user = JSON.parse(sessionStorage.getItem("currentUser"));
const userName = document.getElementById('userName');
userName.innerHTML = `${user.firstname}  ${user.lastname}`
// Check if user data is available and has a role
if (user && user.role) {
    // Update the Create NCR link based on user role
    function updateNCRLink() {
        var ncrLink = document.querySelector('a[aria-label="Create a new Non-Conformance Report"]')

        if (ncrLink) { // Ensure ncrLink exists
            if (user.role === "Lead Engineer" || user.role === "Purchasing") {
                // Change to "Logged NCR" for lead engineers and purchasing roles
                ncrLink.href = "current_NCR.html"
                ncrLink.innerHTML = '<i class="fa fa-sign-in"></i>Current NCRs'
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
starElements.forEach(star => {
    star.style.display = 'none'; // Hide each star element
});

populateUserData(user);


const footer = document.getElementById('footer-scroll');
footer.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    });
});

// Function to populate input fields with user data
function populateUserData(data) {
    document.getElementById('fname').value = data.firstname || '';
    document.getElementById('lname').value = data.lastname || '';
    document.getElementById('Uname').value = data.username || '';
    document.getElementById('employeeId').value = data.employeeID || '';
    document.getElementById('emailId').value = data.emailID || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('bday').value = data.dob || '';
    document.getElementById('password').value = data.password || '';
    const genderSelect = document.getElementById('gender');
    genderSelect.value = data.gender; // Set the selected value
    console.log(data.gender);
}

// Function to update required fields dynamically
function showRequiredFields() {
    let isvalid = true;
    const requiredFields = [
        'fname', 'lname', 'Uname', 'employeeId', // Changed 'UserId' to 'employeeId'
        'emailId', 'phone', 'bday', 'gender'
    ];

    requiredFields.forEach(field => {
        const inputElement = document.getElementById(field);
        const labelElement = document.querySelector(`label[for="${field}"]`);
        const starElement = labelElement.querySelector('.required');

        // Check if the input is empty
        if (inputElement.value.trim() === '') {
            starElement.style.display = 'inline'; // Show star if empty
            isvalid = false;
        } else {
            starElement.style.display = 'none'; // Hide star if filled
        }
    });

    return isvalid; // Return the final validation result
}

// Submit button event listener
document.getElementById('submit-btn').addEventListener('click', (e) => {
    if (!showRequiredFields()) {
        e.preventDefault(); // Prevent form submission if invalid
        alert("Please fill in the required fields before submitting.")
    } else {

        alert("Credentials updated  successfully.")
    }
});

// Common function for all pages
window.onload = function () {
    // // Check if the user is logged in
    // if (localStorage.getItem('isLoggedIn') !== 'true') {
    //     window.location.href = 'index.html'; // Redirect to login if not logged in
    // }

    // Add logout button event listener
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default button behavior
            logout(); // Call logout function
        });
    }
};

function logout() {
    // Clear the logged-in state
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('breadcrumbTrail')


    // Redirect to the login page
    location.replace('index.html'); // This will replace the current history entry
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

// Optional: Hide the notification box if clicked outside
document.addEventListener("click", function(event) {
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
function logout() {
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('breadcrumbTrail')
    location.replace('index.html')
}