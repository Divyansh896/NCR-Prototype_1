// Gettting JSON Data from the local storage
const user = JSON.parse(sessionStorage.getItem("currentUser"))
let AllReports = JSON.parse(localStorage.getItem('AllReports'))

const savedData = JSON.parse(localStorage.getItem('savedNCRs'));
const nextBtn1 = document.getElementById("next-btn1")
const nextBtn2 = document.getElementById("next-btn2")
const backBtn1 = document.getElementById("back-btn1")
const backBtn2 = document.getElementById("back-btn2")
const clearBtn1 = document.getElementById("clear-btn1")
const clearBtn2 = document.getElementById("clear-btn2")
const submitBtn = document.getElementById("submit-btn")
const starElements = document.querySelectorAll('.required');
const dateOfReport = new Date().toLocaleDateString()

const footer = document.getElementById('footer-scroll')

const qadropdown = document.getElementById('qa-section')
const engdropdown = document.getElementById('eng-section')
const purchdropdown = document.getElementById('purch-section')
const notificationlist = document.getElementById('notification-list');
const notificationCount = document.getElementById('notification-count');
setNotificationText()


// Get the modal
const userName = document.getElementById('userName');
userName.innerHTML = `${user.firstname}  ${user.lastname}`
const queryParams = new URLSearchParams(window.location.search)
loadData(queryParams)
// console.log(savedData)
// Add keyboard navigation functionality
document.addEventListener('keydown', function (event) {
    // Check if the focused element is a radio button label
    const focusedElement = document.activeElement;

    if (focusedElement && focusedElement.classList.contains('radio-button')) {
        // Check if "Enter" key is pressed
        if (event.key === 'Enter') {
            const radio = focusedElement.querySelector('input[type="radio"]');
            if (radio) {
                // Simulate a click on the radio button
                radio.click();
                toggleRadio(radio);
            }
        }
    }
});
const params = new URLSearchParams(window.location.search);
const ncrNo = params.get('ncr_no');
document.addEventListener("DOMContentLoaded", () => {
    // Get `ncr_no` from the URL query parameters

    if (!ncrNo) {
        console.warn("NCR number is not available in the query parameters.");
        return; // Exit if there's no NCR number
    }

    console.log("NCR Number from URL:", ncrNo); // Debugging output to check if `ncr_no` is retrieved

    // Retrieve saved NCRs from local storage
    const savedDataArray = JSON.parse(localStorage.getItem('savedNCRs')) || [];

    // Find the matching saved NCR by `ncr_no`
    const savedData = savedDataArray.find(ncr => ncr.ncr_no === ncrNo);

    if (savedData) {
        console.log("Matching saved NCR found:", savedData); // Debugging output

        // Prefill fields from saved data if a match is found
        prefillFormFromSavedData(savedData);
    } else {
        console.warn("No matching saved NCR found for NCR No:", ncrNo);
    }
});

function prefillFormFromSavedData(savedData) {
    // Prefill Disposition Radio Button
    if (savedData.dispositionOptions) {
        console.log("Prefilling Disposition Options with:", savedData.dispositionOptions); // Debugging output
        const dispositionOptions = document.getElementsByName("disposition-options");
        dispositionOptions.forEach(option => {
            if (option.value === savedData.dispositionOptions) {
                option.checked = true;
                option.parentElement.classList.add('checked'); // Add visual styling if necessary
            }
        });
    }

    // Prefill Drawing Required Radio Button
    if (savedData.drawingRequired) {

        const drawingRequiredOptions = document.getElementsByName("drawing-required");
        drawingRequiredOptions.forEach(option => {
            if (option.value === savedData.drawingRequired) {
                option.checked = true;
                option.parentElement.classList.add('checked');
            }
        });
    }

    // Prefill Customer Notification Needed Radio Button
    if (savedData.customerNotification) {

        const customerNotifOptions = document.getElementsByName("customer-notif");
        customerNotifOptions.forEach(option => {
            if (option.value === savedData.customerNotification) {
                option.checked = true;
                option.parentElement.classList.add('checked');
            }
        });
    }

    // Prefill Resolved Radio Button
    if (savedData.resolved) {
        console.log("Prefilling Resolved with:", savedData.resolved); // Debugging output
        const resolvedOptions = document.getElementsByName("resolved");
        resolvedOptions.forEach(option => {
            if (option.value === savedData.resolved) {
                option.checked = true;
                option.parentElement.classList.add('checked');
            }
        });
    }

    // Prefill other input fields (similar as before)
    if (savedData.dispositionDetails) {
        document.getElementById("disposition-details").value = savedData.dispositionDetails;
    }
    if (savedData.originalRevNumber) {
        document.getElementById("original_rev_number").value = savedData.originalRevNumber;
    }
    if (savedData.updatedRevNumber) {
        document.getElementById("updated_rev_number").value = savedData.updatedRevNumber;
    }
    if (savedData.revisionDate) {
        document.getElementById("revision_date").value = savedData.revisionDate;
    }
    if (savedData.engineeringReviewDate) {
        document.getElementById("engineering_review_date").value = savedData.engineeringReviewDate;
    }

    document.getElementById('ncr-no-d').textContent = savedData.supplier_name;
    document.getElementById('supplier-name-d').textContent = savedData.supplier_name;
    document.getElementById('product-no-d').textContent = savedData.po_no;
    document.getElementById('sales-order-no-d').textContent = savedData.sales_order_no;
    document.getElementById('description-item-d').textContent = savedData.item_description;
    document.getElementById('quantity-received-d').textContent = savedData.quantity_received;
    document.getElementById('quantity-defective-d').textContent = savedData.quantity_defective;
    document.getElementById('description-defect-d').textContent = savedData.description_of_defect;
    document.getElementById('item-marked-nonconforming-d').textContent = savedData.item_marked_nonconforming;
    document.getElementById('qa-name-d').textContent = savedData.quality_representative_name;
    document.getElementById('qa-name-d').textContent = savedData.quality_representative_name;
    document.getElementById('item-name-d').textContent = savedData.item_name;
    document.getElementById('process-d').textContent = savedData.identify_process;
    // Prefill QA Fields if present

}

document.addEventListener('DOMContentLoaded', () => {
    let isModalOpen = false;
    let pendingNavigationURL = null;
    let allowNavigation = false;

    // Get elements
    const leaveConfirmationModal = document.getElementById('leaveConfirmationModal');
    const saveAndLeaveBtn = document.getElementById('saveAndLeaveBtn');
    const leaveWithoutSavingBtn = document.getElementById('leaveWithoutSavingBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // Function to show the modal
    function showLeaveConfirmationModal(url) {
        leaveConfirmationModal.style.display = 'block'; // Set display to block to make modal visible
        pendingNavigationURL = url; // Store the URL the user wanted to navigate to

        // Add a slight delay before making the modal fully opaque to trigger CSS transition
        setTimeout(() => {
            leaveConfirmationModal.querySelector('.modal-content').style.opacity = '1';
            leaveConfirmationModal.querySelector('.modal-content').style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10); // Small delay for transition to apply

        isModalOpen = true;
    }

    // Function to hide the modal
    function hideLeaveConfirmationModal() {
        leaveConfirmationModal.querySelector('.modal-content').style.opacity = '0';
        leaveConfirmationModal.querySelector('.modal-content').style.transform = 'translate(-50%, -50%) scale(0.95)';

        // Wait for the transition to finish before actually hiding the modal
        setTimeout(() => {
            leaveConfirmationModal.style.display = 'none';
        }, 500); // Match the transition duration in your CSS

        isModalOpen = false;
    }

    // Attach the event listener for "Save and Leave" button
    saveAndLeaveBtn.addEventListener('click', () => {
        saveFormData(); // Save the current data
        allowNavigation = true; // Allow navigation to proceed
        hideLeaveConfirmationModal();
        if (pendingNavigationURL) {
            window.location.href = pendingNavigationURL; // Redirect to the stored URL
        }
    });

    // Attach the event listener for "Leave Without Saving" button
    leaveWithoutSavingBtn.addEventListener('click', () => {
        allowNavigation = true; // Allow navigation to proceed
        hideLeaveConfirmationModal();
        if (pendingNavigationURL) {
            window.location.href = pendingNavigationURL; // Redirect to the stored URL
        }
    });

    // Attach the event listener for "Cancel" button
    cancelBtn.addEventListener('click', () => {
        hideLeaveConfirmationModal(); // Simply hide the modal
    });

    closeModal.addEventListener('click', () => {
        hideLeaveConfirmationModal(); // Simply hide the modal
    });
    
    leaveConfirmationModal.addEventListener('click', (event) => {
        if (event.target === leaveConfirmationModal) {
            hideLeaveConfirmationModal();
        }
    });

    // Attach click event listener to all links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default navigation
            showLeaveConfirmationModal(link.href); // Show the custom modal with the link URL
        });
    });

    // Handle window close detection via beforeunload (suppress default behavior)
    function beforeUnloadHandler(event) {
        if (!allowNavigation && !isModalOpen) {
            event.preventDefault();
            showLeaveConfirmationModal(null);
            return ''; // Required for some browsers to prevent navigation
        }
    }

    // Attach the "beforeunload" event listener
    window.addEventListener('beforeunload', beforeUnloadHandler);
});
//hide errors in the beggining
starElements.forEach(star => {
    star.style.display = 'none'; // Hide each star element
});

function showDescriptionMessage() {
    // Get the value of the selected option
    const selectedOption = document.querySelector('input[name="disposition-options"]:checked').value;
    const message = document.getElementById("descriptionMessage");

    // Display the message if 'Repair' or 'Rework' is selected
    if (selectedOption === "Repair" || selectedOption === "Rework") {
        message.style.display = "block";
    } else {
        message.style.display = "none";
    }
}

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

    //chekboxes and radio buttons formatted as buttons for design purposes
    function toggleCheck(checkbox) {
        checkbox.parentElement.classList.toggle('checked', checkbox.checked);
    }

    function toggleRadio(radio) {

        radioName = radio.name;
        const buttons = document.querySelectorAll(`input[name="${radioName}"]`);

        // Remove 'checked' class from all radio button labels
        buttons.forEach(button => button.parentElement.classList.remove('checked'));

        // Add 'checked' class only to the selected radio button's label
        if (radio.checked) {
            radio.parentElement.classList.add('checked');
        }
    }

    // Add event listeners for navigation buttons
    nextBtn1.addEventListener("click", () => {
        if (validateSection1()) {
            sections[currentStep].classList.remove("active")
            currentStep++
            sections[currentStep].classList.add("active")
            updateStatusBar()
        }
        else {
            showPopup('Required fields missing', 'Please fill in required fields before proceeding.', 'images/1382678.webp')
        }
    })

    nextBtn2.addEventListener("click", () => {
        if (validateSection2()) {
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

    //clear button event
    function clearSection(section) {
        const inputsToClear = section.querySelectorAll('input[type="text"], textarea')
        inputsToClear.forEach(input => {
            // Check if the input is not the NCR number field
            if (input.id !== 'ncr-no-generated') {
                input.value = '' // Clear value
            }
        })

        section.querySelectorAll('.error').forEach(error => error.textContent = '') // Clear error messages
    }

    // Event listener for the submit button
    submitBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default form submission

        // Show the popup and wait for it to close
        showPopup('Form submitted', 'Your Engineering department form has been sent to the purchasing department and your automated mail is generated.', '<i class="fa fa-envelope" aria-hidden="true"></i>', () => {
            // This callback will execute after the popup is closed
            submitForm()
            sendMail(); // Call the email sending function
            window.location.href = "Dashboard.html"; // Redirect to home.html
            sendNotification(ncrNo)
        });
    });

    // Clear fields in Section 1
    document.getElementById("clear-btn1").addEventListener("click", () => {
        const section1 = document.querySelector('fieldset[aria-labelledby="step1-legend"]')
        clearSection(section1)

        //Clear radio buttons
        const radioButtons = document.querySelectorAll('input[name="drawing-required"]');
        radioButtons.forEach(radioButtons => {
            radioButtons.checked = false
            radioButtons.parentElement.classList.remove('checked')
        });

        //clear the instruction for disposition details
        document.getElementById("descriptionMessage").style.display = "none";

        const radioButtons1 = document.querySelectorAll('input[name="disposition-options"]');
        radioButtons1.forEach(radioButtons1 => {
            radioButtons1.checked = false
            radioButtons1.parentElement.classList.remove('checked')
        });


    })

    // Clear fields in Section 2
    document.getElementById("clear-btn2").addEventListener("click", () => {
        const section2 = document.querySelector('fieldset[aria-labelledby="step2-legend"]')
        clearSection(section2)

        // Clear radio buttons
        const radioButtons1 = document.querySelectorAll('input[name="customer-notif"]');
        radioButtons1.forEach(radioButtons1 => {
            radioButtons1.checked = false
            radioButtons1.parentElement.classList.remove('checked')
        });

        const radioButtons2 = document.querySelectorAll('input[name="resolved"]');
        radioButtons2.forEach(radioButtons2 => {
            radioButtons2.checked = false
            radioButtons2.parentElement.classList.remove('checked')
        });

        //Clear date pickers
        const datePicker1 = document.getElementById("revision_date")
        datePicker1.value = null;
        const datePicker2 = document.getElementById("engineering_review_date")
        datePicker2.value = null;

    })


    //validate section 1
    function validateSection1() {
        let isValid = true;

        // Reset all error messages
        const errorMessages = {
            'disposition-details': ''
        };

        const requiredFields = [
            'disposition-details'
        ];

        requiredFields.forEach(field => {
            const inputElement = document.getElementById(field);
            const errorSpan = document.getElementById(`${field}-error`);

            // Check if the input is empty
            if (inputElement.value.trim() === '') {
                errorMessages[field] = `${field.replace('-', ' ')} is required.`; // Set error message
                errorSpan.style.display = 'inline'; // Show error message
                errorSpan.textContent = errorMessages[field]; // Set the error message
                isValid = false;
            } else {
                errorSpan.style.display = 'none'; // Hide error if filled
            }
        });


        //validate radio buttons
        const radioButtons = document.querySelectorAll('input[name="disposition-options"]');
        const radioErrorSpan = document.getElementById('disposition-options-error');

        if (![...radioButtons].some(radio => radio.checked)) {
            // console.log(radioErrorSpan)
            radioErrorSpan.style.display = 'inline'; // Show error message
            radioErrorSpan.textContent = 'Please select one of the Review by CF Engineer options'; // Set error message
            isValid = false;
        } else {
            radioErrorSpan.style.display = 'none'; // Hide error if valid
        }

        // Clear specific error messages for non-empty fields
        for (const field of requiredFields) {
            const errorSpan = document.getElementById(`${field}-error`);
            if (errorMessages[field] === '') {
                errorSpan.style.display = 'none'; // Hide error if no error
            }
        }
        const drawingRadiobtn = document.querySelectorAll('input[name="drawing-required"]');
        const drawingError = document.getElementById('drawing-required-error')
        if (![...drawingRadiobtn].some(radio => radio.checked)) {
            drawingError.style.display = "inline"
            drawingError.textContent = "Please select drawing update is required or not!"
            isValid = false
        }
        else {
            drawingError.style.display = 'none'
            let selectedRadio = null;

            // Loop through all radio buttons to find the selected one
            drawingRadiobtn.forEach(radio => {
                if (radio.checked) {
                    selectedRadio = radio;
                }
            });

            if (selectedRadio && selectedRadio.value === "yes") {
                const updatedRevNum = document.getElementById('updated_rev_number');
                const revisionDate = document.getElementById('revision_date');
                updatedRevNum.style.display = 'block';
                updatedRevNum.previousElementSibling.style.display = 'block'
                updatedRevNum.nextElementSibling.style.display = 'inline'
                revisionDate.style.display = 'block';
                revisionDate.previousElementSibling.style.display = 'block'
                revisionDate.nextElementSibling.style.display = 'inline'

            } else if (selectedRadio && selectedRadio.value === "no") {
                const updatedRevNum = document.getElementById('updated_rev_number');
                const revisionDate = document.getElementById('revision_date');
                updatedRevNum.style.display = 'none';
                updatedRevNum.previousElementSibling.style.display = 'none'
                updatedRevNum.nextElementSibling.style.display = 'none'
                revisionDate.style.display = 'none';
                revisionDate.previousElementSibling.style.display = 'none'
                revisionDate.nextElementSibling.style.display = 'none'
            }

        }


        return isValid;
    }

    //validate section 2
    function validateSection2() {
        let isValid = true;

        const errorMessages = {
            'original_rev_number': '',
            'updated_rev_number': '',
            'revision_date': '',
            'engineering_review_date': ''
        };

        const requiredFields = [
            'original_rev_number', 'updated_rev_number', 'revision_date', 'engineering_review_date'
        ];

        requiredFields.forEach(field => {
            const inputElement = document.getElementById(field);
            const errorSpan = document.getElementById(`${field}-error`);

            // Check if the input is empty and the element is visible
            if (inputElement.value.trim() === '' && inputElement.offsetParent !== null) {
                // Replace all underscores with spaces, and capitalize the first letter of the first word only
                const fieldNameWithSpaces = field.replace(/_/g, ' ');
                const capitalizedField = fieldNameWithSpaces.charAt(0).toUpperCase() + fieldNameWithSpaces.slice(1);

                errorMessages[field] = `${capitalizedField} is required.`; // Set error message
                errorSpan.style.display = 'inline'; // Show error message
                errorSpan.textContent = errorMessages[field]; // Set the error message
                isValid = false;
            } else {
                errorSpan.style.display = 'none'; // Hide error if filled
            }
        });

        const radioButtons = document.querySelectorAll('input[name="resolved"]');
        const radioErrorSpan = document.getElementById("resolved-error");

        // Check if at least one radio button is checked
        if (![...radioButtons].some(radio => radio.checked)) {
            radioErrorSpan.style.display = 'inline'; // Show error in the span if no radio button is checked
            radioErrorSpan.textContent = 'Please select if the case is resolved or not.'; // Set error message
            isValid = false;
        } else {
            radioErrorSpan.style.display = 'none'; // Hide error if valid
        }

        const notifRadioBtns = document.querySelectorAll('input[name="customer-notif"]')
        const notificationError = document.getElementById('notification-required-error')
        if (![...notifRadioBtns].some(radio => radio.checked)) {
            notificationError.style.display = 'inline'; // Show error in the span if no radio button is checked
            notificationError.textContent = 'Please select if the notification is required or not.'; // Set error message
            isValid = false;
        } else {
            notificationError.style.display = 'none'; // Hide error if valid
        }



        return isValid;
    }



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


//Output Details on Confirmation page
function populateConfirmationData() {
    // Get values from Section 1
    const drawNeed = document.querySelector('input[name=drawing-required]:checked')?.value;
    const dispositionOpt = document.querySelector('input[name=disposition-options]:checked')?.value;
    const orgNum = document.getElementById('original_rev_number')?.value;
    const updtNum = document.getElementById('updated_rev_number')?.value;
    const revisionDate = document.getElementById('revision_date')?.value;
    const reviewDate = document.getElementById('engineering_review_date')?.value;

    // Get values from Section 2
    const disposition = document.getElementById('disposition-details')?.value;
    const custNoteNeed = document.querySelector('input[name=customer-notif]:checked')?.value;
    const resolved = document.querySelector('input[name=resolved]:checked')?.value;

    // Populate confirmation section
    document.getElementById('confirm-engineer-name').textContent = `${user.firstname} ${user.lastname}`;
    document.getElementById('confirm-disposition-options').textContent = dispositionOpt || "Not Stated";
    document.getElementById('confirm-disposition-details').textContent = disposition || "Not Stated";
    document.getElementById('confirm-resolved').textContent = resolved || "Not Stated";

    // If not required fields are left blank, change it to 'Not Stated'
    document.getElementById('confirm-drawing-update').textContent = drawNeed || "Not Stated";
    document.getElementById('confirm-original-rev-number').textContent = orgNum || "Not Stated";
    document.getElementById('confirm-updated-rev-number').textContent = updtNum || "Not Stated";
    document.getElementById('confirm-revision-date').textContent = revisionDate || "Not Stated";
    document.getElementById('confirm-engineering-review-date').textContent = reviewDate || "Not Stated";
    document.getElementById('confirm-customer-notification').textContent = custNoteNeed || "Not Stated";
}


function loadData(params) {
    const elements = [
        'qa-name-d', 'ncr-no-d', 'sales-order-no-d', 'quantity-received-d',
        'quantity-defective-d', 'qa-date-d', 'supplier-name-d',
        'product-no-d', 'process-d', 'description-item-d',
        'description-defect-d', 'item-marked-nonconforming-d','item-name-d'
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
        params.get('item_name')
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
        if (user.role == 'Lead Engineer') {

            if (notificationText.includes('Engineering')) {
                let AllReports = JSON.parse(localStorage.getItem('AllReports'))

                let index = AllReports.findIndex(report => report.ncr_no == notificationText.slice(8, 16))
                let report = AllReports[index]
                if (Object.keys(report.engineering).length == 0) {

                    // engineering department person get the mail from qa (will show review and begin work)
                    li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>Please review and begin work as assigned.`
                    li.addEventListener('click', () => {
                        // console.log()
                        window.location.href = `logged_NCR.html?${createQueryStringFromNotification(notificationText.slice(8, 16))}`
                    })
                } else {
                    li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>Please review and begin work as assigned.`

                    li.addEventListener('click', () => {
                        // console.log()
                        showPopup('Report already Filled', `<strong>${notificationText.slice(0, 16)}</strong><br><br>has been already filled and sent to purchasing department.`, 'images/confirmationIcon.webp')
                    })
                }

            } else {
                // engineering department person sends the form to purchasing (will show has been sent to purchasing department)
                li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>${notificationText.slice(17)}`
                li.addEventListener('click', () => {
                    // will show popup
                    showPopup('Notification Sent', `<strong>${notificationText.slice(0, 16)}</strong><br><br>${notificationText.slice(17)}`, 'images/confirmationIcon.webp')
                })
            }
        } else if (user.role == 'Purchasing') {
            if (notificationText.includes('Purchasing')) {
                let AllReports = JSON.parse(localStorage.getItem('AllReports'))

                let index = AllReports.findIndex(report => report.ncr_no == notificationText.slice(8, 16))
                let report = AllReports[index]
                if (Object.keys(report.purchasing_decision).length == 0) {

                    // purchasing department person get the mail from qa (will show review and begin work)
                    li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>Please review and begin work as assigned.`
                    li.addEventListener('click', () => {
                        // console.log()
                        window.location.href = `purchasing_decision.html?${createQueryStringFromNotification(notificationText.slice(8, 16))}`
                    })
                } else {
                    li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>Please review and begin work as assigned.`

                    li.addEventListener('click', () => {
                        // console.log()
                        showPopup('Report already Filled', `<strong>${notificationText.slice(0, 16)}</strong><br><br>has been already filled and notified to other departments.`, 'images/confirmationIcon.webp')
                    })
                }

            } else {
                // purchasing department person completes the form that's it.
                li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>${notificationText.slice(17)}`
                li.addEventListener('click', () => {
                    // will show popup
                    showPopup('Notification Sent', `<strong>${notificationText.slice(0, 16)}</strong><br><br>${notificationText.slice(17)}`, 'images/confirmationIcon.webp')
                })
            }
        }
        else {
            li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>${notificationText.slice(17)}`
            li.addEventListener('click', () => {
                // will show popup
                showPopup('Notification Sent', `<strong>${notificationText.slice(0, 16)}</strong><br><br>${notificationText.slice(17)}`, 'images/confirmationIcon.webp')
            })
        }


        notificationList.prepend(li)
    })
}


function sendNotification(ncrNum) {
    // Retrieve existing notifications from localStorage or initialize as an empty array
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];

    // Add the new notification message
    notifications.push(`NCR No. ${ncrNum} has been sent to the Purchasing department via Gmail for review and action.`);

    // Save updated notifications back to localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications));

    // Update the notification display
    setNotificationText();
}



function sendMail() {
    const recipient = 'divyansh9030@gmail.com'; // Change to valid recipient's email
    const subject = encodeURIComponent('Request for Purchasing/Operations Department Details for NCR'); // Subject of the email
    const body = encodeURIComponent(`Dear Davis Henry,\n\nI hope this message finds you well.\n\nI am writing to inform you that we have initiated the Non-Conformance Report (NCR) No. ${ncrNo}. At this stage, we kindly request you to provide the necessary details from the Purchasing/Operations Department to ensure a comprehensive assessment of the issue.\n\nYour prompt attention to this matter is essential for us to move forward efficiently. Please include any relevant information that could aid in our evaluation and resolution process.\n\nThank you for your cooperation. Should you have any questions or require further clarification, please do not hesitate to reach out.\n\nBest regards,\n\n${user.firstname} ${user.lastname}\Engineering Department\nCrossfire NCR`);

    // Construct the Gmail compose link
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;

    // Open the Gmail compose window
    window.open(gmailLink, '_blank'); // Opens in a new tab
}
let ncrData = []
function submitForm() {

    let ncrIndex = AllReports.findIndex(report => report.ncr_no === ncrNo);

    // Gather engineering department inputs
    let dispositionOption = document.querySelector('input[name="disposition-options"]:checked')?.value || null;
    let dispositionDetails = document.getElementById("disposition-details")?.value || null;

    // Correctly handle boolean values for checkboxes
    let drawingUpdate = document.querySelector('input[name="drawing-required"]:checked')?.checked || false;
    let customerNotification = document.querySelector('input[name="customer-notif"]:checked')?.checked || false;
// Get the resolved status from the radio button group
let resolvedStatus = document.querySelector('input[name="resolved"]:checked')?.value === 'yes';

    let originalRevNumber = document.getElementById("original_rev_number")?.value || null;
    let updatedRevNumber = document.getElementById("updated_rev_number")?.value || 'Not applicable';
    let revisionDate = document.getElementById("revision_date")?.value || null;
    let engineeringReviewDate = document.getElementById("engineering_review_date")?.value || null;
    // Update the engineering data for the found NCR record
    AllReports[ncrIndex].engineering = {
        "disposition": dispositionOption,
        "disposition_details": dispositionDetails,
        "drawing_update_required": drawingUpdate,
        "original_rev_number": originalRevNumber,
        "updated_rev_number": updatedRevNumber,
        "customer_notification_required": customerNotification,
        "revision_date": revisionDate,
        "engineering_review_date": engineeringReviewDate,
        "engineer_name": `${user.firstname} ${user.lastname}`,
        "resolved": resolvedStatus
    };

    localStorage.setItem('AllReports', JSON.stringify(AllReports))

}



function saveFormData() {
    const formData = {
        dispositionOptions: document.querySelector('input[name="disposition-options"]:checked')?.value || "",
        dispositionDetails: document.getElementById("disposition-details").value,
        drawingRequired: document.querySelector('input[name="drawing-required"]:checked')?.value || "",
        originalRevNumber: document.getElementById("original_rev_number").value,
        updatedRevNumber: document.getElementById("updated_rev_number").value,
        customerNotification: document.querySelector('input[name="customer-notif"]:checked')?.value || "",
        revisionDate: document.getElementById("revision_date").value,
        engineeringReviewDate: document.getElementById("engineering_review_date").value,
        resolved: document.querySelector('input[name="resolved"]:checked')?.value || "",
        ncr_no: document.getElementById('ncr-no-d').textContent,
        supplier_name: document.getElementById('supplier-name-d').textContent,
        po_no: document.getElementById('product-no-d').textContent,
        sales_order_no: document.getElementById('sales-order-no-d').textContent,
        item_description: document.getElementById('description-item-d').textContent,
        quantity_received: document.getElementById('quantity-received-d').textContent,
        quantity_defective: document.getElementById('quantity-defective-d').textContent,
        description_of_defect: document.getElementById('description-defect-d').textContent,
        item_marked_nonconforming: document.getElementById('item-marked-nonconforming-d').textContent,
        quality_representative_name: document.getElementById('qa-name-d').textContent,
        date: document.getElementById('qa-date-d').textContent,
        identify_process: document.getElementById('process-d').textContent,
        item_name: document.getElementById('item-name-d').textContent,
        date_of_saved: new Date().toLocaleDateString()

    };

    let savedNCRs = JSON.parse(localStorage.getItem("savedNCRs")) || [];

    // Find the index of the existing report with the same `ncr_no`
    const existingIndex = savedNCRs.findIndex(ncr => ncr.ncr_no === formData.ncr_no);

    if (existingIndex !== -1) {
        // Update the existing report
        savedNCRs[existingIndex] = formData;
        console.log(`Updated existing report with NCR No: ${formData.ncr_no}`);
    } else {
        // Add a new report if no existing one is found
        savedNCRs.push(formData);
        console.log(`Added new report with NCR No: ${formData.ncr_no}`);
    }

    // Save the updated reports list back to local storage
    localStorage.setItem("savedNCRs", JSON.stringify(savedNCRs));

    alert("NCR saved successfully!");
}

document.getElementById("save1").addEventListener("click", saveFormData);
document.getElementById("save2").addEventListener("click", saveFormData);

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

updateToolContent()

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