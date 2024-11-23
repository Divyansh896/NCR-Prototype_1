// Gettting JSON Data from the local storage
const user = JSON.parse(sessionStorage.getItem("currentUser"))
let AllReports = JSON.parse(localStorage.getItem('AllReports'))

const starElements = document.querySelectorAll('.required')
const dropArea = document.getElementById('drop-area')
const mediaInput = document.getElementById('media-input')
const mediaList = document.getElementById('media-list')
const notificationlist = document.getElementById('notification-list')
const notificationCount = document.getElementById('notification-count')
const userName = document.getElementById('userName')
const modal = document.getElementById("popup")
const span = document.getElementById("closePopup")
const quantityReceivedInput = document.getElementById('quantity-received')
const quantityDefectiveInput = document.getElementById('quantity-defective')
const supplierDropdown = document.getElementById("supplier-name")
const supplierModal = document.getElementById("supplierModal")
const closeModalButton = supplierModal.querySelector(".close")
const addSupplierButton = document.getElementById("addSupplierButton")

const footer = document.getElementById('footer-scroll')



// Attach the preventNegativeInput function to both inputs
quantityReceivedInput.addEventListener('input', preventNegativeInput)
quantityDefectiveInput.addEventListener('input', handleInput)

let ncrNumber

userName.innerHTML = `${user.firstname}  ${user.lastname}`

let notifications = []
let NewReport = []
let existingFiles = []
let events = ['dragenter', 'dragover', 'dragleave', 'drop']

setNotificationText()
populateSuppliers()


// Generate the next NCR number
function generateNextNcrNumber(AllReports) {
    const lastNcrNumber = AllReports[AllReports.length - 1].ncr_no // Get the last NCR number from data
    const year = lastNcrNumber.substring(0, 4) // Extract the first 4 digits as the year
    const lastNumber = lastNcrNumber.slice(-3) // Extract the last 3 digits
    const currentYear = new Date().getFullYear().toString()
    let nextNumber

    // Increment number if it's the same year
    if (year === currentYear) {
        nextNumber = (parseInt(lastNumber) + 1).toString().padStart(3, '0')
    } else {
        nextNumber = '001' // Reset number if it's a new year
    }

    const num = `${currentYear}-${nextNumber}`

    return num // Return new NCR number
}


document.addEventListener("DOMContentLoaded", () => {
    // Attempt to retrieve the report index from sessionStorage
    const reportIndexStr = sessionStorage.getItem("editReportIndex")

    const reportIndex = parseInt(reportIndexStr, 10)

    if (!isNaN(reportIndex)) {
        // Clear the index after using it, so it doesn't persist
        sessionStorage.removeItem("editReportIndex")

        // Retrieve saved reports from localStorage
        const savedReports = JSON.parse(localStorage.getItem("savedNCRsQa")) || []

        // Check if the index is within the bounds of the savedReports array
        if (reportIndex >= 0 && reportIndex < savedReports.length) {
            const reportData = savedReports[reportIndex]

            // Prefill data into the form fields
            document.getElementById("ncr-no-generated").value = reportData.ncr_no || ""
            document.getElementById("sales-order-no").value = reportData.sales_order_no || ""
            document.getElementById("quantity-received").value = reportData.quantity_received || ""
            document.getElementById("quantity-defective").value = reportData.quantity_defective || ""
            document.getElementById("supplier-name").value = reportData.supplier_name || ""
            document.getElementById("product-no").value = reportData.product_no || ""

            // Prefill radio buttons for 'process'
            if (reportData.process) {
                const processRadio = document.getElementsByName("process")
                processRadio.forEach(option => {
                    if (option.value === reportData.process) {
                        option.checked = true
                        option.parentElement.classList.add('checked')
                    }
                })
            }

            // Prefill textarea fields
            document.getElementById("description-item").value = reportData.description_item || ""
            document.getElementById("description-defect").value = reportData.description_defect || ""

            // Prefill radio buttons for 'item_marked_nonconforming'
            if (reportData.item_marked_nonconforming) {
                const itemMarkedRadio = document.getElementsByName("item_marked_nonconforming")
                itemMarkedRadio.forEach(option => {
                    if (option.value === reportData.item_marked_nonconforming) {
                        option.checked = true
                        option.parentElement.classList.add('checked')
                    }
                })
            }

            // Prefill media files as a list of names or thumbnails
            const mediaList = document.getElementById("media-list")
            mediaList.innerHTML = "" // Clear any existing items
            if (reportData.media && Array.isArray(reportData.media)) {
                reportData.media.forEach(mediaItem => {
                    const listItem = document.createElement("li")
                    listItem.textContent = mediaItem.name // Display the file name
                    mediaList.appendChild(listItem)
                })
            }
        } else {
            console.warn("Invalid report index or no saved report data found.")
        }
    } else {
        console.warn("No report index provided to continue editing.")
    }
})




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


starElements.forEach(star => {
    star.style.display = 'none' // Hide each star element
})



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

function preventNegativeInput(event) {
    if (event.target.value < 0) {
        showPopup('Invalid quantity', 'The quantity cannot be in negative!!\nEnter only positive values.', 'images/1382678.webp')
        event.target.value = 0
    }
}

function preventLessInput(event) {
    const quantityDefective = event.target; // The defective quantity input
    const quantityReceived = document.getElementById('quantity-received'); // Received quantity input

    // Parse values as integers
    const defectiveValue = parseInt(quantityDefective.value, 10) || 0; // Default to 0 if invalid
    const receivedValue = parseInt(quantityReceived.value, 10) || 0; // Default to 0 if invalid

    if (defectiveValue > receivedValue) {
        // Show the error message
        quantityDefective.nextElementSibling.textContent =
            'Quantity defective cannot be greater than quantity received!';
        quantityDefective.nextElementSibling.style.display = 'inline';
    } else {
        // Hide the error message if input is valid
        quantityDefective.nextElementSibling.style.display = 'none';
    }
}


function handleInput(event) {
    preventNegativeInput(event);
    preventLessInput(event);
}

// Only proceed if the user is QA
if (user.role === 'QA Inspector' || user.role == 'Admin') {
    let currentStep = 0

    updateStatusBar()

    // Handle form elements for QA user
    document.getElementById('ncr-no-generated').value = generateNextNcrNumber(AllReports) // Set NCR number in the input field

    // Initialize form steps and elements for QA
    const sections = document.querySelectorAll(".form-section")

    // Update status bar based on current step
    // Update status bar based on current step
    function updateStatusBar() {
        const steps = document.querySelectorAll(".status-steps .status-step") // Get all status steps
        steps.forEach((step, index) => {
            // Highlight the current step
            step.classList.toggle("active", index === currentStep)

            // Optionally, you can add a class for completed steps
            step.classList.toggle("completed", index < currentStep)
        })
    }

    //chekboxes and radio buttons formatted as buttons for design purposes
    function toggleCheck(radio) {
        // Remove 'checked' class from all sibling radio buttons' parent elements
        const radios = document.querySelectorAll(`input[name="${radio.name}"]`)
        radios.forEach(r => r.parentElement.classList.remove('checked'))

        // Add 'checked' class to the selected radio button's parent element
        if (radio.checked) {
            radio.parentElement.classList.add('checked')
        }
    }


    function toggleRadio(radio) {
        // Remove 'checked' class from all radio button labels
        const buttons = document.querySelectorAll('.radio-button')
        buttons.forEach(button => button.classList.remove('checked'))

        // Add 'checked' class only to the selected radio button's label
        if (radio.checked) {
            radio.parentElement.classList.add('checked')
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
        const { isValid, quantityError } = validateSection1()

        if (isValid) {
            sections[currentStep].classList.remove("active")
            currentStep++
            sections[currentStep].classList.add("active")
            updateStatusBar()
        } else {
            if (quantityError) {
                showPopup(
                    'Invalid quantity',
                    'The number of defective items cannot exceed the number of received items.',
                    'images/1382678.webp'
                )
            } else {
                showPopup(
                    'Required fields missing',
                    'Please fill in required fields before proceeding.',
                    'images/1382678.webp'
                )
            }
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
        document.getElementById("confirm-media-list").textContent = null
        updateStatusBar()
    })

    // Event listener for the submit button
    document.getElementById("submit-btn").addEventListener("click", (e) => {
        e.preventDefault() // Prevent default form submission

        if (validateSection1() && validateSection2) {

            // Show the popup and wait for it to close
            showPopup('Form submitted', 'Your Quality Assurance form has been sent to the engineering department and your automated mail is generated.', '<i class="fa fa-envelope" aria-hidden="true"></i>', () => {
                // This callback will execute after the popup is closed
                submitForm(user.role) // Call the form submission
                sendMail() // Call the email sending function
                window.location.href = "Dashboard.html" // Redirect to home.html

                sendNotification(ncrNumber)
            })
        }
    })

    // Clear fields in Section 1
    document.getElementById("clear-btn1").addEventListener("click", () => {
        const section1 = document.querySelector('fieldset[aria-labelledby="product-info"]')
        clearSection(section1)

        // clear the radio buttons
        const radioButtons = document.querySelectorAll('input[name="process"]')
        radioButtons.forEach(radioButtons => {
            radioButtons.checked = false
            radioButtons.parentElement.classList.remove('checked')
        })
        quantityDefectiveInput.value = 0

    })

    // Clear fields in Section 2
    document.getElementById("clear-btn2").addEventListener("click", () => {
        const section2 = document.querySelector('fieldset[aria-labelledby="product-desc"]')
        clearSection(section2)
        // Clear radio buttons
        const radioButtons = document.querySelectorAll('input[name="item_marked_nonconforming"]')
        radioButtons.forEach(radioButton => radioButton.checked = false)
        mediaList.innerHTML = '' // Clear the photo list

        // Optionally reset the file input elements
        mediaList.value = ''
    })



    // Validate Section 1
    function validateSection1() {
        let isValid = true
        let quantityError = false

        // Reset all error messages
        const errorMessages = {
            'supplier-name': '',
            'sales-order-no': '',
            'quantity-received': '',
            'quantity-defective': '',
            'product-no': ''
        }

        const requiredFields = [
            'supplier-name', 'sales-order-no', 'quantity-received', 'quantity-defective', 'product-no'
        ]

        requiredFields.forEach(field => {
            const inputElement = document.getElementById(field)
            const errorSpan = document.getElementById(`${field}-error`)

            // Check if the input is empty
            if (inputElement.value.trim() === '') {
                errorMessages[field] = `${field.replace('-', ' ')} is required.` // Set error message
                errorSpan.style.display = 'inline' // Show error message
                errorSpan.textContent = errorMessages[field] // Set the error message
                isValid = false
            } else {
                errorSpan.style.display = 'none' // Hide error if filled
            }
        })

        const quantityReceived = parseInt(document.getElementById('quantity-received').value, 10)
        const quantityDefective = parseInt(document.getElementById('quantity-defective').value, 10)

        // Check if quantities are valid numbers
        if (!isNaN(quantityReceived) && !isNaN(quantityDefective)) {
            if (quantityDefective > quantityReceived) {
                errorMessages['quantity-defective'] = 'The number of defective items cannot exceed the number of received items.'
                const errorSpan = document.getElementById('quantity-defective-error')
                errorSpan.style.display = 'inline'
                errorSpan.textContent = errorMessages['quantity-defective']
                isValid = false // Ensure isValid is set to false
                quantityError = true
            }
        }


        //validate radio buttons
        const radioButtons = document.querySelectorAll('input[name="process"]')
        const radioErrorSpan = document.getElementById('process-applicable-error')

        if (![...radioButtons].some(radio => radio.checked)) {
            // console.log(radioErrorSpan)
            radioErrorSpan.style.display = 'inline' // Show error message
            radioErrorSpan.textContent = 'Please identify applicabale process.' // Set error message
            isValid = false
        } else {
            radioErrorSpan.style.display = 'none' // Hide error if valid
        }

        // Clear specific error messages for non-empty fields
        for (const field of requiredFields) {
            const errorSpan = document.getElementById(`${field}-error`)
            if (errorMessages[field] === '') {
                errorSpan.style.display = 'none' // Hide error if no error
            }
        }


        return { isValid, quantityError }
    }


    // Validate Section 2
    function validateSection2() {
        let isValid = true

        const requiredFields = [
            'description-item', 'description-defect'
        ]

        const errorMessages = {
            'description-item': '',
            'description-defect': '',
        }

        requiredFields.forEach(field => {
            const inputElement = document.getElementById(field)
            const errorSpan = document.getElementById(`${field}-error`) // Select the corresponding error span

            // Check if the input is empty
            if (inputElement.value.trim() === '') {
                errorMessages[field] = `${field.replace('-', ' ')} is required.` // Set error message
                errorSpan.style.display = 'inline' // Show error message
                errorSpan.textContent = errorMessages[field] // Set the error message
                isValid = false
            } else {
                errorSpan.style.display = 'none' // Hide error if filled
            }
        })

        const radioButtons = document.querySelectorAll('input[name="item_marked_nonconforming"]')
        const radioError = document.querySelector('legend[for="item-marked-nonconforming"]')
        const radioErrorSpan = radioError.nextElementSibling

        // Check if at least one radio button is checked
        if (![...radioButtons].some(radio => radio.checked)) {
            radioErrorSpan.style.display = 'inline' // Show error in the span if no radio button is checked
            radioErrorSpan.textContent = 'Please select an option for item marked non-conforming.' // Set error message
            isValid = false
        } else {
            radioErrorSpan.style.display = 'none' // Hide error if valid
        }

        // Clear specific error messages for non-empty fields
        for (const field of requiredFields) {
            const errorSpan = document.getElementById(`${field}-error`)
            if (errorMessages[field] === '') {
                errorSpan.style.display = 'none' // Hide error if no error
            }
        }

        return isValid
    }


    async function populateConfirmationData() {
        // Get values from Section 1
        const supplierName = document.getElementById('supplier-name').value
        const salesOrderNo = document.getElementById('sales-order-no').value
        const quantityReceived = document.getElementById('quantity-received').value
        const quantityDefective = document.getElementById('quantity-defective').value
        const productNo = document.getElementById('product-no').value
        const proccesApplicabable = document.querySelector('input[name=process]:checked').value
        const itemName = document.getElementById('item-name').value


        // Get values from Section 2
        const descriptionItem = document.getElementById('description-item').value
        const descriptionDefect = document.getElementById('description-defect').value

        // Get the non-conforming item marked status
        const nonconformingStatusElement = document.querySelector('input[name=item_marked_nonconforming]:checked').value
        const processApplicableElement = document.querySelector('input[name=process]:checked').value

        // Populate confirmation section
        document.getElementById('confirm-qa-name').textContent = `${user.firstname} ${user.lastname}`
        document.getElementById('confirm-date').textContent = new Date().toLocaleDateString()
        document.getElementById('confirm-supplier-name').textContent = supplierName
        document.getElementById('confirm-sales-order-no').textContent = salesOrderNo
        document.getElementById('confirm-quantity-received').textContent = quantityReceived
        document.getElementById('confirm-quantity-defective').textContent = quantityDefective
        document.getElementById('confirm-process-applicable').textContent = proccesApplicabable
        document.getElementById('confirm-product-no').textContent = productNo
        document.getElementById('confirm-description-item').textContent = descriptionItem
        document.getElementById('confirm-description-defect').textContent = descriptionDefect
        document.getElementById('confirm-nonconforming-status').textContent = nonconformingStatusElement
        document.getElementById('confirm-process-applicable').textContent = processApplicableElement
        document.getElementById('confirm-item-name').textContent = itemName
        for (const file of existingFiles) {
            const base64Data = await fileToBase64(file)

            // Create and append image or video elements based on file type
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img')
                img.src = base64Data
                img.alt = file.name
                img.style.maxWidth = '200px'
                img.style.margin = '10px'
                document.getElementById("confirm-media-list").appendChild(img)
            } else if (file.type.startsWith('video/')) {
                const video = document.createElement('video')
                video.src = base64Data
                video.controls = true
                video.style.maxWidth = '200px'
                video.style.margin = '10px'
                document.getElementById("confirm-media-list").appendChild(video)
            }

        }

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
    ]

    // Define process values with labels showing 'Yes' or 'No'
    const processSupplierInsp = `Supplier Inspection: ${params.get('supplier_or_rec_insp') === 'true' ? 'Yes' : 'No'}`
    const processWipProdOrder = `WIP Production Order: ${params.get('wip_production_order') === 'true' ? 'Yes' : 'No'}`
    const processValue = `${processSupplierInsp}\n${processWipProdOrder}`

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
    ]

    elements.forEach((id, index) => {
        const element = document.getElementById(id)
        element.textContent = values[index]
        element.setAttribute('disabled', 'true') // Disable the element
    })
}


function sendMail() {
    const recipient = 'divyansh9030@gmail.com' // Change to valid recipient's email
    const subject = encodeURIComponent('Request for Engineering Department Details for NCR') // Subject of the email
    const body = encodeURIComponent(`Dear Davis Henry,\n\nI hope this message finds you well.\n\nI am writing to inform you that we have initiated the Non-Conformance Report (NCR) No. ${ncrNumber}. At this stage, we kindly request you to provide the necessary details from the Engineering Department to ensure a comprehensive assessment of the issue.\n\nYour prompt attention to this matter is essential for us to move forward efficiently. Please include any relevant information that could aid in our evaluation and resolution process.\n\nThank you for your cooperation. Should you have any questions or require further clarification, please do not hesitate to reach out.\n\nBest regards,\n\n${user.firstname} ${user.lastname}\nQuality Assurance\nCrossfire NCR`)

    // Construct the Gmail compose link
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}&su=${subject}&body=${body}`

    // Open the Gmail compose window
    window.open(gmailLink, '_blank') // Opens in a new tab
}

function submitForm() {
    const today = new Date().toISOString().slice(0, 10)  // Get current date

    ncrNumber = document.getElementById('ncr-no-generated').value

    let newEntry = {
        "ncr_no": ncrNumber,  // Use a unique identifier or generate as needed
        "status": "incomplete",
        "qa": {},
        "engineering": {},
        "purchasing_decision": {}
    }


    const supplierName = document.getElementById('supplier-name').value
    const salesOrderNo = document.getElementById('sales-order-no').value
    const quantityReceived = document.getElementById('quantity-received').value
    const quantityDefective = document.getElementById('quantity-defective').value
    const productNo = document.getElementById('product-no').value
    const itemName = document.getElementById('item-name').value
    // Get values from Section 2
    const descriptionItem = document.getElementById('description-item').value
    const descriptionDefect = document.getElementById('description-defect').value

    // Get the non-conforming item marked status
    const nonconformingStatusElement = document.querySelector('input[name=item_marked_nonconforming]:checked')

    // Get the checked value of the process radio button
    const processApplicableElement = document.querySelector('input[name=process]:checked')

    // Assign values based on the process selection
    const processSupplierInsp = processApplicableElement.value === 'Supplier or Rec-Insp'
    const processWipProdOrder = processApplicableElement.value === 'WIP (Production order)'

    newEntry.qa = {

        "supplier_name": supplierName,
        "po_no": productNo,
        "sales_order_no": salesOrderNo,
        'item_name': itemName,
        "item_description": descriptionItem,
        "quantity_received": Number(quantityReceived),
        "quantity_defective": Number(quantityDefective),
        "description_of_defect": descriptionDefect,
        "item_marked_nonconforming": nonconformingStatusElement ? true : false,
        "quality_representative_name": `${user.firstname} ${user.lastname}`,
        "date": today,
        "resolved": true,
        "process": {
            "supplier_or_rec_insp": processSupplierInsp,
            "wip_production_order": processWipProdOrder
        }
    }


    NewReport.push(newEntry)  // Append new entry to the array

    AllReports.push(newEntry)
    localStorage.setItem('AllReports', JSON.stringify(AllReports))
}







// Function to convert files to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

async function handleFiles(files) {

    for (const file of files) {
        if (!existingFiles.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)) {
            existingFiles.push(file) // Add new files to the existing list

            // Create list item for file name
            const listItem = document.createElement('li')
            listItem.style.display = 'flex' // Use flex to align items
            listItem.style.alignItems = 'center' // Center align items

            // Create a span for the file name
            const fileName = document.createElement('span')
            fileName.textContent = file.name // Display selected file names
            fileName.style.maxWidth = '150px'
            // listItem.appendChild(fileName)

            // Create a delete button
            const deleteButton = document.createElement('button')
            deleteButton.textContent = '✖' // Cross symbol
            deleteButton.style.marginLeft = '10px' // Add some margin
            deleteButton.style.cursor = 'pointer' // Change cursor on hover
            deleteButton.style.background = 'transparent' // Make background transparent
            deleteButton.style.border = 'none' // Remove border
            deleteButton.style.color = 'red' // Color for the delete button

            // Attach click event to delete the item
            deleteButton.addEventListener('click', (e) => {
                e.preventDefault()
                const btnDelete = document.getElementById('yes-delete-img')
                const btnCancel = document.getElementById('no-delete-img')

                // Show the confirmation modal with custom message, icon, and button handlers
                deleteImgConfirm("Confirm Deletion",
                    "Are you sure you want to delete this image? You can add it back later.",
                    'images/1382678.webp',
                    btnDelete,
                    btnCancel,
                    () => {
                        // The callback will be triggered when 'Yes' is clicked (perform the delete)
                        existingFiles = existingFiles.filter(existingFile => !(existingFile.name === file.name && existingFile.size === file.size))
                        mediaList.removeChild(listItem) // Remove the list item
                        localStorage.setItem('mediaFiles', JSON.stringify(existingFiles)) // Update local storage
                    })
            })




            // Convert file to base64 and create an image or video element based on the file type
            const base64Data = await fileToBase64(file)
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img')
                img.src = base64Data // Set base64 image source
                img.alt = file.name // Set alt text for accessibility
                img.style.maxWidth = '100px' // Set a max width for the image
                img.style.marginLeft = '10px' // Add some margin around images
                img.style.marginRight = '10px' // Add some margin around images

                // Append the image to the list item
                listItem.appendChild(img)
            } else if (file.type.startsWith('video/')) {
                const video = document.createElement('video')
                video.src = base64Data // Set base64 video source
                video.controls = true // Add controls for the video
                video.style.maxWidth = '100px' // Set a max width for the video
                video.style.marginLeft = '10px' // Add some margin around videos
                video.style.marginRight = '10px'

                // Append the video to the list item
                listItem.appendChild(video)
            }

            listItem.appendChild(fileName)
            listItem.appendChild(deleteButton)

            // Append the list item to the media list
            mediaList.appendChild(listItem)
        }
    }

    // Update local storage after handling files
    // localStorage.setItem('mediaFiles', JSON.stringify(existingFiles))
}



// Handle file selection
mediaInput.addEventListener('change', function () {
    handleFiles(this.files)
})

// Handle drag and drop

events.forEach(eventName => {
    dropArea.addEventListener(eventName, e => e.preventDefault())
    dropArea.addEventListener(eventName, e => e.stopPropagation())
});

dropArea.addEventListener('dragover', () => dropArea.classList.add('dragover'))
dropArea.addEventListener('dragleave', () => dropArea.classList.remove('dragover'))
dropArea.addEventListener('drop', e => {
    dropArea.classList.remove('dragover')
    const files = e.dataTransfer.files
    handleFiles(files)
})



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


// Function to show supplier modal
function showSupplierPopup() {
    supplierModal.style.display = "block"
    setTimeout(() => {
        supplierModal.querySelector('.modal-content').style.opacity = "1"
        supplierModal.querySelector('.modal-content').style.transform = "translate(-50%, -50%)"
    }, 10)
}

// Function to close supplier modal
function closeSupplierPopup() {
    const modalContent = supplierModal.querySelector('.modal-content')
    modalContent.style.opacity = "0" // Fade-out effect
    modalContent.style.transform = "translate(-50%, -60%)" // Adjust position for effect
    setTimeout(() => {
        supplierModal.style.display = "none" // Hide the modal after transition
    }, 500)
}

// Show modal when "Add a Supplier" is selected
supplierDropdown.addEventListener("change", function () {
    if (supplierDropdown.value === "addSupplier") {
        showSupplierPopup()
        supplierDropdown.value = "" // Reset selection
    }
})

// Close the modal when the user clicks the "X" button
closeModalButton.addEventListener("click", closeSupplierPopup)

// Event listener for adding a new supplier
addSupplierButton.addEventListener("click", function () {
    let suppliers = JSON.parse(localStorage.getItem('suppliers'))

    const newSupplierName = document.getElementById("newSupplierName").value.trim()

    

    if (newSupplierName) {
        suppliers.push(newSupplierName)
        // Save updated list to local storage
        localStorage.setItem("suppliers", JSON.stringify(suppliers));

        // Repopulate the dropdown
        populateSuppliers();

        // Clear the input and close the modal
        document.getElementById("newSupplierName").value = "";
        closeSupplierPopup();
    } else {
        showPopup("Required field missing!", "Please enter the supplier name", "images/1382678.webp");
    }
});

// Function to populate the supplier dropdown
function populateSuppliers() {
    const suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
    const supplierDropdown = document.getElementById("supplier-name");
    const addSupplierOption = supplierDropdown.querySelector('option[value="addSupplier"]');

    // Clear all existing dynamically added options
    supplierDropdown.innerHTML = ""; // Clear all options
    supplierDropdown.appendChild(addSupplierOption); // Re-add the "Add a Supplier" option

    // Dynamically add options from suppliers list
    suppliers.forEach(optionText => {
        const option = document.createElement("option");
        option.value = optionText;
        option.textContent = optionText;
        supplierDropdown.insertBefore(option, addSupplierOption); // Insert before "Add a Supplier"
    });

    // Set default value
    supplierDropdown.value = 'Alpha Tech Solutions';
}


// Close the modal if the user clicks outside of it
window.addEventListener("click", function (event) {
    if (event.target === supplierModal) {
        closeSupplierPopup()
    }
})

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

function deleteImgConfirm(title, message, icon, btnDelete, btnCancel, callback) {
    const modal = document.querySelector('.deletemodal')
    const modalContent = modal.querySelector('.modal-content')

    // Set the title and message inside the modal
    modalContent.querySelector('h2').innerText = title
    modalContent.querySelector('p').innerText = message

    const iconDiv = document.querySelector('.icon')
    // Clear previous icons
    iconDiv.innerHTML = ''

    const isImage = icon.includes('.jpg') || icon.includes('.jpeg') || icon.includes('.png') || icon.includes('.gif') || icon.includes('.svg') || icon.includes('.webp')

    // Display the icon based on its type (image or text)
    if (isImage) {
        const imgElement = document.createElement('img')
        imgElement.src = icon
        iconDiv.appendChild(imgElement)
    } else {
        iconDiv.style.fontSize = '45px'
        iconDiv.innerHTML = icon
    }

    // Show the modal
    modal.style.display = "block"

    setTimeout(() => {
        modalContent.style.opacity = "1" // Fade-in effect
        modalContent.style.transform = "translate(-50%, -50%)" // Center modal
    }, 10)

    // Define the close function
    const closeModal = () => {
        modalContent.style.opacity = "0" // Fade-out effect
        modalContent.style.transform = "translate(-50%, -60%)" // Move modal out
        setTimeout(() => {
            modal.style.display = "none" // Hide the modal
        }, 500) // Wait for the transition to finish
    }

    // When "Yes" (btnDelete) is clicked, perform the delete action
    btnDelete.addEventListener('click', () => {
        // Perform the callback action (e.g., deleting the file)
        callback()
        closeModal() // Close the modal after the action
    })

    // When "No" (btnCancel) is clicked, just close the modal
    btnCancel.addEventListener('click', () => {
        closeModal() // Close the modal without any action
    })

    // Close modal when clicking outside of it
    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal()
        }
    }
}

function saveReportData() {
    // Collect data from each input field
    const reportData = {
        ncr_no: document.getElementById("ncr-no-generated").value,
        sales_order_no: document.getElementById("sales-order-no").value,
        quantity_received: document.getElementById("quantity-received").value,
        quantity_defective: document.getElementById("quantity-defective").value,
        supplier_name: document.getElementById("supplier-name").value,
        product_no: document.getElementById("product-no").value,
        process: document.querySelector('input[name="process"]:checked')?.value || "",
        description_item: document.getElementById("description-item").value,
        description_defect: document.getElementById("description-defect").value,
        item_marked_nonconforming: document.querySelector('input[name="item_marked_nonconforming"]:checked')?.value || "",
        media: [], // Initialize an empty array for media
        date_of_saved: new Date().toLocaleDateString()
    }

    // Handle media uploads and save as Base64
    const mediaInput = document.getElementById("media-input")
    const mediaFiles = mediaInput.files

    if (mediaFiles.length > 0) {
        const fileReaders = []
        for (let i = 0; i < mediaFiles.length; i++) {
            const file = mediaFiles[i]
            const reader = new FileReader()

            // Define what happens when file reader has read the file
            reader.onload = function (event) {
                reportData.media.push({
                    name: file.name,
                    type: file.type,
                    data: event.target.result // Base64 encoded string
                })

                // Check if all files are processed
                if (reportData.media.length === mediaFiles.length) {
                    saveDataToLocalStorage(reportData) // Call function to save to localStorage
                }
            }

            reader.onerror = function (error) {
                console.error("Error reading file:", error)
            }

            // Read file as Base64
            reader.readAsDataURL(file)
            fileReaders.push(reader)
        }
    } else {
        saveDataToLocalStorage(reportData) // Save directly if no media is selected
    }
}

// Function to save data to localStorage
function saveDataToLocalStorage(reportData) {
    // Retrieve existing saved reports from localStorage
    let savedNCRsQa = JSON.parse(localStorage.getItem("savedNCRsQa")) || []

    // Check if a report with the same NCR No. already exists
    const existingReportIndex = savedNCRsQa.findIndex(report => report.ncr_no === reportData.ncr_no)

    if (existingReportIndex !== -1) {
        // If it exists, update the existing report
        savedNCRsQa[existingReportIndex] = reportData
    } else {
        // If it doesn't exist, add as a new report
        savedNCRsQa.push(reportData)
    }

    // Save the updated reports array back to localStorage
    localStorage.setItem("savedNCRsQa", JSON.stringify(savedNCRsQa))

    alert("Report saved successfully!")
}

// Attach the save function to the save button
document.getElementById("save1").addEventListener("click", saveReportData)
document.getElementById("save2").addEventListener("click", saveReportData)