// Gettting JSON Data from the local storage
const user = JSON.parse(sessionStorage.getItem("currentUser"))
let AllReports = JSON.parse(localStorage.getItem('AllReports'))
let suppliers = JSON.parse(localStorage.getItem('suppliers'))

const notificationlist = document.getElementById('notification-list')
const notificationCount = document.getElementById('notification-count')
const userName = document.getElementById('userName');
const footer = document.getElementById('footer-scroll')
const ncrInput = document.getElementById('ncrInput')
const autocompleteList = document.getElementById('autocomplete-list')
const records = document.getElementById('record-count')
const modal = document.getElementById("popup")
const span = document.getElementById("closePopup")
const clearNotification = document.getElementById("btnClearNotification")
const btnBackToTop = document.getElementById('btnBackToTop')
const sortButtons = document.querySelectorAll('.sort-btn');

userName.innerHTML = `${user.firstname}  ${user.lastname}`
let currentFocus = -1
let sortOrder = 'asc'; // Default sort order
let currentSortProperty = 'ncr_no'; // Default sort by 'ncr_no'

populateTable(AllReports) // Populate table initially
setNotificationText()
populateSuppliers()

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


// Allow radio buttons to be selected with the 'Enter' key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const activeElement = document.activeElement
        if (activeElement.type === 'radio') {
            activeElement.click() // Programmatically click the radio button
        }
    }
})


function getReportStage(ncr) {
    if (!ncr.qa.resolved) return 'QA'
    if (!ncr.engineering.resolved) return 'Engineering'
    if (!ncr.purchasing_decision.resolved) return 'Purchasing'
    return ''
}


// Sort function to toggle between ascending and descending
function sortData(NCRList, property) {
    return NCRList.sort((a, b) => {
        // If sorting by date, convert strings to Date objects
        if (property === 'date') {
            const dateA = new Date(a.qa.date);
            const dateB = new Date(b.qa.date);
            if (sortOrder === 'asc') {
                return dateA - dateB;  // Ascending
            } else {
                return dateB - dateA;  // Descending
            }
        } else {
            // Sorting by other properties like 'ncr_no'
            if (sortOrder === 'asc') {
                return a[property] > b[property] ? 1 : -1;
            } else {
                return a[property] < b[property] ? 1 : -1;
            }
        }
    });
}


// Function to update the sort indicator
function updateSortIndicator() {
    // Reset all indicators
    const indicators = document.querySelectorAll('.sort-indicator');
    indicators.forEach(indicator => {
        indicator.textContent = ''; // Clear the indicators
    });

    // Update the current sort indicator
    const currentIndicator = document.getElementById(`sort-${currentSortProperty}`);
    if (currentIndicator) {
        currentIndicator.textContent = sortOrder === 'asc' ? '↑' : '↓'; // Up or Down arrow
    }
}


function populateTable(data) {
    const tBody = document.getElementById('ncr-tbody');
    tBody.innerHTML = ''; // Clear the table
    let resolvedItems;

    if (user.role === "Lead Engineer") {
        resolvedItems = data.filter(ncr => ncr.qa.resolved === true && ncr.engineering.resolved != true);
    } else if (user.role === "Purchasing") {
        resolvedItems = data.filter(ncr => ncr.qa.resolved === true && ncr.engineering.resolved == true && ncr.purchasing_decision.resolved != true);
    }

    // Sort NCRList before populating the table
    resolvedItems = sortData(resolvedItems, currentSortProperty);  // Sort by selected property
    // Display the count
    const count = resolvedItems.length;
    document.getElementById('record-count').textContent = `Open NCRs: ${count}`;

    // Populate the table with resolved items
    resolvedItems.forEach(ncr => {
        const row = document.createElement('tr');

        // Determine the value for the fifth column based on the user's role
        let statusColumn = 'Open'; // Default value
        if (user.role === "Lead Engineer") {
            statusColumn = ncr.engineering.resolved || 'Open';
        } else if (user.role === "Purchasing") {
            statusColumn = ncr.purchasing_decision.resolved || 'Open';
        }

        // Generate the row content
        row.innerHTML = `
            <td>${ncr.ncr_no || 'N/A'}</td>
            <td>${ncr.qa.date || 'N/A'}</td>
            <td>${ncr.qa.supplier_name || 'N/A'}</td>
            <td>${ncr.qa.item_description ? ncr.qa.item_description.substring(0, 15) + '...' : 'N/A'}</td>
            <td>${statusColumn}</td>
            <td>
                <div class="tooltip-container controls-container">
                    <button class="view-btn" data-ncr="${ncr.ncr_no}"><i class="fa fa-file"></i> Edit</button>
                    <span class="tooltip ttip-control">Click to edit NCR</span>
                </div>
            </td>
        `;

        // Add event listener for View button
        row.querySelector('.view-btn').addEventListener('click', () => {
            viewNCR(ncr);
        });

        tBody.appendChild(row);
    });
}


function viewNCR(ncr) {
    // Determine the redirect page based on the user's role
    let redirectPage;

    if (user.role === "Lead Engineer") {
        redirectPage = 'logged_NCR.html';
    } else if (user.role === "Purchasing") {
        redirectPage = 'purchasing_decision.html';
    } else if (user.role === "Admin") {
        redirectPage = 'admin_dashboard.html'; // Placeholder for the admin role
    } else {
        console.error('Unknown role. Cannot determine redirect page.');
        return;
    }

    // Redirect to the appropriate page with NCR data as a query string
    window.location.href = `${redirectPage}?${createQueryString(ncr)}`;
}


// Event listener for the sort button
sortButtons.forEach((button) => {
    button.addEventListener('click', () => {

        // Get the property to sort by from the data-sort-property attribute
        currentSortProperty = button.getAttribute('data-sort-property');

        // Toggle the sort order
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        
        // Update the sort indicator based on the current sort
        updateSortIndicator();
        // Re-populate the table with sorted data based on the current property
        populateTable(AllReports);
    });
});

updateSortIndicator();


// Function to handle the 'Edit' button click
function editNCR(ncr) {
    const data = extractData(ncr)
    sessionStorage.setItem('data', JSON.stringify(data))
    window.location.href = 'edit_Report.html' // Adjust the URL as needed
}

function extractData(ncr) {
    return {
        supplier_name: ncr.qa.supplier_name,
        product_no: ncr.qa.po_no,
        sales_order_no: ncr.qa.sales_order_no,
        item_description: ncr.qa.item_description,
        quantity_received: ncr.qa.quantity_received,
        quantity_defective: ncr.qa.quantity_defective,
        description_of_defect: ncr.qa.description_of_defect,
        item_marked_nonconforming: ncr.qa.item_marked_nonconforming,
        quality_representative_name: ncr.qa.quality_representative_name,
        date: ncr.qa.date,
        qa_resolved: ncr.qa.resolved,
        ncr_no: ncr.ncr_no,
        supplier_or_rec_insp: ncr.qa.process.supplier_or_rec_insp,
        wip_production_order: ncr.qa.process.wip_production_order,
        disposition: ncr.engineering.disposition,
        disposition_options: ncr.engineering.disposition_options,
        customer_notification_required: ncr.engineering.customer_notification_required,
        disposition_details: ncr.engineering.disposition_details,
        drawing_update_required: ncr.engineering.drawing_update_required,
        original_rev_number: ncr.engineering.original_rev_number,
        updated_rev_number: ncr.engineering.updated_rev_number,
        engineer_name: ncr.engineering.engineer_name,
        revision_date: ncr.engineering.revision_date,
        engineering_review_date: ncr.engineering.engineering_review_date,
        eng_resolved: ncr.engineering.resolved,
        preliminary_decision: ncr.purchasing_decision.preliminary_decision,
        options: ncr.purchasing_decision.options,
        car_raised: ncr.purchasing_decision.car_raised,
        car_number: ncr.purchasing_decision.car_number,
        follow_up_required: ncr.purchasing_decision.follow_up_required,
        operations_manager_name: ncr.purchasing_decision.operations_manager_name,
        operations_manager_date: ncr.purchasing_decision.operations_manager_date,
        re_inspected_acceptable: ncr.purchasing_decision.re_inspected_acceptable,
        new_ncr_number: ncr.purchasing_decision.new_ncr_number,
        inspector_name: ncr.purchasing_decision.inspector_name,
        ncr_closed: ncr.purchasing_decision.ncr_closed,
        pu_resolved: ncr.purchasing_decision.resolved,
    }
}


function filterNcr(ncrData) {
    const search = document.getElementById('search');
    const ncrInput = document.getElementById('ncrInput').value.trim();
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;

    const filteredData = ncrData.filter(ncr => {
        // Filter by supplier name
        const matchedSearch = (search.value === "All") || (ncr.qa.supplier_name === search.value);



        // Filter by NCR number (if input is provided)
        const matchedNcrNumber = !ncrInput || ncr.ncr_no.toString().includes(ncrInput);

        // Filter by date range
        const ncrDate = new Date(ncr.qa.date);
        const matchedDateRange = (!dateFrom || new Date(dateFrom) <= ncrDate) &&
            (!dateTo || new Date(dateTo) >= ncrDate);

        return matchedSearch && matchedNcrNumber && matchedDateRange;
    });

    records.textContent = `Records found: ${filteredData.length}`;
    populateTable(filteredData);
}

// Attach filter events
document.getElementById('search').addEventListener('change', () => filterNcr(AllReports));

// Attach input event for NCR number input
document.getElementById('ncrInput').addEventListener('input', () => filterNcr(AllReports));

// Attach change events for date pickers
document.getElementById('dateFrom').addEventListener('change', () => filterNcr(AllReports));
document.getElementById('dateTo').addEventListener('change', () => filterNcr(AllReports));


// Reset filter inputs and update table
document.getElementById('btn-reset').addEventListener('click', () => {
    document.getElementById('search').value = "All"
    document.getElementById('ncrInput').value = ''  // Clear NCR input
    document.getElementById('dateFrom').value = null
    document.getElementById('dateTo').value = null

    // Clear autocomplete suggestions
    autocompleteList.innerHTML = ''

    filterNcr(AllReports) // Update the table after resetting filters
})



// Autocomplete functionality
ncrInput.addEventListener('input', function () {
    const ncrData = AllReports
    const input = this.value.toUpperCase();
    const hasLetters = /[a-zA-Z]/; // Pattern to check for any letters

    // Check if the input contains any letters
    if (hasLetters.test(input)) {
        this.setCustomValidity("NCR number cannot contain letters. Please enter in format YYYY-NNN.");
        this.reportValidity(); // Show the error
        this.value = ''; // Clear the invalid input
    } else {
        this.setCustomValidity(""); // Clear any error if valid
    }

    autocompleteList.innerHTML = ''; // Clear previous suggestions
    currentFocus = -1; // Reset focus index

    const filteredRecords = ncrData.filter(ncr => ncr.ncr_no.includes(input));
    filteredRecords.forEach((record, index) => {
        const item = document.createElement('div');
        const regex = new RegExp(input, 'gi');
        const highlightedText = record.ncr_no.replace(regex, match => `<span class="highlight">${match}</span>`);

        item.innerHTML = highlightedText;
        item.classList.add('autocomplete-item');
        item.addEventListener('click', () => {
            ncrInput.value = record.ncr_no; // Set the input value to the selected NCR
            autocompleteList.innerHTML = ''; // Clear the suggestions
        });

        autocompleteList.appendChild(item);
        return ncrInput.value
    });

    populateTable(filteredRecords);
});


// Keyboard navigation for autocomplete
ncrInput.addEventListener('keydown', function (e) {
    const items = document.querySelectorAll('.autocomplete-item')
    const status = document.querySelector('input[name="status"]:checked')?.value; // Get selected status

    if (e.key === 'ArrowDown') {
        e.preventDefault() // Prevent default behavior
        currentFocus++
        addActive(items)
        const selectedItem = items[currentFocus].innerText // Get selected item's text
        ncrInput.value = selectedItem
        const filteredRecords = AllReports.filter(ncr => ncr.ncr_no.includes(selectedItem))
        records.textContent = `Records found: ${filteredRecords.length}`

        populateTable(filteredRecords, status)
    } else if (e.key === 'ArrowUp') {
        e.preventDefault() // Prevent default behavior
        currentFocus--
        addActive(items)
        const selectedItem = items[currentFocus].innerText // Get selected item's text
        ncrInput.value = selectedItem
        const filteredRecords = AllReports.filter(ncr => ncr.ncr_no.includes(selectedItem))
        records.textContent = `Records found: ${filteredRecords.length}`

        populateTable(filteredRecords, status)
    } else if (e.key === 'Enter') {
        e.preventDefault() // Prevent default behavior
        if (currentFocus > -1 && items.length > 0) {
            const selectedItem = items[currentFocus].innerText // Get selected item's text
            ncrInput.value = selectedItem // Populate input with selected item
            autocompleteList.innerHTML = '' // Clear suggestions
            const filteredRecords = AllReports.filter(ncr => ncr.ncr_no.includes(selectedItem))

            // Trigger filtering of NCR data based on the selected item
            records.textContent = `Records found: ${filteredRecords.length}`

            populateTable(filteredRecords, status)
        }
    }
})


function addActive(items) {
    if (!items.length) return;

    removeActive(items); // Remove any existing active class

    // Wrap the focus index around
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;

    // Add the active class to the current item
    items[currentFocus].classList.add('active');

    // Scroll the active item into view
    items[currentFocus].scrollIntoView({
        block: 'nearest', // Scroll the item to the nearest edge
        behavior: 'smooth' // Optional: smooth scrolling
    });
}


function removeActive(items) {
    Array.from(items).forEach(item => item.classList.remove('active'))
}


// Click outside of autocomplete to close it
document.addEventListener('click', function (e) {
    if (e.target !== ncrInput) {
        autocompleteList.innerHTML = ''
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
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('breadcrumbTrail')
    location.replace('index.html')
}


// Create a query string from the NCR data
function createQueryString(ncrData) {
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
        engineering_review_date:engineering.engineering_review_date,
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


function openTools() {
    document.querySelector(".tools-container").classList.toggle("show-tools");
}


function setNotificationText() {
    // Retrieve and parse notifications from localStorage
    const count = document.getElementById('notification-count');
    let notifications 
    if(user.role == "QA Inspector"){
         notifications = JSON.parse(localStorage.getItem('QANotification')) || []
        const qauncheckedNotifications = notifications.filter(notification =>  !notification.qachecked);
        count.innerHTML = qauncheckedNotifications.length;
    }
    else if(user.role == "Lead Engineer"){
         notifications = JSON.parse(localStorage.getItem('ERNotification')) || []
        const eruncheckedNotifications = notifications.filter(notification =>  !notification.engineerchecked);
        count.innerHTML = eruncheckedNotifications.length;
    }
    else if(user.role == "Purchasing"){
         notifications = JSON.parse(localStorage.getItem('PRNotification')) || []
        const pruncheckedNotifications = notifications.filter(notification =>  !notification.purchasingchecked);
        count.innerHTML = pruncheckedNotifications.length;
    }
    else if(user.role == "Admin"){
         notifications = JSON.parse(localStorage.getItem('ADNotification')) || []
        const aduncheckedNotifications = notifications.filter(notification =>  !notification.adminchecked);
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


function populateSuppliers() {
    const supplierDropdown = document.getElementById("search");

    // Clear all existing dynamically added options
    supplierDropdown.innerHTML = ""; // Clear all options

    const option = document.createElement("option");
    option.value = 'All';
    option.textContent = 'All Suppliers';
    supplierDropdown.appendChild(option)
    // Dynamically add options from suppliers list
    suppliers.forEach(supplier => {
        const option = document.createElement("option");
        option.value = supplier.supplierName;
        option.textContent = supplier.supplierName;
        supplierDropdown.appendChild(option); // Insert before "Add a Supplier"
    });   
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
clearNotification.addEventListener("click", () => {
    if(user.role == "QA Inspector"){
        localStorage.setItem('QANotification', JSON.stringify([]));

    }
    else if(user.role == "Lead Engineer"){
        localStorage.setItem('ERNotification', JSON.stringify([]));

    }
    else if(user.role == "Purchasing"){
        localStorage.setItem('PRNotification', JSON.stringify([]));

    }
    else if(user.role == "Admin"){
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