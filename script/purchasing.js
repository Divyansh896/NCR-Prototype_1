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
const clearNotification = document.getElementById("btnClearNotification")
const btnBackToTop = document.getElementById('btnBackToTop')

const reInspectRadioButtons = document.querySelectorAll('input[name="re-inspected"]')
const ncrClosed = document.querySelectorAll('input[name="ncr-closed"]')
const ncrResolved = document.querySelectorAll('input[name="ncr-resolved"]')
const next1 = document.getElementById("next-btn1")
const next2 = document.getElementById("next-btn2")

const sections = document.querySelectorAll(".form-section")

// Follow-up functionality
const followUpRadioButtons = document.querySelectorAll('input[name="follow-up"]')
const followUpDetails = document.getElementById("follow-up-details")
const carRadioButtons = document.querySelectorAll('input[name="car"]')
const carDetails = document.getElementById("car-details")
const yesRadioButton = document.querySelector('input[name="follow-up"][value="yes"]:checked');
let fields = followUpDetails.querySelectorAll('label, input, span, date'); // You can add other elements you want to disable here



document.getElementById("save2").addEventListener("click", saveDataToLocalStorage)

if (decision.value != 'return') {
    let fields = subOptions.querySelectorAll('label, select, input, span')
    fields.forEach(field => {
        field.disabled = true
    })
}
if (yesRadioButton) {
    fields.forEach(field => field.disabled = false); // Enable fields if "yes" is selected
} else {
    fields.forEach(field => field.disabled = true);  // Disable fields if "no" is selected or none are selected

}
userName.innerHTML = `${user.firstname}  ${user.lastname}`

const queryParams = new URLSearchParams(window.location.search)
loadData(queryParams)
const ncrNo = queryParams.get('ncr_no');
let currentStep = 0
setNotificationText()

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
function toggleCheck(radio) {
    // Remove 'checked' class from all sibling radio buttons' parent elements
    const radios = document.querySelectorAll(`input[name="${radio.name}"]`)
    radios.forEach(r => r.parentElement.classList.remove('checked'))

    // Add 'checked' class to the selected radio button's parent element
    if (radio.checked) {
        radio.parentElement.classList.add('checked')
    }
}
window.onload = function () {
    // Get the index of the selected report from session storage
    const index = sessionStorage.getItem('editReportIndex');

    // Retrieve all the saved NCRs from session storage
    const savedNCRs = JSON.parse(localStorage.getItem('savedNCRspurch')) || [];

    // Find the NCR using the index
    const selectedNCR = savedNCRs[index];

    // If a valid NCR is found, populate the inputs with its values
    if (selectedNCR) {
        populateFormFromJson(selectedNCR);
    }
}
decision.addEventListener("change", () => {
    // Check if the selected value is "return"
    let fields = subOptions.querySelectorAll('label, select, input, span')
    if (decision.value === "return") {
        fields.forEach(field => {
            field.disabled = false
        })
    } else {
        // Disable sub-option inputs when something other than "return" is selected
        fields.forEach(field => {
            field.disabled = true
        })
    }
})



carRadioButtons.forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.value === "yes") {
            carDetails.disabled = false
        } else {
            carDetails.disabled = true
        }
    })
})

reInspectRadioButtons.forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.value === "yes") {
            newNCR.disabled = false
        } else {
            newNCR.disabled = true
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
    let fields = followUpDetails.querySelectorAll('input, span, date')
    radio.addEventListener("change", () => {
        if (radio.value === "yes") {
            fields.forEach(field => {
                field.disabled = false
            })
        } else {
            fields.forEach(field => {
                field.disabled = true; // Disable the field

                // Clear the value of the field if it is an input, textarea, or select
                if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA' || field.tagName === 'SELECT') {
                    field.value = ''; // Clear input/select/textarea value
                }
            })
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
    // remember to delet the not in validation it is just for checking
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
        populateConfirmationData()
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
            submitForm(user.role) // Call the form submission
            //sendMail() // Call the email sending function
            window.location.href = "Dashboard.html" // Redirect to home.html

            sendNotification(ncrNo)
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
        'revision-date-d', 'resolved-d', 'engineering-review-date-d', 'item-name-d'
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
        params.get('engineering_review_date'),
        params.get('item_name')

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
    if (notificationBox.style.display == "block") {
        if (!notificationBox.contains(event.target) && !iconBadge.contains(event.target)) {
            notificationBox.style.display = "none"
            if (user.role == "QA Inspector") {
                let notifications = JSON.parse(localStorage.getItem('QANotification')) || []

                notifications = notifications.map(notification => {
                    return {
                        ...notification, // Copy all existing properties
                        // ischecked: true// Override the `ischecked` property
                        qachecked: true
                    };

                });
                localStorage.setItem("QANotification", JSON.stringify(notifications))
            }
            else if (user.role == "Lead Engineer") {
                let notifications = JSON.parse(localStorage.getItem('ERNotification')) || []

                notifications = notifications.map(notification => {
                    return {
                        ...notification, // Copy all existing properties
                        // ischecked: true// Override the `ischecked` property
                        engineerchecked: true
                    };

                });
                localStorage.setItem("ERNotification", JSON.stringify(notifications))

            }
            else if (user.role == "Purchasing") {
                let notifications = JSON.parse(localStorage.getItem('PRNotification')) || []

                notifications = notifications.map(notification => {
                    return {
                        ...notification, // Copy all existing properties
                        // ischecked: true// Override the `ischecked` property
                        purchasingchecked: true
                    };

                });
                localStorage.setItem("PRNotification", JSON.stringify(notifications))

            }
            else if (user.role == "Admin") {
                let notifications = JSON.parse(localStorage.getItem('ADNotification')) || []

                notifications = notifications.map(notification => {
                    return {
                        ...notification, // Copy all existing properties
                        // ischecked: true// Override the `ischecked` property
                        adminchecked: true
                    };

                });
                localStorage.setItem("ADNotification", JSON.stringify(notifications))

            }

            setNotificationText()
        }
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




// Show the modal with a title, message, and icon
function showPopup(title, message, icon, callback) {
    const modalContent = modal.querySelector('.modal-content')
    modalContent.querySelector('h2').innerText = title // Set the title
    modalContent.querySelector('p').innerHTML = message // Set the message

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


    let isValid = true; // To track if all fields pass validation

    // const errorElement = decision.nextElementSibling;
    const errorElement = decision.closest('.tooltip-container')?.nextElementSibling;

    if (decision.value.trim() === "") {
        isValid = false;
        errorElement.style.display = "block";  // Show error message for the decision field
    } else {
        // If the decision is 'return', check if returnOp is filled
        let returnOpError = returnOp.closest('.tooltip-container')?.nextElementSibling;  // Get the error message for the returnOp field

        if (decision.value === 'return') {
            if (returnOp.value.trim() === '') {
                returnOpError.style.display = 'block';  // Show error if returnOp is empty when decision is 'return'
                isValid = false;
            } else {
                returnOpError.style.display = 'none';  // Hide error if returnOp is filled when decision is 'return'
            }
        } else {
            returnOpError.style.display = 'none';  // Ensure returnOp error is hidden if decision is not 'return'
        }
    }


    const radioErrorSpan = document.getElementById('followUp-error')

    if (![...followUpRadioButtons].some(radio => radio.checked)) {
        // If neither "Yes" nor "No" is selected, show the error message
        radioErrorSpan.style.display = 'block'  // Show error message
        isValid = false
    } else {
        radioErrorSpan.style.display = 'none'  // Hide error if any radio button is selected

        // Only validate if the "Yes" option is selected
        if ([...followUpRadioButtons].some(radio => radio.checked && radio.value === "yes")) {
            let fields = followUpDetails.querySelectorAll('input, date') // Skip <span> elements here

            fields.forEach(field => {
                if (field.disabled === false) {  // Check if field is enabled
                    if (field.value.trim() === '') {
                        // If the field is enabled and empty, show an error
                        const errorElement = field.closest('.tooltip-container')?.nextElementSibling;

                        if (errorElement && errorElement.classList.contains('error-message')) {
                            errorElement.style.display = 'block'; // Show error message
                        }
                        isValid = false
                    } else {
                        // If the field is filled, hide the error
                        const errorElement = field.nextElementSibling;
                        if (errorElement && errorElement.classList.contains('error-message')) {
                            errorElement.style.display = 'none'; // Hide error message
                        }
                    }
                }
            })
        }
    }

    return isValid;
}


function validateFields2() {
    const fields = [
        { field: inspName, errorMessage: "Inspector's Name is required!" },
        { field: ncrDate, errorMessage: "NCR date is required!" }
    ];

    let isValid = true;

    fields.forEach(({ field, errorMessage }) => {
        const errorElement = field.closest('.tooltip-container')?.nextElementSibling;; // Assuming error message is displayed in the next sibling
        if (field.value.trim() === "") {
            isValid = false;
            errorElement.style.display = "block";
            // errorElement.textContent = errorMessage;
        } else {
            errorElement.style.display = "none"; // Hide the error message if the field is valid
        }
    });
    const radioErrorSpan = document.getElementById('reInspect-error')

    if (![...reInspectRadioButtons].some(radio => radio.checked)) {
        // If neither "Yes" nor "No" is selected, show the error message
        radioErrorSpan.style.display = 'block'  // Show error message
        isValid = false
    } else {
        radioErrorSpan.style.display = 'none'  // Hide error if any radio button is selected

        // Only validate if the "Yes" option is selected
        if ([...reInspectRadioButtons].some(radio => radio.checked && radio.value === "yes")) {
            if (newNCR.disabled === false) {  // Check if field is enabled
                if (newNCR.value.trim() === '') {
                    // If the field is enabled and empty, show an error
                    const errorElement = newNCR.closest('.tooltip-container')?.nextElementSibling;;
                    errorElement.style.display = 'block'; // Show error message
                    isValid = false
                } else {
                    // If the field is filled, hide the error
                    const errorElement = newNCR.closest('.tooltip-container')?.nextElementSibling;;
                    errorElement.style.display = 'none'; // Hide error message

                }
            }

        }
    }

    let carradioErrorSpan = document.getElementById('car-error')
    if (![...carRadioButtons].some(radio => radio.checked)) {
        // If neither "Yes" nor "No" is selected, show the error message
        carradioErrorSpan.style.display = 'block'  // Show error message
        isValid = false
    } else {
        carradioErrorSpan.style.display = 'none'  // Hide error if any radio button is selected

        // Only validate if the "Yes" option is selected
        if ([...carRadioButtons].some(radio => radio.checked && radio.value === "yes")) {
            if (carDetails.disabled === false) {  // Check if field is enabled
                if (carDetails.value.trim() === '') {
                    // If the field is enabled and empty, show an error
                    const errorElement = carDetails.closest('.tooltip-container')?.nextElementSibling;;
                    errorElement.style.display = 'block'; // Show error message
                    isValid = false
                } else {
                    // If the field is filled, hide the error
                    const errorElement = carDetails.closest('.tooltip-container')?.nextElementSibling;;
                    errorElement.style.display = 'none'; // Hide error message

                }
            }

        }
    }

    let ncrClosedError = document.getElementById('ncrClosedError')
    if (![...ncrClosed].some(radio => radio.checked)) {
        // If neither "Yes" nor "No" is selected, show the error message
        ncrClosedError.style.display = 'block'  // Show error message
        isValid = false
    }
    else {
        ncrClosedError.style.display = 'none'  // Show error message

    }
    let ncrResolvedError = document.getElementById('ncrResolvedError')
    if (![...ncrResolved].some(radio => radio.checked)) {
        // If neither "Yes" nor "No" is selected, show the error message
        ncrResolvedError.style.display = 'block'  // Show error message
        isValid = false
    }
    else {
        ncrResolvedError.style.display = 'none'  // Show error message

    }

    return isValid; // Return true if all fields are valid
}





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
    const carNumbervalue = document.getElementById("car-details").value;

    // Collecting radio button values into variables
    const followUpRequiredValue = document.querySelector('input[name="follow-up"]:checked')?.value || null;
    const reInspectedAcceptableValue = document.querySelector('input[name="re-inspected"]:checked')?.value || null;
    const ncrClosedValue = document.querySelector('input[name="ncr-closed"]:checked')?.value || null;
    const ncrResolvedValue = document.querySelector('input[name="ncr-resolved"]:checked')?.value || null;
    const carRaisedValue = document.querySelector('input[name="car"]:checked')?.value || null;

    // Update the engineering data for the found NCR record
    AllReports[ncrIndex].purchasing_decision = {
        "preliminary_decision": decisionValue,           // decision option selected
        "options": {
            "rework_in_house": returnOptionsValue === "rework_in_house",  // checking if option matches
            "scrap_in_house": returnOptionsValue === "scrap_in_house",
            "defer_to_engineering": returnOptionsValue === "defer_to_engineering"
        },
        "car_raised": carRaisedValue === "yes" ? true : false,  // interpreting radio button value
        "car_number": carNumbervalue || 'NA',         // setting car number or null if not available
        "follow_up_required": followUpRequiredValue === "yes" ? true : false,
        "operations_manager_date": followUpDateValue || null,  // date of follow-up
        "re_inspected_acceptable": reInspectedAcceptableValue === "yes" ? true : false, // interpreting radio button value
        "new_ncr_number": newNcrNumberValue || 'NA',            // new NCR number
        "inspector_name": inspectorNameValue,           // inspector name
        "ncr_closed": ncrClosedValue === "yes" ? true : false,        // ncr closed value
        "resolved": ncrResolvedValue === "yes" ? true : false      // resolved status based on NCR closed
    };
    AllReports[ncrIndex].status = ncrClosedValue == 'yes' ? 'completed' : 'incomplete'


    localStorage.setItem('AllReports', JSON.stringify(AllReports))

}

function populateConfirmationData() {
    // Get values from Section 1
    const decision = document.getElementById("decision").value
    // const subOptions = document.getElementById("sub-options")
    const returnOp = document.getElementById("return-options").value
    const followUp = document.querySelector("input[name=follow-up]:checked").value
    const followUpType = document.getElementById("follow-type").value
    const followDate = document.getElementById("follow-date").value
    const reInspect = document.querySelector("input[name=re-inspected]:checked").value
    const newNCR = document.getElementById("new-ncr-number").value
    const inspName = document.getElementById("inspector-name").value
    const ncrDate = document.getElementById("ncr-date").value
    const qaClosureDate = document.getElementById("quality-date").value
    const ncrClosed = document.querySelector("input[name=ncr-closed]:checked").value


    // Populate confirmation section
    document.getElementById('confirm-decision').textContent = decision || 'NA';
    document.getElementById('confirm-return-options').textContent = returnOp || 'NA';
    document.getElementById('confirm-follow-up').textContent = followUp || 'NA'
    document.getElementById('confirm-follow-type').textContent = followUpType || 'NA';

    // If not required fields are left blank, change it to 'Not Stated'
    document.getElementById('confirm-follow-date').textContent = followDate || 'NA';
    document.getElementById('confirm-re-inspected').textContent = reInspect || 'NA'
    document.getElementById('confirm-new-ncr-number').textContent = newNCR || 'NA'
    document.getElementById('confirm-inspector-name').textContent = inspName || 'NA'
    document.getElementById('confirm-ncr-date').textContent = ncrDate || 'NA'
    document.getElementById('confirm-ncr-closed').textContent = ncrClosed || 'NA'
    document.getElementById('confirm-closure-date').textContent = qaClosureDate || 'NA'
}

function clearSection(section) {
    const inputsToClear = section.querySelectorAll('input[type="text"], textarea, input[type="date"]')
    inputsToClear.forEach(input => {
        input.value = ''
    })

    section.querySelectorAll('.error-message').forEach(error => error.style.display = 'none') // Clear error messages
}

// Clear fields in Section 1
document.getElementById("clear-btn1").addEventListener("click", () => {
    const section1 = document.querySelector('fieldset[aria-labelledby="purchasing-decision-info"]')
    clearSection(section1)

    // clear the radio buttons
    const radioButtons = document.querySelectorAll('input[name="follow-up"]')
    radioButtons.forEach(radioButtons => {
        radioButtons.checked = false
        radioButtons.parentElement.classList.remove('checked')
    })

})

document.getElementById("clear-btn2").addEventListener("click", () => {
    const section1 = document.querySelector('fieldset[aria-labelledby="purchasing-decision-info-step2"]')
    clearSection(section1)

    // clear the radio buttons
    const radioButtons = document.querySelectorAll('input[name="re-inspected"], input[name="ncr-closed"]')
    radioButtons.forEach(radioButtons => {
        radioButtons.checked = false
        radioButtons.parentElement.classList.remove('checked')
    })

})

function sendMail() {
    const recipient = 'divyansh9030@gmail.com' // Change to valid recipient's email
    const subject = encodeURIComponent('Request for Engineering Department Details for NCR') // Subject of the email
    const body = encodeURIComponent(`Dear Davis Henry,\n\nI hope this message finds you well.\n\nI am writing to inform you that we have initiated the Non-Conformance Report (NCR) No. ${ncrNumber}. At this stage, we kindly request you to provide the necessary details from the Engineering Department to ensure a comprehensive assessment of the issue.\n\nYour prompt attention to this matter is essential for us to move forward efficiently. Please include any relevant information that could aid in our evaluation and resolution process.\n\nThank you for your cooperation. Should you have any questions or require further clarification, please do not hesitate to reach out.\n\nBest regards,\n\n${user.firstname} ${user.lastname}\nQuality Assurance\nCrossfire NCR`)

    // Construct the Gmail compose link
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`

    // Open the Gmail compose window
    window.open(gmailLink, '_blank') // Opens in a new tab
}

function setNotificationText() {
    // Retrieve and parse notifications from localStorage
    const count = document.getElementById('notification-count');
    let notifications
    if (user.role == "QA Inspector") {
        notifications = JSON.parse(localStorage.getItem('QANotification')) || []
        const qauncheckedNotifications = notifications.filter(notification => !notification.qachecked);
        count.innerHTML = qauncheckedNotifications.length;
    }
    else if (user.role == "Lead Engineer") {
        notifications = JSON.parse(localStorage.getItem('ERNotification')) || []
        const eruncheckedNotifications = notifications.filter(notification => !notification.engineerchecked);
        count.innerHTML = eruncheckedNotifications.length;
    }
    else if (user.role == "Purchasing") {
        notifications = JSON.parse(localStorage.getItem('PRNotification')) || []
        const pruncheckedNotifications = notifications.filter(notification => !notification.purchasingchecked);
        count.innerHTML = pruncheckedNotifications.length;
    }
    else if (user.role == "Admin") {
        notifications = JSON.parse(localStorage.getItem('ADNotification')) || []
        const aduncheckedNotifications = notifications.filter(notification => !notification.adminchecked);
        count.innerHTML = aduncheckedNotifications.length;
    }
    // Clear any existing notifications in the list to avoid duplicates
    const notificationList = document.getElementById('notification-list') // Ensure this element exists in your HTML
    notificationList.innerHTML = '' // Clear existing list items

    // Append each notification as an <li> element
    notifications.forEach(notificationText => {
        const li = document.createElement('li')
        if (user.role == 'Lead Engineer') {


            if (notificationText.text.includes('Engineering')) {
                let AllReports = JSON.parse(localStorage.getItem('AllReports'))

                let index = AllReports.findIndex(report => report.ncr_no == notificationText.text.slice(8, 16))
                let report = AllReports[index]
                if (Object.keys(report.engineering).length == 0) {

                    // engineering department person get the mail from qa (will show review and begin work)
                    li.innerHTML = `<strong>${notificationText.text.slice(0, 16)}</strong><br><br>Please review and begin work as assigned.`
                    li.addEventListener('click', () => {
                        // console.log()
                        window.location.href = `logged_NCR.html?${createQueryStringFromNotification(notificationText.text.slice(8, 16))}`
                    })
                } else {
                    li.innerHTML = `<strong>${notificationText.text.slice(0, 16)}</strong><br><br>Please review and begin work as assigned.`

                    li.addEventListener('click', () => {
                        // console.log()
                        showPopup('Report already Filled', `<strong>${notificationText.text.slice(0, 16)}</strong><br><br>has been already filled and sent to purchasing department.`, 'images/confirmationIcon.webp')
                    })
                }

            } else {
                // engineering department person sends the form to purchasing (will show has been sent to purchasing department)
                li.innerHTML = `<strong>${notificationText.text.slice(0, 16)}</strong><br><br>${notificationText.text.slice(17)}`
                li.addEventListener('click', () => {
                    // will show popup
                    showPopup('Notification Sent', `<strong>${notificationText.text.slice(0, 16)}</strong><br><br>${notificationText.text.slice(17)}`, 'images/confirmationIcon.webp')
                })
            }
        } else if (user.role == 'Purchasing') {
            if (notificationText.text.includes('Purchasing')) {
                let AllReports = JSON.parse(localStorage.getItem('AllReports'))

                let index = AllReports.findIndex(report => report.ncr_no == notificationText.text.slice(8, 16))
                let report = AllReports[index]
                if (Object.keys(report.purchasing_decision).length == 0) {

                    // purchasing department person get the mail from qa (will show review and begin work)
                    li.innerHTML = `<strong>${notificationText.text.slice(0, 16)}</strong><br><br>Please review and begin work as assigned.`
                    li.addEventListener('click', () => {
                        // console.log()
                        window.location.href = `purchasing_decision.html?${createQueryStringFromNotification(notificationText.text.slice(8, 16))}`
                    })
                } else {
                    li.innerHTML = `<strong>${notificationText.text.slice(0, 16)}</strong><br><br>Please review and begin work as assigned.`

                    li.addEventListener('click', () => {
                        // console.log()
                        showPopup('Report already Filled', `<strong>${notificationText.text.slice(0, 16)}</strong><br><br>has been already filled and notified to other departments.`, 'images/confirmationIcon.webp')
                    })
                }

            } else {
                // purchasing department person completes the form that's it.
                li.innerHTML = `<strong>${notificationText.text.slice(0, 16)}</strong><br><br>${notificationText.text.slice(17)}`
                li.addEventListener('click', () => {
                    // will show popup
                    showPopup('Notification Sent', `<strong>${notificationText.text.slice(0, 16)}</strong><br><br>${notificationText.text.slice(17)}`, 'images/confirmationIcon.webp')
                })
            }
        }
        else {
            li.innerHTML = `<strong>${notificationText.text.slice(0, 16)}</strong><br><br>${notificationText.text.slice(17)}`
            li.addEventListener('click', () => {
                // will show popup
                showPopup('Notification Sent', `<strong>${notificationText.text.slice(0, 16)}</strong><br><br>${notificationText.text.slice(17)}`, 'images/confirmationIcon.webp')
            })
        }



        notificationList.prepend(li)
    })
}


function sendNotification(ncrNum) {
    const notification = { text: `NCR No. ${ncrNum} has been complete by purchasing department.`, ischecked: false }
    let QANotification = JSON.parse(localStorage.getItem("QANotification"))
    let ERNotification = JSON.parse(localStorage.getItem("ERNotification"))
    let ADNotification = JSON.parse(localStorage.getItem("ADNotification"))

    // Retrieve existing notifications from localStorage or initialize as an empty array
    let PRNotifications = JSON.parse(localStorage.getItem('PRNotification')) || []

    // Add the new notification message
    PRNotifications.push(notification)
    QANotification.push(notification)
    ERNotification.push(notification)
    ADNotification.push(notification)


    // Save updated notifications back to localStorage
    localStorage.setItem('PRNotification', JSON.stringify(PRNotifications))
    localStorage.setItem('QANotification', JSON.stringify(QANotification))
    localStorage.setItem('ERNotification', JSON.stringify(ERNotification))
    localStorage.setItem('ADNotification', JSON.stringify(ADNotification))

    // Update the notification display
    setNotificationText()
}

// Create a query string from the NCR data
function createQueryStringFromNotification(ncrNo) {
    let AllReports = JSON.parse(localStorage.getItem('AllReports'))
    let index = AllReports.findIndex(report => report.ncr_no == ncrNo)
    let ncrData = AllReports[index]

    const { qa, engineering, purchasing_decision } = ncrData; // Destructure the NCR object
    return new URLSearchParams({
        ncr_no: ncrData.ncr_no,
        supplier_name: qa.supplier_name,
        po_no: qa.po_no,
        item_name: qa.item_name,
        sales_order_no: qa.sales_order_no,
        item_description: qa.item_description,
        quantity_received: qa.quantity_received,
        quantity_defective: qa.quantity_defective,
        description_of_defect: qa.description_of_defect,
        item_marked_nonconforming: qa.item_marked_nonconforming,
        quality_representative_name: qa.quality_representative_name,
        date: qa.date,
        resolved: qa.resolved,
        supplier_or_rec_insp: qa.process.supplier_or_rec_insp, // Add process data
        wip_production_order: qa.process.wip_production_order, // Add process data
        disposition: engineering.disposition,
        customer_notification_required: engineering.customer_notification_required,
        disposition_details: engineering.disposition_details,
        drawing_update_required: engineering.drawing_update_required,
        original_rev_number: engineering.original_rev_number,
        updated_rev_number: engineering.updated_rev_number,
        engineer_name: engineering.engineer_name,
        revision_date: engineering.revision_date,
        resolved_engineer: engineering.resolved,
        engineering_review_date: engineering.engineering_review_date,
        purchasing_decision: purchasing_decision.preliminary_decision,
        follow_up_required: purchasing_decision.follow_up_required,
        operations_manager_name: purchasing_decision.operations_manager_name,
        operations_manager_date: purchasing_decision.operations_manager_date,
        inspector_name: purchasing_decision.inspector_name,
        ncr_closed: purchasing_decision.ncr_closed,
        resolved_purchasing: purchasing_decision.resolved, // Rename to avoid conflicts
        new_ncr_number: purchasing_decision.new_ncr_number
    }).toString();
}

// Function to save data to localStorage
function saveDataToLocalStorage() {
    const reportData = {
        "dispositionOptions": document.getElementById('disposition-details-d')?.value || "",
        "dispositionDetails": document.getElementById("disposition-details-d").value,
        "drawingRequired": document.getElementById('drawing-update-required-d')?.value || "",
        "originalRevNumber": document.getElementById("original-rev-number-d").value,
        "updatedRevNumber": document.getElementById("updated-rev-number-d").value,
        "customerNotification": document.getElementById('customer-notification-required-d')?.value || "",
        "revisionDate": document.getElementById("revision-date-d").value,
        "engineeringReviewDate": document.getElementById("engineering-review-date-d").value,
        'resolved': document.getElementById('resolved-d')?.value || "",
        "ncr_no": document.getElementById('ncr-no-d').textContent,
        "supplier_name": document.getElementById('supplier-name-d').textContent,
        "po_no": document.getElementById('product-no-d').textContent,
        "sales_order_no": document.getElementById('sales-order-no-d').textContent,
        "item_description": document.getElementById('description-item-d').textContent,
        "quantity_received": document.getElementById('quantity-received-d').textContent,
        "quantity_defective": document.getElementById('quantity-defective-d').textContent,
        "description_of_defect": document.getElementById('description-defect-d').textContent,
        "item_marked_nonconforming": document.getElementById('item-marked-nonconforming-d').textContent,
        "quality_representative_name": document.getElementById('qa-name-d').textContent,
        "date": document.getElementById('qa-date-d').textContent,
        "identify_process": document.getElementById('process-d').textContent,
        "item_name": document.getElementById('item-name-d').textContent,
        "date_of_saved": new Date().toLocaleDateString(),
        "decision": document.getElementById("decision")?.value || "", // If not found, set empty string
        "return_options": document.getElementById("return-options")?.value || "",
        "follow_up_required": document.querySelector('input[name="follow-up"]:checked')?.value || "", // For radio buttons
        "follow_type": document.getElementById("follow-type")?.value || "",
        "follow_date": document.getElementById("follow-date")?.value || "",
        "car_raised": document.querySelector('input[name="car"]:checked')?.value || "", // For radio buttons
        "re_inspected_acceptable": document.querySelector('input[name="re-inspected"]:checked')?.value || "", // For radio buttons
        "car_number": document.getElementById("car-details")?.value || "",
        "new_ncr_number": document.getElementById("new-ncr-number")?.value || "",
        "inspector_name": document.getElementById("inspector-name")?.value || "",
        "ncr_date": document.getElementById("ncr-date")?.value || "",
        "quality_closure_date": document.getElementById("quality-date")?.value || "",
        "ncr_closed": document.querySelector('input[name="ncr-closed"]:checked')?.value || "", // For radio buttons
        "ncr_resolved": document.querySelector('input[name="ncr-resolved"]:checked')?.value || "" // For radio buttons

    };
    // Retrieve existing saved reports from localStorage
    let savedNCRspurch = JSON.parse(localStorage.getItem("savedNCRspurch")) || []

    // Check if a report with the same NCR No. already exists
    const existingReportIndex = savedNCRspurch.findIndex(report => report.ncr_no === reportData.ncr_no)

    if (existingReportIndex !== -1) {
        // If it exists, update the existing report
        savedNCRspurch[existingReportIndex] = reportData
    } else {
        // If it doesn't exist, add as a new report
        savedNCRspurch.push(reportData)
    }

    // Save the updated reports array back to localStorage
    localStorage.setItem("savedNCRspurch", JSON.stringify(savedNCRspurch))

    alert("Report saved successfully!")
}

document.getElementById("save1").addEventListener("click", (e) => {
    e.preventDefault()
    saveDataToLocalStorage()
})
document.getElementById("save2").addEventListener("click", (e) => {
    e.preventDefault()
    saveDataToLocalStorage()
})

function populateFormFromJson(data) {
    console.log(data);  // Log the data to check the structure

    // Set Preliminary Decision

    // Set the options if available
    // if (data.options) {
    //     document.querySelector("input[name='follow-up'][value='yes']").checked = !!data.options.rework_in_house;
    //     document.querySelector("input[name='follow-up'][value='no']").checked = !!data.options.scrap_in_house;
    //     document.querySelector("input[name='car'][value='yes']").checked = !!data.options.defer_to_engineering;
    //     toggleRadio(document.querySelector("input[name='follow-up'][value='yes']"));
    //     toggleRadio(document.querySelector("input[name='follow-up'][value='no']"));
    //     toggleRadio(document.querySelector("input[name='car'][value='yes']"));
    // }

    // Set Primary Decision
    document.getElementById("decision").value = data.decision || "";

    // Set Return Options (only shown if "Return to Supplier" is selected as Primary Decision)
    document.getElementById("return-options").value = data.return_options || "";

    // Set Follow-up Required
    const followUpRadioYes = document.querySelector("input[name='follow-up'][value='yes']");
    const followUpRadioNo = document.querySelector("input[name='follow-up'][value='no']");

    // Check if data.follow_up_required is "yes", set the "yes" radio button to checked, and the "no" radio button to unchecked.
    if (data.follow_up_required === "yes") {
        followUpRadioYes.checked = true;
        followUpRadioNo.checked = false;
        toggleCheck(followUpRadioYes);

    } else {
        // Otherwise, set the "no" radio button to checked, and "yes" radio button to unchecked.
        followUpRadioYes.checked = false;
        followUpRadioNo.checked = true;
        toggleCheck(followUpRadioNo);
    }

    // Apply the toggle effect (if needed)

    // Set Follow-up Type
    document.getElementById("follow-type").value = data.follow_type || "";

    // Set Follow-up Date
    document.getElementById("follow-date").value = data.follow_date || "";

    // Set CAR Raised
    // Get the radio buttons
    const carYesRadio = document.querySelector("input[name='car'][value='yes']");
    const carNoRadio = document.querySelector("input[name='car'][value='no']");

    // Use an if statement to check the condition and set the correct radio button
    if (data.car_raised === "yes") {
        carYesRadio.checked = true;
        carNoRadio.checked = false;
        toggleCheck(carYesRadio);
    } else if (data.car_raised === "no") {
        carYesRadio.checked = false;
        carNoRadio.checked = true;
        toggleCheck(carNoRadio);
    } else {
        // Handle any other case, if needed (e.g., default behavior)
        carYesRadio.checked = false;
        carNoRadio.checked = false;
    }



    // Set CAR Number
    document.getElementById("car-details").value = data.car_number || "";

    // Set Re-Inspected Acceptable
    // Get the radio buttons
    const reInspectedYesRadio = document.querySelector("input[name='re-inspected'][value='yes']");
    const reInspectedNoRadio = document.querySelector("input[name='re-inspected'][value='no']");

    // Use an if statement to check the condition and set the correct radio button
    if (data.re_inspected_acceptable === "yes") {
        reInspectedYesRadio.checked = true;
        reInspectedNoRadio.checked = false;
        toggleCheck(reInspectedYesRadio);
    } else if (data.re_inspected_acceptable === "no") {
        reInspectedYesRadio.checked = false;
        reInspectedNoRadio.checked = true;
        toggleCheck(reInspectedNoRadio);
    } else {
        // Handle any other case, if needed (e.g., default behavior)
        reInspectedYesRadio.checked = false;
        reInspectedNoRadio.checked = false;
    }

    // Set New NCR Number
    document.getElementById("new-ncr-number").value = data.new_ncr_number || "";

    // Set Inspector Name
    document.getElementById("inspector-name").value = data.inspector_name || "";

    // Set NCR Date
    document.getElementById("ncr-date").value = data.ncr_date || "";

    // Set Quality Department Closure Date
    document.getElementById("quality-date").value = data.quality_closure_date || "";

    // Set NCR Closed
    // Get the radio buttons
    const ncrClosedYesRadio = document.querySelector("input[name='ncr-closed'][value='yes']");
    const ncrClosedNoRadio = document.querySelector("input[name='ncr-closed'][value='no']");

    // Use an if statement to check the condition and set the correct radio button
    if (data.ncr_closed === "yes") {
        ncrClosedYesRadio.checked = true;
        ncrClosedNoRadio.checked = false;
        toggleCheck(ncrClosedYesRadio);
    } else if (data.ncr_closed === "no") {
        ncrClosedYesRadio.checked = false;
        ncrClosedNoRadio.checked = true;
        toggleCheck(ncrClosedNoRadio);
    } else {
        // Handle any other case, if needed (e.g., default behavior)
        ncrClosedYesRadio.checked = false;
        ncrClosedNoRadio.checked = false;
    }


    // Set NCR Resolved
    // Get the radio buttons
    const ncrResolvedYesRadio = document.querySelector("input[name='ncr-resolved'][value='yes']");
    const ncrResolvedNoRadio = document.querySelector("input[name='ncr-resolved'][value='no']");

    // Use an if statement to check the condition and set the correct radio button
    if (data.ncr_resolved === "yes") {
        ncrResolvedYesRadio.checked = true;
        ncrResolvedNoRadio.checked = false;
        toggleCheck(ncrResolvedYesRadio);
    } else if (data.ncr_resolved === "no") {
        ncrResolvedYesRadio.checked = false;
        ncrResolvedNoRadio.checked = true;
        toggleCheck(ncrResolvedNoRadio);
    } else {
        // Handle any other case, if needed (e.g., default behavior)
        ncrResolvedYesRadio.checked = false;
        ncrResolvedNoRadio.checked = false;
    }

    document.getElementById('ncr-no-d').textContent = data.ncr_no;
    document.getElementById('supplier-name-d').textContent = data.supplier_name;
    document.getElementById('product-no-d').textContent = data.po_no;
    document.getElementById('sales-order-no-d').textContent = data.sales_order_no;
    document.getElementById('description-item-d').textContent = data.item_description;
    document.getElementById('quantity-received-d').textContent = data.quantity_received;
    document.getElementById('quantity-defective-d').textContent = data.quantity_defective;
    document.getElementById('description-defect-d').textContent = data.description_of_defect;
    document.getElementById('item-marked-nonconforming-d').textContent = data.item_marked_nonconforming;
    document.getElementById('qa-name-d').textContent = data.quality_representative_name;
    document.getElementById('qa-name-d').textContent = data.quality_representative_name;
    document.getElementById('item-name-d').textContent = data.item_name;
    document.getElementById('process-d').textContent = data.identify_process;
    // document.querySelector('input[name="disposition-options"]:checked').value = data.dispositionOptions || "";
    document.getElementById("disposition-details-d").value = data.dispositionDetails || "";
    document.getElementById('drawing-update-required-d').value = data.drawingRequired || "";
    document.getElementById("original-rev-number-d").value = data.originalRevNumber || "";
    document.getElementById("updated-rev-number-d").value = data.updatedRevNumber || "";
    document.getElementById('customer-notification-required-d').value = data.customerNotification || "";
    document.getElementById("revision-date-d").value = data.revisionDate || "";
    document.getElementById("engineering-review-date-d").value = data.engineeringReviewDate || "";
    document.getElementById('resolved-d').value = data.resolved || "";
    document.getElementById("ncr-no-d").textContent = data.ncr_no || "";
    document.getElementById("supplier-name-d").textContent = data.supplier_name || "";
    document.getElementById("product-no-d").textContent = data.po_no || "";
    document.getElementById("sales-order-no-d").textContent = data.sales_order_no || "";
    document.getElementById("description-item-d").textContent = data.item_description || "";
    document.getElementById("quantity-received-d").textContent = data.quantity_received || "";
    document.getElementById("quantity-defective-d").textContent = data.quantity_defective || "";
    document.getElementById("description-defect-d").textContent = data.description_of_defect || "";
    document.getElementById("item-marked-nonconforming-d").textContent = data.item_marked_nonconforming || "";
    document.getElementById("qa-name-d").textContent = data.quality_representative_name || "";
    document.getElementById("qa-date-d").textContent = data.date || "";
    document.getElementById("process-d").textContent = data.identify_process || "";
    document.getElementById("item-name-d").textContent = data.item_name || "";
    document.getElementById("date-of-saved-d").textContent = data.date_of_saved || "";


}

clearNotification.addEventListener("click", () => {
    if (user.role == "QA Inspector") {
        localStorage.setItem('QANotification', JSON.stringify([]));

    }
    else if (user.role == "Lead Engineer") {
        localStorage.setItem('ERNotification', JSON.stringify([]));

    }
    else if (user.role == "Purchasing") {
        localStorage.setItem('PRNotification', JSON.stringify([]));

    }
    else if (user.role == "Admin") {
        localStorage.setItem('ADNotification', JSON.stringify([]));

    }
    setNotificationText()

})

function BackToTop(){
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
}
footer.addEventListener('click', () => {
    BackToTop()
})
btnBackToTop.addEventListener('click', ()=>{
    BackToTop()
})