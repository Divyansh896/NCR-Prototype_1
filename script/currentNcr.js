const user = JSON.parse(sessionStorage.getItem("currentUser"));

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
let ncrData = [] // Define a variable to hold the data
const footer = document.getElementById('footer-scroll')
const ncrInput = document.getElementById('ncrInput')
const autocompleteList = document.getElementById('autocomplete-list')
const records = document.getElementById('record-count')

// Smooth scroll to the top on footer click
footer.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})

// Load data after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    fetch('Data/ncr_reports.json')
        .then(response => response.json())
        .then(data => {
            ncrData = data
            populateTable(ncrData) // Populate table initially
            // document.getElementById('record-count').textContent = `Records found: ${ncrData.length}`
            // document.getElementById('status-all').checked = true
        })
        .catch(error => console.error("An error occurred while retrieving data: ", error))
})

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

function populateTable(data) {
    const tBody = document.getElementById('ncr-tbody');
    tBody.innerHTML = ''; // Clear the table

    // Filter items where `ncr.qa.resolved` is true
    const resolvedItems = data.filter(ncr => ncr.qa.resolved === true && ncr.engineering.resolved != true);
    const count = resolvedItems.length;

    // Display the count (you can adjust the element ID to match your HTML)
    document.getElementById('record-count').textContent = `Resolved NCRs: ${count}`;

    // Populate the table with resolved items
    resolvedItems.forEach(ncr => {
        const stage = getReportStage(ncr)
        const row = document.createElement('tr');

        // Generate the row content
        row.innerHTML = `
            <td>${ncr.qa.supplier_name || 'N/A'}</td>
            <td>${ncr.ncr_no || 'N/A'}</td>
            <td>${ncr.qa.item_description ? ncr.qa.item_description.substring(0, 15) + '...' : 'N/A'}</td>
            <td>${ncr.qa.date || 'N/A'}</td>
            
            <td>${ncr.engineering.resolved || 'Not resolved yet!'}</td>
            <td>
                <button class="view-btn" data-ncr="${ncr.ncr_no}"><i class="fa fa-file"></i> Select</button>
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
    
    window.location.href = `logged_NCR.html?${createQueryString(ncr)}` // Adjust the URL as needed
}

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
document.getElementById('search').addEventListener('change', () => filterNcr(ncrData));


// Attach input event for NCR number input
document.getElementById('ncrInput').addEventListener('input', () => filterNcr(ncrData));

// Attach change events for date pickers
document.getElementById('dateFrom').addEventListener('change', () => filterNcr(ncrData));
document.getElementById('dateTo').addEventListener('change', () => filterNcr(ncrData));


// Reset filter inputs and update table
document.getElementById('btn-reset').addEventListener('click', () => {
    document.getElementById('search').value = "All"
    document.getElementById('ncrInput').value = ''  // Clear NCR input
    document.getElementById('dateFrom').value = null
    document.getElementById('dateTo').value = null

    // Clear autocomplete suggestions
    autocompleteList.innerHTML = ''

    filterNcr(ncrData) // Update the table after resetting filters
})

// Autocomplete functionality

let currentFocus = -1

ncrInput.addEventListener('input', function () {
    const input = this.value.toLowerCase()
    autocompleteList.innerHTML = '' // Clear previous suggestions
    currentFocus = -1 // Reset focus index

    if (!input) return

    const filteredRecords = ncrData.filter(ncr => ncr.ncr_no.includes(input))
    filteredRecords.forEach((record, index) => {
        const item = document.createElement('div')
        const regex = new RegExp(input, 'gi')
        const highlightedText = record.ncr_no.replace(regex, match => `<span class="highlight">${match}</span>`)

        item.innerHTML = highlightedText
        item.classList.add('autocomplete-item')
        item.addEventListener('click', () => {
            ncrInput.value = record.ncr_no // Set the input value to the selected NCR
            autocompleteList.innerHTML = '' // Clear the suggestions
        })

        autocompleteList.appendChild(item)

    })
    populateTable(filteredRecords)
})
// Keyboard navigation for autocomplete
ncrInput.addEventListener('keydown', function (e) {
    const items = document.querySelectorAll('.autocomplete-item')

    if (e.key === 'ArrowDown') {
        e.preventDefault() // Prevent default behavior
        currentFocus++
        addActive(items)
    } else if (e.key === 'ArrowUp') {
        e.preventDefault() // Prevent default behavior
        currentFocus--
        addActive(items)
    } else if (e.key === 'Enter') {
        e.preventDefault() // Prevent default behavior
        if (currentFocus > -1 && items.length > 0) {
            const selectedItem = items[currentFocus].innerText // Get selected item's text
            ncrInput.value = selectedItem // Populate input with selected item
            autocompleteList.innerHTML = '' // Clear suggestions
            const filteredRecords = ncrData.filter(ncr => ncr.ncr_no.includes(selectedItem))

            // Trigger filtering of NCR data based on the selected item
            records.textContent = `Records found: ${filteredRecords.length}`

            populateTable(filteredRecords)
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
// Create a query string from the NCR data
function createQueryString(ncrData) {
    const { qa, engineering, purchasing_decision } = ncrData; // Destructure the NCR object
    return new URLSearchParams({
        ncr_no: ncrData.ncr_no,
        supplier_name: qa.supplier_name,
        po_no: qa.po_no,
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