const footer = document.getElementById('footer-scroll')
footer.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})

const retrievedNCRData = JSON.parse(sessionStorage.getItem('data'));
const user = JSON.parse(sessionStorage.getItem("currentUser"));

const currentPage = window.location.pathname; // Get current page path
const isCreateNCRPage = currentPage.includes('create_ncr'); // Check if it's the Create NCR page
console.log(user.role)

// Get all input fields and textareas
const inputFields = document.querySelectorAll('input, textarea, select');

// Function to disable all fields
const disableFields = () => {
    inputFields.forEach(field => {
        field.disabled = true; // Disable each input field
    });
};

// Function to enable fields based on user role
const enableFieldsForRole = (role) => {
    if (role === 'QA Inspector') {
        document.querySelectorAll('.qa-editable').forEach(field => {
            field.disabled = false; // Enable QA editable fields
        });
        // Save changes when "Save" button is clicked
        document.querySelector('#qa-save').addEventListener('click', function () {
            if (validateQaSection()) {
                // Implement your save logic here, like sending the data to the server
                alert('Changes saved!'); // Example feedback message
                disableFields();
                // Enable radio buttons
                document.querySelectorAll('input[name="item_marked_nonconforming"]').forEach(radio => {
                    radio.disabled = false; // Enable all radio buttons
                });
            }
            else{
                alert("Please fill in all the required fields before submitting.")
            }


        });

    } else if (role === 'Lead Engineer') {
        console.log(user.role)
        document.querySelectorAll('.eng-editable').forEach(field => {
            field.disabled = false; // Enable Engineering editable fields
        });
        // Save changes when "Save" button is clicked
        document.querySelector('#eng-save').addEventListener('click', function () {
            if (validateEngSection()) {

                // Implement your save logic here, like sending the data to the server
                alert('Changes saved!'); // Example feedback message

                // Optionally, disable fields again after saving
                disableFields();
            }
            else{
                alert("Please fill in all the required fields before submitting.")
            }
        });
    } else if (role === 'Purchasing') {
        document.querySelectorAll('.purch-editable').forEach(field => {
            field.disabled = false; // Enable Purchasing editable fields
        });
        // Save changes when "Save" button is clicked
        document.querySelector('#purch-save').addEventListener('click', function () {
            if (validatePurchSection()) {
                alert('Changes saved!'); // Example feedback message

                disableFields();
            }
            else{
                alert("Please fill in all the required fields before submitting.")
            }
        });
    }



};

// On page load, disable fields based on user role
disableFields();

if (user.role == "QA Inspector") {
    document.getElementById('qa-edit').addEventListener('click', () => {
        enableFieldsForRole(user.role)
    })
}
else if (user.role == "Lead Engineer") {
    document.getElementById('eng-edit').addEventListener('click', () => {
        enableFieldsForRole(user.role)
    })
}
else if (user.role == "Purchasing") {
    document.getElementById('purch-edit').addEventListener('click', () => {
        enableFieldsForRole(user.role)
    })
}


// Select all details elements and toggle their open attribute based on the page
document.querySelectorAll('details').forEach(details => {
    details.setAttribute('open', !isCreateNCRPage); // Expand if not on Create NCR page
});

// Load data into input fields from the retrieved NCR data
loadData();

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
    };

    // Populate input fields from the retrieved NCR data
    for (const [fieldId, paramName] of Object.entries(fieldsMap)) {
        const field = document.getElementById(fieldId);
        if (field && retrievedNCRData) {
            if (field.type === 'radio') {
                // Set the radio button checked state based on the value from the retrieved data
                const itemMarkedValue = retrievedNCRData[paramName]; // Accessing the value directly
                if (itemMarkedValue === true) {
                    document.getElementById('item-marked-yes').checked = true;
                } else if (itemMarkedValue === false) {
                    document.getElementById('item-marked-no').checked = true;
                }
            } else {
                // Set the value of the field from retrievedNCRData
                field.value = retrievedNCRData[paramName] || ''; // Fallback to an empty string if no value
            }
        }
    }

    // Assuming 'process' is a select element
    const processSelect = document.getElementById('process');
    const dispositionOptions = document.getElementById('disposition')
    const options = document.getElementById('options')

    if (retrievedNCRData['supplier_or_rec_insp']) {
        processSelect.value = 'supplier'; // Set to 'supplier' if true
    } else if (retrievedNCRData['wip_production_order']) {
        processSelect.value = 'wip'; // Set to 'wip' if true
    } else {
        processSelect.value = 'Not applicable'; // Default to empty if both are false (or set to a specific option if needed)
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


const invalid = document.querySelectorAll('.required');
invalid.forEach(star => {
    star.style.display = 'none'; // Hide each star element initially
});

const validateQaSection = () => {
    let isValid = true;
    const formElements = [
        'qa-name', 'ncr-no', 'sales-order-no', 'quantity-received',
        'quantity-defective', 'qa-date', 'supplier-name', 'product-no',
        'process', 'description-item', 'description-defect'
    ];

    formElements.forEach(field => {
        const inputElement = document.getElementById(field);
        const labelElement = document.querySelector(`label[for="${field}"]`);
        const invalid = labelElement.querySelector('.required');

        // Check if the input is empty
        if (inputElement.value.trim() === '' || inputElement.value.trim() == null) {
            invalid.style.display = 'inline'; // Show star if empty
            isValid = false;
        } else {
            invalid.style.display = 'none'; // Hide star if filled
        }

        // Custom validation for number input
        if (inputElement.type === 'number' && isNaN(Number(inputElement.value))) {
            invalid.style.display = 'inline'; // Show star if invalid number
            isValid = false;
        }

        // Custom validation for date input
        if (inputElement.type === 'date' && !inputElement.value) {
            invalid.style.display = 'inline'; // Show star if empty date
            isValid = false;
        }
    });

    return isValid;
};

const validatePurchSection = () => {
    const formElements = [
        'preliminary-decision',
        'options', 'car-number', 'operations-manager-name', 'operations-manager-date',
        'new-ncr-number', 'inspector-name'
    ];
    let isValid = true;

    formElements.forEach(field => {
        const inputElement = document.getElementById(field);
        const labelElement = document.querySelector(`label[for="${field}"]`);
        const invalid = labelElement.querySelector('.required');

        // Check if the input is empty
        if (inputElement.value.trim() === '' || inputElement.value.trim() == null) {
            invalid.style.display = 'inline'; // Show star if empty
            isValid = false;
        } else {
            invalid.style.display = 'none'; // Hide star if filled
        }

        // Custom validation for number input
        if (inputElement.type === 'number' && isNaN(Number(inputElement.value))) {
            invalid.style.display = 'inline'; // Show star if invalid number
            isValid = false;
        }

        // Custom validation for date input
        if (inputElement.type === 'date' && !inputElement.value) {
            invalid.style.display = 'inline'; // Show star if empty date
            isValid = false;
        }
    });

    return isValid;
};

const validateEngSection = () => {
    const formElements = [
        'engineer-name',
        'disposition-details', 'original-rev-number', 'updated-rev-number',
        'revision-date', 'engineering-review-date'
    ];
    
    let isValid = true;

    formElements.forEach(field => {
        const inputElement = document.getElementById(field);
        const labelElement = document.querySelector(`label[for="${field}"]`);
        const invalid = labelElement.querySelector('.required');

        // Check if the input is empty
        if (inputElement.value.trim() === '' || inputElement.value.trim() == null) {
            invalid.style.display = 'inline'; // Show star if empty
            isValid = false;
        } else {
            invalid.style.display = 'none'; // Hide star if filled
        }

        // Custom validation for number input
        if (inputElement.type === 'number' && isNaN(Number(inputElement.value))) {
            invalid.style.display = 'inline'; // Show star if invalid number
            isValid = false;
        }

        // Custom validation for date input
        if (inputElement.type === 'date' && !inputElement.value) {
            invalid.style.display = 'inline'; // Show star if empty date
            isValid = false;
        }
    });

    return isValid;
};