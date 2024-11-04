const user = JSON.parse(sessionStorage.getItem("currentUser"));
const queryParams = new URLSearchParams(window.location.search)
const starElements = document.querySelectorAll('.required');
const dropArea = document.getElementById('drop-area');
const mediaInput = document.getElementById('media-input');
const mediaList = document.getElementById('media-list');

const userName = document.getElementById('userName');
userName.innerHTML = `${user.firstname}  ${user.lastname}`
// Get the modal
const modal = document.getElementById("popup");

// Get the <span> element that closes the modal
const span = document.getElementById("closePopup");
// Get the input elements
const quantityReceivedInput = document.getElementById('quantity-received');
const quantityDefectiveInput = document.getElementById('quantity-defective');

// Attach the preventNegativeInput function to both inputs
quantityReceivedInput.addEventListener('input', preventNegativeInput);
quantityDefectiveInput.addEventListener('input', preventNegativeInput);

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
const footer = document.getElementById('footer-scroll')
footer.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})

let ncrData = []

starElements.forEach(star => {
    star.style.display = 'none'; // Hide each star element
});

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

function preventNegativeInput(event) {
    if (event.target.value < 0) {
        showPopup('Invalid quantity', 'The quantity cannot be in negative!!\nEnter only positive values.', 'images/1382678.webp')
        event.target.value = 0;
    }
}

// Initialize NCR number based on user role
let ncrNumber = queryParams.get('ncr_no') // Function to generate the latest NCR number
console.log(ncrNumber)

// Only proceed if the user is QA
if (user.role === 'QA Inspector') {
    let currentStep = 0

    updateStatusBar()

    // Remove sections based on user role

    // Handle form elements for QA user
    document.getElementById('ncr-no-generated').value = ncrNumber // Set NCR number in the input field

    // Initialize form steps and elements for QA
    const sections = document.querySelectorAll(".form-section")

    // Update status bar based on current step
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

    //chekboxes and radio buttons formatted as buttons for design purposes
    function toggleCheck(checkbox) {
        checkbox.parentElement.classList.toggle('checked', checkbox.checked);
    }

    function toggleRadio(radio) {
        // Remove 'checked' class from all radio button labels
        const buttons = document.querySelectorAll('.radio-button');
        buttons.forEach(button => button.classList.remove('checked'));
  
        // Add 'checked' class only to the selected radio button's label
        if (radio.checked) {
          radio.parentElement.classList.add('checked');
        }
      }


    // Clear fields in a section but keep NCR number and dropdowns intact
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

    // Initialize form navigation and submission
    sections[currentStep].classList.add("active")
    updateStatusBar()

    // Add event listeners for navigation buttons
    document.getElementById("next-btn1").addEventListener("click", () => {
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

    document.getElementById("next-btn2").addEventListener("click", () => {
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
        e.preventDefault(); // Prevent default form submission

        // Show the popup and wait for it to close
        showPopup('Form submitted', 'Your Quality Assurance form has been sent to the engineering department and your automated mail is generated.', 'images/gmail.webp', () => {
            // This callback will execute after the popup is closed
            submitForm(user.role); // Call the form submission
            sendMail(); // Call the email sending function
            window.location.href = "home.html"; // Redirect to home.html
        });
    });

    // Clear fields in Section 1
    document.getElementById("clear-btn1").addEventListener("click", () => {
        const section1 = document.querySelector('fieldset[aria-labelledby="product-info"]')
        clearSection(section1)
        // Clear checkboxes
        const checkboxes = document.querySelectorAll('input[name="process"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);
        quantityReceivedInput.value = 0
        quantityDefectiveInput.value = 0

    })

    // Clear fields in Section 2
    document.getElementById("clear-btn2").addEventListener("click", () => {
        const section2 = document.querySelector('fieldset[aria-labelledby="product-desc"]')
        clearSection(section2)
        // Clear radio buttons
        const radioButtons = document.querySelectorAll('input[name="item_marked_nonconforming"]');
        radioButtons.forEach(radioButton => radioButton.checked = false);
        mediaList.innerHTML = ''; // Clear the photo list

        // Optionally reset the file input elements
        mediaList.value = '';
    })



    // Validate Section 1
    function validateSection1() {
        let isValid = true;

        // Reset all error messages
        const errorMessages = {
            'supplier-name': '',
            'sales-order-no': '',
            'quantity-received': '',
            'quantity-defective': '',
            'product-no': ''
        };

        const requiredFields = [
            'supplier-name', 'sales-order-no', 'quantity-received', 'quantity-defective', 'product-no'
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

        const quantityReceived = parseInt(document.getElementById('quantity-received').value, 10);
        const quantityDefective = parseInt(document.getElementById('quantity-defective').value, 10);

        // Check if quantities are valid numbers
        if (!isNaN(quantityReceived) && !isNaN(quantityDefective)) {
            if (quantityDefective > quantityReceived) {
                errorMessages['quantity-defective'] = 'The number of defective items cannot exceed the number of received items.';
                const errorSpan = document.getElementById('quantity-defective-error');
                errorSpan.style.display = 'inline';
                errorSpan.textContent = errorMessages['quantity-defective'];
                isValid = false; // Ensure isValid is set to false
            }
        }
        // showPopup('Invalid quantity', 'The number of defective items cannot exceed the number of received items.', 'images/1382678.webp')

        // Validate checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"][name="process"]');
        const checkboxError = document.querySelector('.checkbox-error'); // Select the error message element directly

        // Check if at least one checkbox is checked
        if (![...checkboxes].some(checkbox => checkbox.checked)) {
            checkboxError.style.display = 'inline'; // Show error message
            checkboxError.textContent = 'At least one process must be selected.';
            isValid = false; // Set validation flag to false
        } else {
            checkboxError.style.display = 'none'; // Hide error message if at least one checkbox is checked
        }

        // Clear specific error messages for non-empty fields
        for (const field of requiredFields) {
            const errorSpan = document.getElementById(`${field}-error`);
            if (errorMessages[field] === '') {
                errorSpan.style.display = 'none'; // Hide error if no error
            }
        }


        return isValid;
    }


    // Validate Section 2
    function validateSection2() {
        let isValid = true;

        const requiredFields = [
            'description-item', 'description-defect'
        ];

        const errorMessages = {
            'description-item': '',
            'description-defect': '',
        };

        requiredFields.forEach(field => {
            const inputElement = document.getElementById(field);
            const errorSpan = document.getElementById(`${field}-error`); // Select the corresponding error span

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

        const radioButtons = document.querySelectorAll('input[name="item_marked_nonconforming"]');
        const radioError = document.querySelector('legend[for="item-marked-nonconforming"]');
        const radioErrorSpan = radioError.nextElementSibling;

        // Check if at least one radio button is checked
        if (![...radioButtons].some(radio => radio.checked)) {
            radioErrorSpan.style.display = 'inline'; // Show error in the span if no radio button is checked
            radioErrorSpan.textContent = 'Please select an option for item marked non-conforming.'; // Set error message
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

        return isValid;
    }


    function populateConfirmationData() {
        // Get values from Section 1
        const supplierName = document.getElementById('supplier-name').value
        const salesOrderNo = document.getElementById('sales-order-no').value
        const quantityReceived = document.getElementById('quantity-received').value
        const quantityDefective = document.getElementById('quantity-defective').value
        const productNo = document.getElementById('product-no').value

        // Get values from Section 2
        const descriptionItem = document.getElementById('description-item').value
        const descriptionDefect = document.getElementById('description-defect').value

        // Get the non-conforming item marked status
        const nonconformingStatusElement = document.querySelector('input[name=item_marked_nonconforming]:checked').value

        // Populate confirmation section
        document.getElementById('confirm-qa-name').textContent = `${user.firstname} ${user.lastname}`
        document.getElementById('confirm-date').textContent = new Date().toLocaleDateString()
        document.getElementById('confirm-supplier-name').textContent = supplierName
        document.getElementById('confirm-sales-order-no').textContent = salesOrderNo
        document.getElementById('confirm-quantity-received').textContent = quantityReceived
        document.getElementById('confirm-quantity-defective').textContent = quantityDefective
        document.getElementById('confirm-product-no').textContent = productNo
        document.getElementById('confirm-description-item').textContent = descriptionItem
        document.getElementById('confirm-description-defect').textContent = descriptionDefect
        document.getElementById('confirm-nonconforming-status').textContent = nonconformingStatusElement
    }
} else {
    // Remove sections based on user role
    const queryParams = new URLSearchParams(window.location.search)

    // Load data for non-QA users
    loadData(queryParams)
}


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


function sendMail() {
    const recipient = 'divyansh9030@gmail.com'; // Change to valid recipient's email
    const subject = encodeURIComponent('Request for Engineering Department Details for NCR'); // Subject of the email
    const body = encodeURIComponent(`Dear Davis Henry,\n\nI hope this message finds you well.\n\nI am writing to inform you that we have initiated the Non-Conformance Report (NCR) No. ${ncrNumber}. At this stage, we kindly request you to provide the necessary details from the Engineering Department to ensure a comprehensive assessment of the issue.\n\nYour prompt attention to this matter is essential for us to move forward efficiently. Please include any relevant information that could aid in our evaluation and resolution process.\n\nThank you for your cooperation. Should you have any questions or require further clarification, please do not hesitate to reach out.\n\nBest regards,\n\n${user.firstname} ${user.lastname}\nQuality Assurance\nCrossfire NCR`);

    // Construct the Gmail compose link
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`;

    // Open the Gmail compose window
    window.open(gmailLink, '_blank'); // Opens in a new tab
}

function submitForm(role) {
    const today = new Date().toISOString().slice(0, 10);  // Get current date
    let newEntry = {
        "ncr_no": ncrNumber,  // Use a unique identifier or generate as needed
        "status": "incomplete",
        "qa": {},
        "engineering": {},
        "purchasing_decision": {}
    }

    if (role === "QA Inspector") {
        const supplierName = document.getElementById('supplier-name').value
        const salesOrderNo = document.getElementById('sales-order-no').value
        const quantityReceived = document.getElementById('quantity-received').value
        const quantityDefective = document.getElementById('quantity-defective').value
        const productNo = document.getElementById('product-no').value

        // Get values from Section 2
        const descriptionItem = document.getElementById('description-item').value
        const descriptionDefect = document.getElementById('description-defect').value

        // Get the non-conforming item marked status
        const nonconformingStatusElement = document.querySelector('input[name=item_marked_nonconforming]:checked').value


        newEntry.qa = {

            "supplier_name": supplierName,
            "po_no": productNo,
            "sales_order_no": salesOrderNo,
            "item_description": descriptionItem,
            "quantity_received": Number(quantityReceived),
            "quantity_defective": Number(quantityDefective),
            "description_of_defect": descriptionDefect,
            "item_marked_nonconforming": nonconformingStatusElement,
            "quality_representative_name": `${user.firstname} ${user.lastname}`,
            "date": today,
            "resolved": false,
            "process": {
                "supplier_or_rec_insp": false,
                "wip_production_order": false
            }
        };

        // newEntry.status = "QA Complete";
        // ncr_data.push(newEntry)
        // data = JSON.stringify(ncr_data)
        // fs.writeFileSync("Data/ncr_reports.json",ncr_data,"utf-8");
        // alert('QA data submitted!');
        ncrData.push(newEntry);  // Append new entry to the array
        console.log(ncrData)

    }



}

let existingFiles = []; // Track previously added files

// Function to convert files to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function handleFiles(files) {
    for (const file of files) {
        if (!existingFiles.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)) {
            existingFiles.push(file); // Add new files to the existing list
            
            // Create list item for file name
            const listItem = document.createElement('li');
            listItem.style.display = 'flex'; // Use flex to align items
            listItem.style.alignItems = 'center'; // Center align items

            // Create a span for the file name
            const fileName = document.createElement('span');
            fileName.textContent = file.name; // Display selected file names
            listItem.appendChild(fileName);

            // Create a delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '✖'; // Cross symbol
            deleteButton.style.marginLeft = '10px'; // Add some margin
            deleteButton.style.cursor = 'pointer'; // Change cursor on hover
            deleteButton.style.background = 'transparent'; // Make background transparent
            deleteButton.style.border = 'none'; // Remove border
            deleteButton.style.color = 'red'; // Color for the delete button

            // Attach click event to delete the item
            deleteButton.addEventListener('click', () => {
                existingFiles = existingFiles.filter(existingFile => !(existingFile.name === file.name && existingFile.size === file.size)); // Remove file from existingFiles
                mediaList.removeChild(listItem); // Remove the list item
                localStorage.setItem('mediaFiles', JSON.stringify(existingFiles)); // Update local storage
            });

            // Append the delete button to the list item
            listItem.appendChild(deleteButton);

            // Convert file to base64 and create an image or video element based on the file type
            const base64Data = await fileToBase64(file);
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = base64Data; // Set base64 image source
                img.alt = file.name; // Set alt text for accessibility
                img.style.maxWidth = '100px'; // Set a max width for the image
                img.style.marginLeft = '10px'; // Add some margin around images

                // Append the image to the list item
                listItem.appendChild(img);
            } else if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.src = base64Data; // Set base64 video source
                video.controls = true; // Add controls for the video
                video.style.maxWidth = '100px'; // Set a max width for the video
                video.style.marginLeft = '10px'; // Add some margin around videos

                // Append the video to the list item
                listItem.appendChild(video);
            }

            // Append the list item to the media list
            mediaList.appendChild(listItem);
        }
    }

    // Update local storage after handling files
    // localStorage.setItem('mediaFiles', JSON.stringify(existingFiles));
}



// Handle file selection
mediaInput.addEventListener('change', function () {
    handleFiles(this.files);
});

// Handle drag and drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, e => e.preventDefault());
    dropArea.addEventListener(eventName, e => e.stopPropagation());
});

dropArea.addEventListener('dragover', () => dropArea.classList.add('dragover'));
dropArea.addEventListener('dragleave', () => dropArea.classList.remove('dragover'));
dropArea.addEventListener('drop', e => {
    dropArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFiles(files);
});



// Show the modal with a title, message, and icon
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