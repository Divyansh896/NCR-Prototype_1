
// Get the modal
const modal = document.getElementById("popup");

// Get the <span> element that closes the modal
const span = document.getElementById("closePopup");

// Hide error messages on input change
document.getElementById("username").addEventListener("input", () => {
    document.getElementById("username-error").style.display = 'none';
});

document.getElementById("password").addEventListener("input", () => {
    document.getElementById("password-error").style.display = 'none';
});

// Handle Enter key navigation and login
document.addEventListener("keydown", (event) => {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("btn-login");

    if (event.key === "Enter") {
        if (document.activeElement === usernameInput) {
            event.preventDefault(); // Prevent form submission
            passwordInput.focus(); // Move focus to the password input
        } else if (document.activeElement === passwordInput) {
            event.preventDefault(); // Prevent form submission
            loginButton.click(); // Trigger login button click
        }
    }
});

// Event listeners and functions for login page
document.getElementById("btn-login").addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Error message spans
    const usernameErrorSpan = document.getElementById("username-error");
    const passwordErrorSpan = document.getElementById("password-error");

    // Clear any previous error messages
    usernameErrorSpan.style.display = 'none';
    passwordErrorSpan.style.display = 'none';

    if (validateInputs()) {
        // Fetch user data from local JSON
        fetch('Data/user.json')
            .then(response => response.json())
            .then(users => {
                const user = users.find(user => user.username === username);

                if (user) {
                    if (user.password === password) {
                        sessionStorage.setItem("currentUser", JSON.stringify(user)); // Store user data
                        onLoginSuccess(); // After successful login
                        window.location.href = "Dashboard.html"; // Redirect to home page
                    } else {
                        // Incorrect password
                        passwordErrorSpan.style.display = 'inline';
                        passwordErrorSpan.innerText = 'Incorrect password.';

                        // Show popup for incorrect password
                        showPopup('Login Error', 'The password you entered is incorrect. Please try again.', 'images/1382678.webp');
                    }
                } else {
                    // Incorrect username
                    usernameErrorSpan.style.display = 'inline';
                    usernameErrorSpan.innerText = 'Username does not exist.';

                    // Show popup for invalid username
                    showPopup('Login Error', 'The username you entered does not exist. Please check and try again.', 'images/1382678.webp');
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                showPopup('Error', 'An error occurred while trying to log you in. Please try again later.', 'images/1382678.webp');
            });
    } else {
        // Show popup for missing inputs
        showPopup("Username and password required", '', 'images/1382678.webp');
    }
});



function onLoginSuccess() {
    localStorage.setItem('isLoggedIn', 'true'); // Set the logged-in state
}

function validateInputs() {
    let isValid = true;

    // Define fields and their corresponding error message spans
    const requiredFields = [
        { id: 'username', errorId: 'username-error', errorMessage: 'Username is required' },
        { id: 'password', errorId: 'password-error', errorMessage: 'Password is required' }
    ];

    requiredFields.forEach(field => {
        const inputElement = document.getElementById(field.id);
        const errorElement = document.getElementById(field.errorId);

        // Check if the input is empty
        if (inputElement.value.trim() === '') {
            errorElement.style.display = 'inline'; // Show error message
            errorElement.innerText = field.errorMessage; // Set specific error message
            isValid = false;
        } else {
            errorElement.style.display = 'none'; // Hide error if filled
            errorElement.innerText = ''; // Clear the error message
        }
    });

    return isValid;
}



function showPopup(title, message, icon) {
    const modalContent = modal.querySelector('.modal-content');
    document.getElementById('popup-title').innerText = title; // Use getElementById for the title
    modalContent.querySelector('p').innerText = message; // Set the message

    const iconDiv = document.querySelector('.icon');
    iconDiv.innerHTML = ''; // Clear previous icons
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

document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);

    // Toggle the eye icon
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
});



