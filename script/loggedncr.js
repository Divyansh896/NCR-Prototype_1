
const user = JSON.parse(sessionStorage.getItem("currentUser"));
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
const userName = document.getElementById('userName');
userName.innerHTML = `${user.firstname}  ${user.lastname}`
const queryParams = new URLSearchParams(window.location.search)
loadData(queryParams)


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
        // purchdropdown.remove()
    } else if (user.role === 'Purchasing') {
        // purchdropdown.remove()
    }
}

footer.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})


function loadData(params) {
    const elements = [
        'qa-name-d', 'ncr-no-d', 'sales-order-no-d', 'quantity-received-d',
        'quantity-defective-d', 'qa-date-d', 'supplier-name-d',
        'product-no-d', 'process-d', 'description-item-d',
        'description-defect-d', 'item-marked-nonconforming-d'
    ];

    // Define process values with labels showing 'Yes' or 'No'
    const processSupplierInsp = `Supplier Inspection: ${params.get('supplier_or_rec_insp') === 'true' ? 'Yes' : 'No'}`;
    const processWipProdOrder = `WIP Production Order: ${params.get('wip_production_order') === 'true' ? 'Yes' : 'No'}`;
    const processValue = `${processSupplierInsp}\n${processWipProdOrder}`;

    // Prepare values, including formatted process and description of defect
    const values = [
        params.get('quality_representative_name') || '[QA Name]',
        params.get('ncr_no') || '[NCR No]',
        params.get('sales_order_no') || '[Sales Order No]',
        params.get('quantity_received') || '[Quantity Received]',
        params.get('quantity_defective') || '[Quantity Defective]',
        params.get('date') || '[QA Date]',
        params.get('supplier_name') || '[Supplier Name]',
        params.get('po_no') || '[Product No]',
        processValue,
        params.get('item_description') || '[Description of Item]',
        params.get('description_of_defect') || '[Description of Defect]',
        params.get('item_marked_nonconforming') === 'true' ? 'Yes' : 'No'
    ];

    elements.forEach((id, index) => {
        const element = document.getElementById(id);
        element.textContent = values[index];
        element.setAttribute('disabled', 'true'); // Disable the element
    });
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