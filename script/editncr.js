const user = JSON.parse(sessionStorage.getItem("currentUser"));
const footer = document.getElementById('footer-scroll')
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

footer.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})

const retrievedNCRData = JSON.parse(sessionStorage.getItem('data'))

const currentPage = window.location.pathname // Get current page path
const isCreateNCRPage = currentPage.includes('create') // Check if it's the Create NCR page

// Get all input fields and textareas
const inputFields = document.querySelectorAll('input, textarea, select')

// Function to disable all fields
const disableFields = () => {
    inputFields.forEach(field => {
        field.disabled = true // Disable each input field
    })
}

// Function to enable fields based on user role
const enableFieldsForRole = (role) => {
    if (role === 'QA Inspector') {
        document.querySelectorAll('.qa-editable').forEach(field => {
            field.disabled = false // Enable QA editable fields
        })
        // Enable radio buttons
        document.querySelectorAll('input[name="item_marked_nonconforming"]').forEach(radio => {
            radio.disabled = false // Enable all radio buttons
        })
        // Save changes when "Save" button is clicked
        document.querySelector('#qa-save').addEventListener('click', function () {
            if (validateQaSection()) {
                // Implement your save logic here, like sending the data to the server
                showPopup('Changes saved!') // Example feedback message
                // disableFields()

            }
            else {
                showPopup("Please fill in all the required fields before submitting.")
            }


        })

    } else if (role === 'Lead Engineer') {
        // console.log(user.role)
        document.querySelectorAll('.eng-editable').forEach(field => {
            field.disabled = false // Enable Engineering editable fields
        })
        // Save changes when "Save" button is clicked
        document.querySelector('#eng-save').addEventListener('click', function () {
            if (validateEngSection()) {

                // Implement your save logic here, like sending the data to the server
                showPopup('Changes saved!') // Example feedback message

                // Optionally, disable fields again after saving
                // disableFields()
            }
            else {
                showPopup("Please fill in all the required fields before submitting.")
            }
        })
    } else if (role === 'Purchasing') {
        document.querySelectorAll('.purch-editable').forEach(field => {
            field.disabled = false // Enable Purchasing editable fields
        })
        // Save changes when "Save" button is clicked
        document.querySelector('#purch-save').addEventListener('click', function () {
            if (validatePurchSection()) {
                showPopup('Changes saved!') // Example feedback message

                // disableFields()
            }
            else {
                showPopup("Please fill in all the required fields before submitting.")
            }
        })
    } else if (role === "Project Manager") {
        document.querySelectorAll('.qa-editable').forEach(field => {
            field.disabled = false // Enable QA editable fields
        })
        // Save changes when "Save" button is clicked
        document.querySelector('#qa-save').addEventListener('click', function () {
            if (validateQaSection()) {
                // Implement your save logic here, like sending the data to the server
                showPopup('Changes saved!') // Example feedback message
                // disableFields()

            }
            else {
                showPopup("Please fill in all the required fields before submitting.")
            }


        })
        document.querySelectorAll('.eng-editable').forEach(field => {
            field.disabled = false // Enable Engineering editable fields
        })// Enable radio buttons
        document.querySelectorAll('input[name="item_marked_nonconforming"]').forEach(radio => {
            radio.disabled = false // Enable all radio buttons
        })
        // Save changes when "Save" button is clicked
        document.querySelector('#eng-save').addEventListener('click', function () {
            if (validateEngSection()) {

                // Implement your save logic here, like sending the data to the server
                showPopup('Changes saved!') // Example feedback message

                // Optionally, disable fields again after saving
                // disableFields()
            }
            else {
                showPopup("Please fill in all the required fields before submitting.")
            }
        })
        document.querySelectorAll('.purch-editable').forEach(field => {
            field.disabled = false // Enable Purchasing editable fields
        })
        // Save changes when "Save" button is clicked
        document.querySelector('#purch-save').addEventListener('click', function () {
            if (validatePurchSection()) {
                showPopup('Changes saved!') // Example feedback message

                // disableFields()
            }
            else {
                showPopup("Please fill in all the required fields before submitting.")
            }
        })
    }



}

// On page load, disable fields based on user role
disableFields()
enableFieldsForRole(user.role)


// Select all details elements and toggle their open attribute based on the page
document.querySelectorAll('details').forEach(details => {
    details.setAttribute('open', !isCreateNCRPage) // Expand if not on Create NCR page
})

// Load data into input fields from the retrieved NCR data
loadData()

function loadData() {
    // Map input field IDs to their respective property names in the data object
    const fieldsMap = {
        'qa-name': 'quality_representative_name',
        'ncr-no': 'ncr_no',
        'sales-order-no': 'sales_order_no',
        'quantity-received': 'quantity_received',
        'quantity-defective': 'quantity_defective',
        'qa-date': 'date',
        'supplier-name': 'supplier_name',
        'product-no': 'product_no',
        'description-item': 'item_description',
        'description-defect': 'description_of_defect',
        'item-marked-yes': 'item_marked_nonconforming',
        'disposition-details': 'disposition_details',
        'customer-notification': 'customer_notification_required',
        'disposition-details': 'disposition_details',
        'original-rev-number': 'original_rev_number',
        'updated-rev-number': 'updated_rev_number',
        'engineer-name': 'engineer_name',
        'revision-date': 'revision_date',
        'preliminary-decision': 'preliminary_decision',
        'car-number': 'car_number',
        'operations-manager-name': 'operations_manager_name',
        'operations-manager-date': 'operations_manager_date',
        'new-ncr-number': 'new_ncr_number',
        'inspector-name': 'inspector_name'
    }

    // Populate input fields from the retrieved NCR data
    for (const [fieldId, paramName] of Object.entries(fieldsMap)) {
        const field = document.getElementById(fieldId)
        if (field && retrievedNCRData) {
            if (field.type === 'radio') {
                // Set the radio button checked state based on the value from the retrieved data
                const itemMarkedValue = retrievedNCRData[paramName] // Accessing the value directly
                if (itemMarkedValue === true) {
                    document.getElementById('item-marked-yes').checked = true
                } else if (itemMarkedValue === false) {
                    document.getElementById('item-marked-no').checked = true
                }
            } else {
                // Set the value of the field from retrievedNCRData
                field.value = retrievedNCRData[paramName] || '' // Fallback to an empty string if no value
            }
        }
    }

    // Assuming 'process' is a select element
    const processSelect = document.getElementById('process')
    const dispositionOptions = document.getElementById('disposition')
    const options = document.getElementById('options')

    if (retrievedNCRData['supplier_or_rec_insp']) {
        processSelect.value = 'supplier' // Set to 'supplier' if true
    } else if (retrievedNCRData['wip_production_order']) {
        processSelect.value = 'wip' // Set to 'wip' if true
    } else {
        processSelect.value = 'Not applicable' // Default to empty if both are false (or set to a specific option if needed)
    }

    if (retrievedNCRData.disposition_options.use_as_is) {
        dispositionOptions.value = 'use_as_is'
    } else if (retrievedNCRData.disposition_options.repair) {
        dispositionOptions.value = 'repair'

    } else if (retrievedNCRData.disposition_options.rework) {
        dispositionOptions.value = 'rework'

    } else if (retrievedNCRData.disposition_options.scrap) {
        dispositionOptions.value = 'scrap'
    }

    if (retrievedNCRData.options.rework_in_house) {
        options.value = 'rework_in_house'
    } else if (retrievedNCRData.options.scrap_in_house) {
        options.value = 'scrap_in_house'
    } else if (retrievedNCRData.options.defer_to_engineering) {
        options.value = 'defer_to_engineering'
    }



    // checking the checkboxes
    const engResolvedChk = document.getElementById('resolved')
    const CustNotif = document.getElementById('customer-notification')
    const drawingUpdate = document.getElementById('drawing-update-required')
    const carRaised = document.getElementById('car-raised')
    const followUp = document.getElementById('follow-up-required')
    const reInspect = document.getElementById('re-inspected-acceptable')
    const ncrClosed = document.getElementById('ncr-closed')
    const puResolved = document.getElementById('resolved')

    if (retrievedNCRData['eng_resolved']) {
        engResolvedChk.checked = true
    }
    if (retrievedNCRData['customer_notification_required']) {
        CustNotif.checked = true
    }
    if (retrievedNCRData['drawing_update_required']) {
        drawingUpdate.checked = true
    }
    if (retrievedNCRData['pu_resolved']) {
        puResolved.checked = true
    }
    if (retrievedNCRData['car_raised']) {
        carRaised.checked = true
    }
    if (retrievedNCRData['follow_up_required']) {
        followUp.checked = true
    }
    if (retrievedNCRData['re_inspected_acceptable']) {
        reInspect.checked = true
    }
    if (retrievedNCRData['ncr_closed']) {
        ncrClosed.checked = true
    }

}


const invalid = document.querySelectorAll('.required')
invalid.forEach(star => {
    star.style.display = 'none' // Hide each star element initially
})

function preventNegativeInput(event) {
    if (event.target.value < 0) {
        showPopup("The quantity cannot be in negative!!\nEnter only positive values.")
        event.target.value = 0
    }
}
const quantityReceivedInput = document.getElementById('quantity-received')
const quantityDefectiveInput = document.getElementById('quantity-defective')
// Attach the preventNegativeInput function to both inputs
quantityReceivedInput.addEventListener('input', preventNegativeInput)
quantityDefectiveInput.addEventListener('input', preventNegativeInput)

const validateQaSection = () => {
    let isValid = true
    const formElements = [
        'qa-name', 'ncr-no', 'sales-order-no', 'quantity-received',
        'quantity-defective', 'qa-date', 'supplier-name', 'product-no',
        'process', 'description-item', 'description-defect'
    ]



    formElements.forEach(field => {
        const inputElement = document.getElementById(field)
        const labelElement = document.querySelector(`label[for="${field}"]`)
        const invalid = labelElement.querySelector('.required')

        // Check if the input is empty
        if (inputElement.value.trim() === '' || inputElement.value.trim() == null) {
            invalid.style.display = 'inline' // Show star if empty
            isValid = false
        } else {
            invalid.style.display = 'none' // Hide star if filled
        }

        // Custom validation for number input
        if (inputElement.type === 'number' && isNaN(Number(inputElement.value))) {
            invalid.style.display = 'inline' // Show star if invalid number
            isValid = false
        }

        // Custom validation for date input
        if (inputElement.type === 'date' && !inputElement.value) {
            invalid.style.display = 'inline' // Show star if empty date
            isValid = false
        }
    })
    const quantityReceived = parseInt(quantityReceivedInput.value, 10)
    const quantityDefective = parseInt(quantityDefectiveInput.value, 10)


    // Check if quantities are valid numbers
    if (!isNaN(quantityReceived) && !isNaN(quantityDefective) && quantityDefective > quantityReceived) {
        showPopup('Quantity defective cannot be greater than quantity received!!')
        isValid = false
    }

    return isValid
}

const validatePurchSection = () => {
    const formElements = [
        'preliminary-decision',
        'options', 'car-number', 'operations-manager-name', 'operations-manager-date',
        'new-ncr-number', 'inspector-name'
    ]
    let isValid = true

    formElements.forEach(field => {
        const inputElement = document.getElementById(field)
        const labelElement = document.querySelector(`label[for="${field}"]`)
        const invalid = labelElement.querySelector('.required')

        // Check if the input is empty
        if (inputElement.value.trim() === '' || inputElement.value.trim() == null) {
            invalid.style.display = 'inline' // Show star if empty
            isValid = false
        } else {
            invalid.style.display = 'none' // Hide star if filled
        }

        // Custom validation for number input
        if (inputElement.type === 'number' && isNaN(Number(inputElement.value))) {
            invalid.style.display = 'inline' // Show star if invalid number
            isValid = false
        }

        // Custom validation for date input
        if (inputElement.type === 'date' && !inputElement.value) {
            invalid.style.display = 'inline' // Show star if empty date
            isValid = false
        }
    })

    return isValid
}

const validateEngSection = () => {
    const formElements = [
        'engineer-name',
        'disposition-details', 'original-rev-number', 'updated-rev-number',
        'revision-date', 'engineering-review-date'
    ]

    let isValid = true

    formElements.forEach(field => {
        const inputElement = document.getElementById(field)
        const labelElement = document.querySelector(`label[for="${field}"]`)
        const invalid = labelElement.querySelector('.required')

        // Check if the input is empty
        if (inputElement.value.trim() === '' || inputElement.value.trim() == null) {
            invalid.style.display = 'inline' // Show star if empty
            isValid = false
        } else {
            invalid.style.display = 'none' // Hide star if filled
        }

        // Custom validation for number input
        if (inputElement.type === 'number' && isNaN(Number(inputElement.value))) {
            invalid.style.display = 'inline' // Show star if invalid number
            isValid = false
        }

        // Custom validation for date input
        if (inputElement.type === 'date' && !inputElement.value) {
            invalid.style.display = 'inline' // Show star if empty date
            isValid = false
        }
    })

    return isValid
}
// Get the modal
const modal = document.getElementById("popup")

// Get the button that opens the modal
// const btn = document.getElementById("openPopup")

// Get the <span> element that closes the modal
const span = document.getElementById("closePopup")


// Show the modal with a title, message, and icon
function showPopup(title, message, icon, callback) {
    const modalContent = modal.querySelector('.modal-content')
    modalContent.querySelector('h2').innerText = title // Set the title
    modalContent.querySelector('p').innerText = message // Set the message

    const iconDiv = document.querySelector('.icon')
    // Clear previous icons
    iconDiv.innerHTML = ''
    const imgElement = document.createElement('img')
    imgElement.src = icon // Replace with your image URL
    iconDiv.appendChild(imgElement)

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