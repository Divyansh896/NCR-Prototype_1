// Gettting JSON Data from the local storage
const user = JSON.parse(sessionStorage.getItem("currentUser"))
let AllReports = JSON.parse(localStorage.getItem('AllReports'))
let suppliers = JSON.parse(localStorage.getItem('suppliers'))

const footer = document.getElementById('footer-scroll')
const userName = document.getElementById('userName');
const notificationlist = document.getElementById('notification-list');
const notificationCount = document.getElementById('notification-count');


setNotificationText()
updateToolContent()
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
                updateNCRReport()
                // Implement your save logic here, like sending the data to the server
                showPopup('Changes saved', "Report has been updated", "images/green-check.webp") // Example feedback message
                // disableFields()

            }
            else {
                showPopup("Required Fields Missing", "Please fill in all the required fields before submitting.", "images/1382678.webp")
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
                updateNCRReport()
                // Implement your save logic here, like sending the data to the server
                showPopup('Changes saved', "Report has been updated", "images/green-check.webp") // Example feedback message

                // Optionally, disable fields again after saving
                // disableFields()
            }
            else {
                showPopup("Required Fields Missing", "Please fill in all the required fields before submitting.", "images/1382678.webp")
            }
        })
    } else if (role === 'Purchasing') {
        document.querySelectorAll('.purch-editable').forEach(field => {
            field.disabled = false // Enable Purchasing editable fields
        })
        // Save changes when "Save" button is clicked
        document.querySelector('#purch-save').addEventListener('click', function () {
            if (validatePurchSection()) {
                updateNCRReport()
                showPopup('Changes saved', "Report has been updated", "images/green-check.webp") // Example feedback message

                // disableFields()
            }
            else {
                showPopup("Required Fields Missing", "Please fill in all the required fields before submitting.", "images/1382678.webp")
            }
        })
    } else if (role === "Admin") {
        document.querySelectorAll('.qa-editable').forEach(field => {
            field.disabled = false // Enable QA editable fields
        })
        // Save changes when "Save" button is clicked
        document.querySelector('#qa-save').addEventListener('click', function () {
            if (validateQaSection()) {
                updateNCRReport()
                // Implement your save logic here, like sending the data to the server
                showPopup('Changes saved', "Report has been updated", "images/green-check.webp") // Example feedback message
                // disableFields()

            }
            else {
                showPopup("Required Fields Missing", "Please fill in all the required fields before submitting.", "images/1382678.webp")
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
                showPopup('Changes saved', "Report has been updated", "images/green-check.webp") // Example feedback message

                // Optionally, disable fields again after saving
                // disableFields()
            }
            else {
                showPopup("Required Fields Missing", "Please fill in all the required fields before submitting.", "images/1382678.webp")
            }
        })
        document.querySelectorAll('.purch-editable').forEach(field => {
            field.disabled = false // Enable Purchasing editable fields
        })
        // Save changes when "Save" button is clicked
        document.querySelector('#purch-save').addEventListener('click', function () {
            if (validatePurchSection()) {
                showPopup('Changes saved', "Report has been updated", "images/green-check.webp") // Example feedback message

                // disableFields()
            }
            else {
                showPopup("Required Fields Missing", "Please fill in all the required fields before submitting.", "images/1382678.webp")
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
console.log(retrievedNCRData)
function loadData() {
    // Map input field IDs to their respective property names in the data object
    const fieldsMap = {
        'qa-name': 'qa.quality_representative_name',
        'ncr-no': 'ncr_no',
        'sales-order-no': 'qa.sales_order_no',
        'quantity-received': 'qa.quantity_received',
        'quantity-defective': 'qa.quantity_defective',
        'qa-date': 'qa.date',
        'product-no': 'qa.po_no',
        'description-item': 'qa.item_description',
        'description-defect': 'qa.description_of_defect',
        'item-marked-yes': 'qa.item_marked_nonconforming',
        'resolvedQA': 'qa.resolved',
        'disposition-details': 'engineering.disposition_details',
        'customer-notification': 'engineering.customer_notification_required',
        'original-rev-number': 'engineering.original_rev_number',
        'updated-rev-number': 'engineering.updated_rev_number',
        'engineer-name': 'engineering.engineer_name',
        'revision-date': 'engineering.revision_date',
        'engineering-review-date': 'engineering.engineering_review_date',
        'preliminary-decision': 'purchasing_decision.preliminary_decision',
        'resolvedEng': 'engineering.resolved',
        'car-number': 'purchasing_decision.car_number',
        'operations-manager-name': 'purchasing_decision.operations_manager_name',
        'operations-manager-date': 'purchasing_decision.operations_manager_date',
        'new-ncr-number': 'purchasing_decision.new_ncr_number',
        'inspector-name': 'purchasing_decision.inspector_name',
        'resolvedPurch': 'purchasing_decision.resolved'
    };

    // Populate input fields from the retrieved NCR data
    for (const [fieldId, paramName] of Object.entries(fieldsMap)) {
        const field = document.getElementById(fieldId);
        if (field && retrievedNCRData) {
            // Dynamically access the nested property from retrievedNCRData
            const value = paramName.split('.').reduce((obj, prop) => obj ? obj[prop] : undefined, retrievedNCRData);

            // Only update fields if data is available and the field is empty
            if (value !== null && value !== undefined && field.value === '') {
                field.value = value || ''; // Fallback to an empty string if no value
            }
        }
    }

    // Handle the process select dropdown
    const processSelect = document.getElementById('process');
    if (retrievedNCRData.qa.process) {
        if (retrievedNCRData.qa.process.supplier_or_rec_insp) {
            processSelect.value = 'Supplier or Rec-Insp';
        } else if (retrievedNCRData.qa.process.wip_production_order) {
            processSelect.value = 'WIP (Production order)';
        } else {
            processSelect.value = 'Not applicable'; // Default to empty if both are false
        }
    }

    // Handle the disposition options (same fix as above)
    const dispositionOptions = document.getElementById('disposition');
    dispositionOptions.value = retrievedNCRData.engineering.disposition.toLowerCase()
    // Handle options select field
    const options = document.getElementById('options');
    if (retrievedNCRData.purchasing_decision) {
        const purchasingOptions = retrievedNCRData.purchasing_decision.options || {};
        if (purchasingOptions.rework_in_house) {
            options.value = 'rework_in_house';
        } else if (purchasingOptions.scrap_in_house) {
            options.value = 'scrap_in_house';
        } else if (purchasingOptions.defer_to_engineering) {
            options.value = 'defer_to_engineering';
        }
    }

    const itemOptions = document.getElementById('item-name')
    itemOptions.value = retrievedNCRData.qa.item_name

    // Checking checkboxes
    const checkboxes = {
        'resolvedQA': 'qa.resolved',
        'resolvedPurch': 'purchasing_decision.resolved',
        'resolvedEng': 'engineering.resolved',
        'customer-notification': 'engineering.customer_notification_required',
        'drawing-update-required': 'engineering.drawing_update_required',
        'car-raised': 'purchasing_decision.car_raised',
        'follow-up-required': 'purchasing_decision.follow_up_required',
        're-inspected-acceptable': 'purchasing_decision.re_inspected_acceptable',
        'ncr-closed': 'purchasing_decision.ncr_closed',
        'resolvedPurch': 'purchasing_decision.resolved',
        'item-marked-nonconforming': 'qa.item_marked_nonconforming'
    };

    for (const [checkboxId, paramName] of Object.entries(checkboxes)) {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox && retrievedNCRData) {
            const value = paramName.split('.').reduce((obj, prop) => obj ? obj[prop] : undefined, retrievedNCRData);

            if (value !== null && value !== undefined) {
                checkbox.checked = value;
            }
        }
    }
    // Correcting the item marked nonconforming radio button logic for 'Yes' and 'No'
    const itemMarkedYes = document.getElementById('item-marked-yes'); // Radio button for Yes
    const itemMarkedNo = document.getElementById('item-marked-no');   // Radio button for No

    // Checking the 'item_marked_nonconforming' value from 'qa' object
    if (retrievedNCRData.qa && retrievedNCRData.qa.item_marked_nonconforming !== undefined) {
        // If 'item_marked_nonconforming' is true, select the 'Yes' radio button
        if (retrievedNCRData.qa.item_marked_nonconforming === true) {
            itemMarkedYes.checked = true; // Mark 'Yes' as checked
            itemMarkedNo.checked = false; // Unmark 'No'
        } else {
            itemMarkedYes.checked = false; // Unmark 'Yes'
            itemMarkedNo.checked = true;  // Mark 'No' as checked
        }
    }



}



// Function to update an NCR report
function updateNCRReport() {

    // Get the values from the input fields based on the provided IDs
    let ncrNo = document.getElementById('ncr-no').value; // NCR No.

    let reportIndex = AllReports.findIndex(report => report.ncr_no === ncrNo);

    let data = AllReports[reportIndex]

    let qaName = document.getElementById('qa-name').value; // QA Name
    let salesOrderNo = document.getElementById('sales-order-no').value; // Sales Order No.
    let quantityReceived = document.getElementById('quantity-received').value; // Quantity Received
    let quantityDefective = document.getElementById('quantity-defective').value; // Quantity Defective
    let qaDate = document.getElementById('qa-date').value; // QA Date
    let supplierName = document.getElementById('supplier-name').value; // Supplier Name
    let productNo = document.getElementById('product-no').value; // Product No.
    let processValue = document.getElementById('process').value; // Process
    let descriptionItem = document.getElementById('description-item').value; // Description of Item
    let descriptionDefect = document.getElementById('description-defect').value; // Description of Defect
    const itemNonconforming = document.querySelector('input[name="item_marked_nonconforming"]:checked')?.value === 'yes' ? true : false;
    let itemMarkedYes = document.getElementById('item-marked-yes').checked; // Item Marked Yes (Checkbox)
    let itemMarkedNo = document.getElementById('item-marked-no').checked; // Item Marked No (Checkbox)
    let resolvedQA = document.getElementById('resolvedQA').checked; // Resolved (Checkbox)
    let itemName = document.getElementById('item-name').value

    let engineerName = document.getElementById('engineer-name').value; // Engineer Name
    let disposition = document.getElementById('disposition').value; // Disposition
    let originalRevNumber = document.getElementById('original-rev-number').value; // Original Revision Number
    let updatedRevNumber = document.getElementById('updated-rev-number').value; // Updated Revision Number
    let revisionDate = document.getElementById('revision-date').value; // Revision Date
    let engineeringReviewDate = document.getElementById('engineering-review-date').value; // Engineering Review Date
    let dispositionDetails = document.getElementById('disposition-details').value; // Disposition Details
    let customerNotification = document.getElementById('customer-notification').checked; // Customer Notification Required (Checkbox)
    let drawingUpdateRequired = document.getElementById('drawing-update-required').checked; // Drawing Update Required (Checkbox)
    let resolvedEng = document.getElementById('resolvedEng').checked

    let preliminaryDecision = document.getElementById('preliminary-decision').value;
    let option = document.getElementById('options').value;
    let carNumber = document.getElementById('car-number').value;
    let operationsManagerName = document.getElementById('operations-manager-name').value;
    let operationsManagerDate = document.getElementById('operations-manager-date').value;
    let newNCRNumber = document.getElementById('new-ncr-number').value;
    let inspectorName = document.getElementById('inspector-name').value;

    // Checkbox values (true if checked, false if not)
    let carRaised = document.getElementById('car-raised').checked;
    let reInspectedAcceptable = document.getElementById('re-inspected-acceptable').checked;
    let followUpRequired = document.getElementById('follow-up-required').checked;
    let ncrClosed = document.getElementById('ncr-closed').checked;
    let resolvedpurch = document.getElementById('resolvedPurch').checked;


    // Update process object based on the selection
    let process = {
        supplier_or_rec_insp: false,
        wip_production_order: false
    };

    // Update the process object based on the selected dropdown value
    if (processValue === 'Supplier or Rec-Insp') {
        process.supplier_or_rec_insp = true;
    } else if (processValue === 'WIP (Production order)') {
        process.wip_production_order = true;
    } else if (processValue === 'Not applicable') {
        process.supplier_or_rec_insp = false;
        process.wip_production_order = false;
    }
    AllReports[reportIndex].ncr_no = ncrNo;
    AllReports[reportIndex].qa = {
        supplier_name: supplierName,
        po_no: productNo,
        item_name: itemName,
        sales_order_no: salesOrderNo,
        item_description: descriptionItem,
        quantity_received: quantityReceived,
        quantity_defective: quantityDefective,
        description_of_defect: descriptionDefect,
        item_marked_nonconforming: itemNonconforming,
        quality_representative_name: qaName,
        date: qaDate,
        resolved: resolvedQA,
        process: process
    }


    AllReports[reportIndex].engineering = {
        disposition: disposition,
        disposition_options: {
            use_as_is: disposition === 'use_as_is',
            repair: disposition === 'repair',
            rework: disposition === 'rework',
            scrap: disposition === 'scrap'
        },
        customer_notification_required: customerNotification,
        disposition_details: dispositionDetails,
        drawing_update_required: drawingUpdateRequired,
        original_rev_number: originalRevNumber,
        updated_rev_number: updatedRevNumber,
        engineer_name: engineerName,
        revision_date: revisionDate,
        engineering_review_date: engineeringReviewDate,
        resolved: resolvedEng
    };


    AllReports[reportIndex].purchasing_decision = {
        preliminary_decision: preliminaryDecision,
        options: {
            rework_in_house: option === 'rework_in_house',
            scrap_in_house: option === 'scrap_in_house',
            defer_to_engineering: option === 'defer_to_engineering'
        },
        car_raised: carRaised,
        car_number: carNumber,
        follow_up_required: followUpRequired,
        operations_manager_name: operationsManagerName,
        operations_manager_date: operationsManagerDate,
        re_inspected_acceptable: reInspectedAcceptable,
        new_ncr_number: newNCRNumber,
        inspector_name: inspectorName,
        ncr_closed: ncrClosed,
        resolved: resolvedpurch // resolved flag from the purchasing decision
    };

    sessionStorage.setItem('data', JSON.stringify(data))

    localStorage.setItem('AllReports', JSON.stringify(AllReports))

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
        'process', 'description-item', 'description-defect', 'item-name'
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
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('breadcrumbTrail')
    location.replace('index.html')
}
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
        if (user.role == 'Lead Engineer') {

            if (notificationText.includes('Engineering')) {
                // engineering department person get the mail from qa (will show review and begin work)
                li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>Please review and begin work as assigned.`;
            } else {
                // engineering department person sends the form to purchasing (will show has been sent to purchasing department)
                li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>${notificationText.slice(17)}`;
            }
        }
        else {
            li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>${notificationText.slice(17)}`;

        }


        notificationList.prepend(li);
    });
}

function updateToolContent() {
    const toolsContainer = document.querySelector('.tools')
    const emp = document.getElementById('add-emp')
    const supplier = document.getElementById('add-sup')
    if (user.role == "QA Inspector") {
        emp.style.display = 'none'
    }
    else if (user.role == "Lead Engineer" || user.role == "Purchasing") {
        toolsContainer.style.display = 'none'
    }
}



function populateSuppliers() {
    const supplierDropdown = document.getElementById("supplier-name");

    // Clear all existing dynamically added options
    supplierDropdown.innerHTML = ""; // Clear all options

    // Dynamically add options from suppliers list
    suppliers.forEach(supplier => {
        const option = document.createElement("option");
        option.value = supplier.supplierName;
        option.textContent = supplier.supplierName;
        supplierDropdown.appendChild(option); // Insert before "Add a Supplier"
    });

    supplierDropdown.value = retrievedNCRData.qa.supplier_name


}
populateSuppliers()
