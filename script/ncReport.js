const user = JSON.parse(sessionStorage.getItem("currentUser"))
const userName = document.getElementById('userName')
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
// Smooth scroll to top on footer click
const footer = document.getElementById('footer-scroll')
footer.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})

document.querySelectorAll('details').forEach(details => {
    details.setAttribute('open', '') // Expand if not on Create NCR page
})

const retrievedNCRData = JSON.parse(sessionStorage.getItem('data'))

function setSpanContentFromSession() {
    // Retrieve values from session storage for each department


    // Set QA data to spans and inputs
    document.getElementById('supplier-name').textContent = retrievedNCRData['supplier_name'] || ''
    document.getElementById('product-no').textContent = retrievedNCRData['product_no'] || ''
    document.getElementById('sales-order-no').textContent = retrievedNCRData['sales_order_no'] || ''
    document.getElementById('description-item').textContent = retrievedNCRData['item_description'] || ''
    document.getElementById('quantity-received').textContent = retrievedNCRData['quantity_received'] || ''
    document.getElementById('quantity-defective').textContent = retrievedNCRData['quantity_defective'] || ''
    document.getElementById('description-defect').textContent = retrievedNCRData['description_of_defect'] || ''
    
    // Handle Non-Conforming Item marked spans
    if (retrievedNCRData['item_marked_nonconforming'] === true) {
        document.getElementById('item-marked-yes').textContent = 'Yes'
        document.getElementById('item-marked-no').textContent = '' // Clear 'No'
    } else if (retrievedNCRData['item_marked_nonconforming'] === false) {
        document.getElementById('item-marked-no').textContent = 'No'
        document.getElementById('item-marked-yes').textContent = '' // Clear 'Yes'
    } else {
        document.getElementById('item-marked-yes').textContent = '' // Clear 'Yes'
        document.getElementById('item-marked-no').textContent = '' // Clear 'No'
    }

    document.getElementById('qa-name').textContent = retrievedNCRData['quality_representative_name'] || ''
    document.getElementById('qa-date').textContent = retrievedNCRData['date'] || ''
    document.getElementById('qa-resolved').textContent = retrievedNCRData['qa_resolved'] === 'true' ? 'Yes' : 'No'
    document.getElementById('ncr-no').textContent = retrievedNCRData['ncr_no'] || ''

    if(retrievedNCRData['supplier_or_rec_insp'] == true){

        document.getElementById('qa-process').textContent = 'Supplier or rec insp' // Ensure correct value
    }else{

        document.getElementById('qa-process').textContent = 'Wip production order' // Check if this is intended
    }

    // Set Engineering data to spans and inputs
    document.getElementById('engineer-name').textContent = retrievedNCRData['engineer_name'] || ''
    document.getElementById('disposition').textContent = retrievedNCRData['disposition'] || '' // Set select value
    document.getElementById('disposition-details').textContent = retrievedNCRData['disposition_details'] || ''
    document.getElementById('original-rev-number').textContent = retrievedNCRData['original_rev_number'] || ''
    document.getElementById('updated-rev-number').textContent = retrievedNCRData['updated_rev_number'] || ''
    document.getElementById('revision-date').textContent = retrievedNCRData['revision_date'] || '' // Set date input value
    document.getElementById('engineering-review-date').textContent = retrievedNCRData['engineering_review_date'] || '' // Set date input value
    document.getElementById('eng-resolved').textContent = retrievedNCRData['eng_resolved'] === 'true' ? 'Yes' : 'No'
    document.getElementById('customer-notification').textContent = retrievedNCRData['customer_notification_required'] === 'true' ? 'Yes' : 'No'
    document.getElementById('drawing-update-required').textContent = retrievedNCRData['drawing_update_required'] === 'true' ? 'Yes' : 'No'

    // Set Purchasing data to spans and inputs
    document.getElementById('preliminary-decision').textContent = retrievedNCRData['preliminary_decision'] || ''
    const dispositionOptions = retrievedNCRData['options'] || {}
    for (const [key, value] of Object.entries(dispositionOptions)) {
        if (value === true) {
            document.getElementById('options').textContent = key.replace(/_/g, ' ') // Replace underscores with spaces for readability
            break // Stop after the first true value
        }
    }
    
    // document.getElementById('options').textContent = retrievedNCRData['options'] || '' // Set select value
    document.getElementById('car-raised').textContent = retrievedNCRData['car_raised'] === 'true' ? 'Yes' : 'No'
    document.getElementById('car-number').textContent = retrievedNCRData['car_number'] || ''
    document.getElementById('follow-up-required').textContent = retrievedNCRData['follow_up_required'] === 'true' ? 'Yes' : 'No'
    document.getElementById('operations-manager-name').textContent = retrievedNCRData['operations_manager_name'] || ''
    document.getElementById('operations-manager-date').textContent = retrievedNCRData['operations_manager_date'] || '' // Set date input value
    document.getElementById('inspector-name').textContent = retrievedNCRData['inspector_name'] || ''
    document.getElementById('ncr-closed').textContent = retrievedNCRData['ncr_closed'] === 'true' ? 'Yes' : 'No'
    document.getElementById('pu-resolved').textContent = retrievedNCRData['pu_resolved'] === 'true' ? 'Yes' : 'No'
    document.getElementById('new-ncr-number').textContent = retrievedNCRData['new_ncr_number'] || ''
    // console.log('review date:', retrievedNCRData['engineering_review_date'])
    // console.log('Product No:', qaData.productNo)
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', setSpanContentFromSession)
// Add similar logs for other data points

document.getElementById('downloadPdf').addEventListener('click', function () {
    var element = document.getElementById('contentToDownload')
    html2pdf()
        .from(element)
        .set({
            margin: [0.25, 0.5, 0.5, 0.5],
            filename: 'my-document.pdf',
            html2canvas: { scale: 1 },
            jsPDF: { orientation: 'portrait', unit: 'in', format: 'a4' }
        })
        .save()
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
    localStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('breadcrumbTrail')
    location.replace('index.html')
}

function openTools() {
    document.querySelector(".tools-container").classList.toggle("show-tools");

}