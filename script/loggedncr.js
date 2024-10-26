
const user = JSON.parse(sessionStorage.getItem("currentUser"))

const nextBtn1 = document.getElementById("next-btn1")
const nextBtn2 = document.getElementById("next-btn2")
const backBtn1 = document.getElementById("back-btn1")
const backBtn2 = document.getElementById("back-btn2")
const clearBtn1 = document.getElementById("clear-btn1")
const clearBtn2 = document.getElementById("clear-btn2")
const submitBtn = document.getElementById("submit-btn")

const footer = document.getElementById('footer-scroll')

const qadropdown = document.getElementById('qa-section')
const engdropdown = document.getElementById('eng-section')
const purchdropdown = document.getElementById('purch-section')
// Get the modal
const modal = document.getElementById("popup");

// Get the <span> element that closes the modal
const span = document.getElementById("closePopup");

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.type === 'radio') {
            activeElement.click(); // Programmatically click the radio button
        }
        if (activeElement.type === 'checkbox') {
            activeElement.click()
        }
    }
});


// Only proceed if the user is engineer
if (user.role === 'Lead Engineer') {
    let currentStep = 0

    const sections = document.querySelectorAll(".form-section")

    // Remove sections based on user role
    removeSectionsForUser()

    // Update status bar based on current step
    function updateStatusBar() {
        const steps = document.querySelectorAll(".status-steps .status-step"); // Get all status steps
        steps.forEach((step, index) => {
            // Highlight the current step
            step.classList.toggle("active", index === currentStep);

            // Optionally, you can add a class for completed steps
            step.classList.toggle("completed", index < currentStep);
        });
    }

    // Initialize form navigation and submission
    sections[currentStep].classList.add("active")
    updateStatusBar()

    // Add event listeners for navigation buttons
    nextBtn1.addEventListener("click", () => {
        if (true) {
            sections[currentStep].classList.remove("active")
            currentStep++
            sections[currentStep].classList.add("active")
            updateStatusBar()
            console.log("presses")
        }
        else {
            showPopup('Required fields missing', 'Please fill in required fields before proceeding.', 'images/1382678.webp')
        }
    })

    nextBtn2.addEventListener("click", () => {
        if (true) {
            sections[currentStep].classList.remove("active")
            currentStep++
            sections[currentStep].classList.add("active")
            updateStatusBar()
            populateConfirmationData()
        }
        else {
            showPopup('Required fields missing', 'Please fill in required fields before proceeding.', 'images/1382678.webp')
        }
    })



    backBtn1.addEventListener("click", () => {
        sections[currentStep].classList.remove("active")
        currentStep--
        sections[currentStep].classList.add("active")
        updateStatusBar()
    })

    backBtn2.addEventListener("click", () => {
        sections[currentStep].classList.remove("active")
        currentStep--
        sections[currentStep].classList.add("active")
        updateStatusBar()
    })

    // Event listener for the submit button
    submitBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default form submission

        // Show the popup and wait for it to close
        showPopup('Form submitted', 'Your Quality Assurance form has been sent to the engineering department and your automated mail is generated.', 'images/gmail.webp', () => {
            // This callback will execute after the popup is closed
            // sendMail(); // Call the email sending function
            window.location.href = "home.html"; // Redirect to home.html
        });
    });

    // Clear fields in Section 1
    clearBtn1.addEventListener("click", () => {
        const section1 = document.querySelector('fieldset[aria-labelledby="product-info"]')
        clearSection(section1)
        // Clear checkboxes
        const checkboxes = document.querySelectorAll('input[name="process"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);
        quantityReceivedInput.value = 0
        quantityDefectiveInput.value = 0

    })

    // Clear fields in Section 2
    clearBtn2.addEventListener("click", () => {
        const section2 = document.querySelector('fieldset[aria-labelledby="product-desc"]')
        clearSection(section2)
        // Clear radio buttons
        const radioButtons = document.querySelectorAll('input[name="item_marked_nonconforming"]');
        radioButtons.forEach(radioButton => radioButton.checked = false);
        document.getElementById('photo-list').innerHTML = ''; // Clear the photo list
        document.getElementById('video-list').innerHTML = ''; // Clear the video list

        // Optionally reset the file input elements
        document.getElementById('photo-input').value = '';
        document.getElementById('video-input').value = '';
    })
}
function removeSectionsForUser() {

    if (user.role === 'Lead Engineer') {
        engdropdown.remove()
        purchdropdown.remove()
    } else if (user.role === 'Purchasing') {
        purchdropdown.remove()
    }
}
footer.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})
