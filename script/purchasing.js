const user = JSON.parse(sessionStorage.getItem("currentUser"))
let AllReports = JSON.parse(localStorage.getItem('AllReports'))

const userName = document.getElementById('userName')
const modal = document.getElementById("popup")
const span = document.getElementById("closePopup")
const decision = document.getElementById("decision")
const subOptions = document.getElementById("sub-options")
const footer = document.getElementById('footer-scroll')
const returnOp = document.getElementById("return-options")
const followType = document.getElementById("follow-type")
const followDate = document.getElementById("follow-date")
const newNCR = document.getElementById("new-ncr-number")
const inspName = document.getElementById("inspector-name")
const ncrDate = document.getElementById("ncr-date")
const next1 = document.getElementById("next-btn1")
const next2 = document.getElementById("next-btn2")

const sections = document.querySelectorAll(".form-section")

// Follow-up functionality
const followUpRadioButtons = document.querySelectorAll('input[name="follow-up"]')
const followUpDetails = document.getElementById("follow-up-details")
userName.innerHTML = `${user.firstname}  ${user.lastname}`
const queryParams = new URLSearchParams(window.location.search)
loadData(queryParams)
let currentStep = 0
function updateStatusBar() {
    const steps = document.querySelectorAll(".status-steps .status-step") // Get all status steps
    steps.forEach((step, index) => {
        // Highlight the current step
        step.classList.toggle("active", index === currentStep)

        // Optionally, you can add a class for completed steps
        step.classList.toggle("completed", index < currentStep)
    })
}


// Add keyboard navigation functionality
document.addEventListener('keydown', function (event) {
    // Check if the focused element is a radio button label
    const focusedElement = document.activeElement

    if (focusedElement && focusedElement.classList.contains('radio-button')) {
        // Check if "Enter" key is pressed
        if (event.key === 'Enter') {
            const radio = focusedElement.querySelector('input[type="radio"]')
            if (radio) {
                // Simulate a click on the radio button
                radio.click()
                toggleRadio(radio)
            }
        }
    }
})

decision.addEventListener("change", () => {
    if (decision.value === "return") {
        subOptions.style.display = "block"
    } else {
        subOptions.style.display = "none"
    }
})

const carRadioButtons = document.querySelectorAll('input[name="car"]')
const carDetails = document.getElementById("car-details")

carRadioButtons.forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.value === "yes") {
            carDetails.style.display = "block"
        } else {
            carDetails.style.display = "none"
        }
    })
})
footer.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})



followUpRadioButtons.forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.value === "yes") {
            followUpDetails.style.display = "block"
        } else {
            followUpDetails.style.display = "none"
        }
    })
})

function toggleCheck(radio) {
    // Remove 'checked' class from all sibling radio buttons' parent elements
    const radios = document.querySelectorAll(`input[name="${radio.name}"]`)
    radios.forEach(r => r.parentElement.classList.remove('checked'))

    // Add 'checked' class to the selected radio button's parent element
    if (radio.checked) {
        radio.parentElement.classList.add('checked')
    }
}

// Initialize form navigation and submission
sections[currentStep].classList.add("active")
updateStatusBar()

// Add event listeners for navigation buttons
document.getElementById("next-btn1").addEventListener("click", () => {
    if (validateFields1()) {

        sections[currentStep].classList.remove("active")
        currentStep++
        sections[currentStep].classList.add("active")
        updateStatusBar()
    }
    else {
        showPopup('Required field missing', 'All the fields are required and cannot be empty', 'images/1382678.webp');

    }

})
document.getElementById("next-btn2").addEventListener("click", () => {
    if (validateFields2()) {

        sections[currentStep].classList.remove("active")
        currentStep++
        sections[currentStep].classList.add("active")
        updateStatusBar()
    } else {
        showPopup('Required field missing', 'All the fields are required and cannot be empty', 'images/1382678.webp');

    }

})
document.getElementById("back-btn1").addEventListener("click", () => {
    sections[currentStep].classList.remove("active")
    currentStep--
    sections[currentStep].classList.add("active")
    updateStatusBar()
})

document.getElementById("back-btn2").addEventListener("click", () => {
    sections[currentStep].classList.remove("active")
    currentStep--
    sections[currentStep].classList.add("active")
    updateStatusBar()
})

// Event listener for the submit button
document.getElementById("submit-btn").addEventListener("click", (e) => {
    e.preventDefault() // Prevent default form submission

    if (validateFields1() && validateFields2) {

        // Show the popup and wait for it to close
        showPopup('Form submitted', 'Your Purchasing department form has been submitted', '<i class="fa fa-envelope" aria-hidden="true"></i>', () => {
            // This callback will execute after the popup is closed
            //submitForm(user.role) // Call the form submission
            //sendMail() // Call the email sending function
            //window.location.href = "Dashboard.html" // Redirect to home.html

            //sendNotification(ncrNumber)
        })
    }
})
function toggleSettings() {
    var settingsBox = document.getElementById("settings-box")
    if (settingsBox.style.display === "none" || settingsBox.style.display === "") {
        settingsBox.style.display = "block"
    } else {
        settingsBox.style.display = "none"
    }
}


function loadData(params) {
    const elements = [
        'qa-name-d', 'ncr-no-d', 'sales-order-no-d', 'quantity-received-d',
        'quantity-defective-d', 'qa-date-d', 'supplier-name-d',
        'product-no-d', 'process-d', 'description-item-d',
        'description-defect-d', 'item-marked-nonconforming-d',
        'review-by-cf-engineer-d', 'customer-notification-required-d', 'disposition-details-d',
        'drawing-update-required-d', 'original-rev-number-d', 'updated-rev-number-d', 'engineer-name-d',
        'revision-date-d', 'resolved-d', 'engineering-review-date-d'
    ];

    // Define process values with labels showing 'Yes' or 'No'
    const processSupplierInsp = `Supplier Inspection: ${params.get('supplier_or_rec_insp') === 'true' ? 'Yes' : 'No'}`;
    const processWipProdOrder = `WIP Production Order: ${params.get('wip_production_order') === 'true' ? 'Yes' : 'No'}`;
    const processValue = `${processSupplierInsp}\n\n${processWipProdOrder}`;

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
        params.get('item_marked_nonconforming') === 'true' ? 'Yes' : 'No',
        params.get('disposition'),
        params.get('customer_notification_required') === 'true' ? 'Yes' : 'No',
        params.get('disposition_details'),
        params.get('drawing_update_required') === 'true' ? 'Yes' : 'No',
        params.get('original_rev_number'),
        params.get('updated_rev_number'),
        params.get('engineer_name'),
        params.get('revision_date'),
        params.get('resolved_engineer') === 'true' ? 'Yes' : 'No',
        params.get('engineering_review_date')

    ];

    elements.forEach((id, index) => {
        const element = document.getElementById(id);
        element.textContent = values[index];
        element.setAttribute('disabled', 'true'); // Disable the element
    });
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

function logout() {
    localStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('breadcrumbTrail')
    location.replace('index.html')
}

function openTools() {
    document.querySelector(".tools-container").classList.toggle("show-tools")

}

function sendNotification(ncrNum) {
    // Retrieve existing notifications from localStorage or initialize as an empty array
    const notifications = JSON.parse(localStorage.getItem('notifications')) || []

    // Add the new notification message
    notifications.push(`NCR No. ${ncrNum} has been sent to the Engineering department via Gmail for review and action.`)

    // Save updated notifications back to localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications))

    // Update the notification display
    setNotificationText()
}

function setNotificationText() {
    // Retrieve and parse notifications from localStorage
    const notifications = JSON.parse(localStorage.getItem('notifications')) || []

    // Set the notification count
    const count = document.getElementById('notification-count')
    count.innerHTML = notifications.length

    // Clear any existing notifications in the list to avoid duplicates
    const notificationList = document.getElementById('notification-list') // Ensure this element exists in your HTML
    notificationList.innerHTML = '' // Clear existing list items

    // Append each notification as an <li> element
    notifications.forEach(notificationText => {
        const li = document.createElement('li')
        li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>${notificationText.slice(17,)}`
        notificationList.prepend(li)
    })
}
// Show the modal with a title, message, and icon
function showPopup(title, message, icon, callback) {
    const modalContent = modal.querySelector('.modal-content')
    modalContent.querySelector('h2').innerText = title // Set the title
    modalContent.querySelector('p').innerText = message // Set the message

    const iconDiv = document.querySelector('.icon')
    // Clear previous icons
    iconDiv.innerHTML = ''
    const isImage = icon.includes('.jpg') || icon.includes('.jpeg') || icon.includes('.png') || icon.includes('.gif') || icon.includes('.svg') || icon.includes('.webp')

    if (isImage) {

        const imgElement = document.createElement('img')
        imgElement.src = icon // Replace with your image URL
        iconDiv.appendChild(imgElement)
    }
    else {
        iconDiv.style.fontSize = '45px'
        iconDiv.innerHTML = icon
    }

    modal.style.display = "block" // Show the modal

    setTimeout(() => {
        modalContent.style.opacity = "1" // Fade in effect
        modalContent.style.transform = "translate(-50%, -50%)" // Ensure it's centered
    }, 10) // Short timeout to ensure the transition applies

    // Define the close function
    const closeModal = () => {
        modalContent.style.opacity = "0" // Fade out effect
        modalContent.style.transform = "translate(-50%, -60%)" // Adjust position for effect
        setTimeout(() => {
            modal.style.display = "none" // Hide the modal after transition
            callback() // Execute the callback after closing the modal
        }, 500) // Wait for the transition to finish before hiding
    }

    // Close modal when <span> (x) is clicked
    span.onclick = closeModal

    // Close modal when clicking outside of it
    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal()
        }
    }
}

function validateFields1() {
    // Define the fields and their corresponding messages
    const fieldsToValidate = [
        { field: decision, message: "Decision is required!" },
        { field: returnOp, message: "Return option is required!" },
        { field: followType, message: "Follow-up type is required!" },
        { field: followDate, message: "Follow-up date is required!" }
    ];

    let isValid = true; // To track if all fields pass validation

    fieldsToValidate.forEach(({ field, message }) => {
        const errorElement = field.nextElementSibling;
        if (field.value.trim() === "") {
            isValid = false;
            errorElement.style.display = "block";
            // errorElement.textContent = message;
        } else {
            errorElement.style.display = "none"; // Hide error if the field is valid
        }
    });


    return isValid;
}


function validateFields2() {
    const fields = [
        { field: newNCR, errorMessage: "New NCR no. is required!" },
        { field: inspName, errorMessage: "Inspector's Name is required!" },
        { field: ncrDate, errorMessage: "NCR date is required!" }
    ];

    let isValid = true;

    fields.forEach(({ field, errorMessage }) => {
        const errorElement = field.nextElementSibling; // Assuming error message is displayed in the next sibling
        if (field.value.trim() === "") {
            isValid = false;
            errorElement.style.display = "block";
            // errorElement.textContent = errorMessage;
        } else {
            errorElement.style.display = "none"; // Hide the error message if the field is valid
        }
    });

    return isValid; // Return true if all fields are valid
}



document.getElementById('clear-btn1').addEventListener('click', () => {
    const spans = document.querySelectorAll('.error-message')
    spans.forEach(element => {
        element.style.display = 'none'
    });
})


function submitForm() {

    let ncrIndex = AllReports.findIndex(report => report.ncr_no === ncrNo);
    // Assigning form inputs to variables
    const decisionValue = document.getElementById("decision").value;
    const returnOptionsValue = document.getElementById("return-options").value;
    const followUpTypeValue = document.getElementById("follow-type").value;
    const followUpDateValue = document.getElementById("follow-date").value;
    const newNcrNumberValue = document.getElementById("new-ncr-number").value;
    const inspectorNameValue = document.getElementById("inspector-name").value;
    const ncrDateValue = document.getElementById("ncr-date").value;
    const qualityClosureDateValue = document.getElementById("quality-date").value;

    // Collecting radio button values into variables
    const followUpRequiredValue = document.querySelector('input[name="follow-up"]:checked')?.value || null;
    const reInspectedAcceptableValue = document.querySelector('input[name="re-inspected"]:checked')?.value || null;
    const ncrClosedValue = document.querySelector('input[name="ncr-closed"]:checked')?.value || null;

    // Update the engineering data for the found NCR record
    AllReports[ncrIndex].purchasing_decision = {
        "preliminary_decision": decisionValue,           // decision option selected
        "options": {
            "rework_in_house": returnOptionsValue === "rework_in_house",  // checking if option matches
            "scrap_in_house": returnOptionsValue === "scrap_in_house",
            "defer_to_engineering": returnOptionsValue === "defer_to_engineering"
        },
        "car_raised": followUpRequiredValue === "true",  // interpreting radio button value
        "car_number": followUpTypeValue || null,         // setting car number or null if not available
        "follow_up_required": followUpRequiredValue === "true",
        "operations_manager_name": followUpDateValue || null, // assuming manager name is stored in follow-up date input (update accordingly)
        "operations_manager_date": followUpDateValue || null,  // date of follow-up
        "re_inspected_acceptable": reInspectedAcceptableValue === "true", // interpreting radio button value
        "new_ncr_number": newNcrNumberValue,            // new NCR number
        "inspector_name": inspectorNameValue,           // inspector name
        "ncr_closed": ncrClosedValue === "true",        // ncr closed value
        "resolved": ncrClosedValue === "true"           // resolved status based on NCR closed
    };

    localStorage.setItem('AllReports', JSON.stringify(AllReports))

}