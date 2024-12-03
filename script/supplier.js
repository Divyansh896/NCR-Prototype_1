const user = JSON.parse(sessionStorage.getItem("currentUser"))
let suppliers = JSON.parse(localStorage.getItem('suppliers'));

//geting all the inputs from html
const modal = document.getElementById("popup")
const span = document.getElementById("closePopup")
const starElements = document.querySelectorAll('.required');
let suppliername = document.getElementById("supplierName")
let country = document.getElementById("country")
let address = document.getElementById("address")
let city = document.getElementById("city")
let postalcode = document.getElementById("postalCode")
let contact = document.getElementById("contact")
let shippingmethod = document.getElementById("shippingMethod")
const notificationlist = document.getElementById('notification-list');
const notificationCount = document.getElementById('notification-count');
const clearNotification = document.getElementById("btnClearNotification")

setNotificationText()
fillSupplierDetailsFromURL()
//All the validation of the add supplier page
document.getElementById("submit-btn").addEventListener('click', function (e) {
    e.preventDefault()
    if (suppliername.value == "") {
        showPopup('Required fields missing', 'Please enter the supplier name.', 'images/1382678.webp')
        suppliername.nextElementSibling.style.display = "block"
        suppliername.nextElementSibling.textContent = "Supplier name is required !"
    }
    if (address.value == "") {
        showPopup('Required fields missing', 'Please enter the address.', 'images/1382678.webp')
        address.nextElementSibling.style.display = "block"
        address.nextElementSibling.textContent = "Address name is required !"
    }
    if (city.value == "") {
        showPopup('Required fields missing', 'Please enter the city.', 'images/1382678.webp')
        city.nextElementSibling.style.display = "block"
        city.nextElementSibling.textContent = "City name is required !"
    }
    if (country.value == "") {
        showPopup('Required fields missing', 'Please enter the country.', 'images/1382678.webp')
        country.nextElementSibling.style.display = "block"
        country.nextElementSibling.textContent = "Country name is required !"
    }
    if (postalcode == "" || !/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(postalcode.value)) {
        showPopup('Required fields missing', 'Please enter the valid postal code.', 'images/1382678.webp')
        postalcode.nextElementSibling.style.display = "block"
        postalcode.nextElementSibling.textContent = "Postalcode name is required !"
    }
    const regex = /^\+1-\d{3}-\d{3}-\d{4}$/;
    if (!regex.test(phoneNumber)) {
        showPopup('Required fields missing', 'Please enter the valid phone number.', 'images/1382678.webp')
        contact.nextElementSibling.style.display = "block"
        contact.nextElementSibling.textContent = "Contact number is required !"
    }
    if (shippingmethod.value == "") {
        showPopup('Required fields missing', 'Please select the valid shipping method.', 'images/1382678.webp')
        shippingmethod.nextElementSibling.style.display = "block"
        shippingmethod.nextElementSibling.textContent = "Shipping method name is required !"
    }
    if (suppliername.value !== "" && address.value !== "" && city.value !== "" && country.value !== "" && postalcode.value !== "" && contact.value !== "" && shippingmethod.value !== "") {
        // All fields have a value, proceed with further logic
        showPopup('Confirmation', 'All fields are filled correctly.', 'images/confirmationIcon.webp');
    } else {
        // At least one field is empty, show an error or prompt
        showPopup('Required fields missing', 'Please fill in all the required fields.', 'images/1382678.webp');
    }
})
//event for clear button
document.getElementById("btn-clear").addEventListener('click', function () {

    document.querySelector("form").reset();
})
// for footer
const footer = document.getElementById('footer-scroll')
footer.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})
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
function logout() {
    localStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('breadcrumbTrail')
    location.replace('index.html')
}

function openTools() {
    document.querySelector(".tools-container").classList.toggle("show-tools");

}

if (user && user.role) {
    // Update the Create NCR link based on user role
    function updateNCRLink() {
        var ncrLink = document.querySelector('a[aria-label="Create a new Non-Conformance Report"]')

        if (ncrLink) { // Ensure ncrLink exists
            if (user.role === "Lead Engineer" || user.role === "Purchasing") {
                // Change to "Logged NCR" for lead engineers and purchasing roles
                ncrLink.href = `current_NCR.html`
                ncrLink.innerHTML = '<i class="fa fa-sign-in"></i>Current NCR'
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

function updateToolContent(){
    const toolsContainer = document.querySelector('.tools')
    const emp = document.getElementById('add-emp')
    const supplier = document.getElementById('add-sup')
    if(user.role == "QA Inspector"){
        emp.style.display= 'none'
    }
    else if(user.role == "Lead Engineer" || user.role == "Purchasing"){
        toolsContainer.style.display = 'none'
    }
}

updateToolContent()
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
// const ncrLink = document.querySelector('a[aria-label="Create a new Non-Conformance Report"]');
// if (ncrLink && user.role == "QA Inspector") {
//     ncrLink.href = `create_NCR.html?ncr_no=${ncrNo}`;
// }

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

function fillSupplierDetailsFromURL() {
    // Extract the supplier name from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const supplierName = urlParams.get('SupplierName');
    const heading = document.getElementById('heading')

    if (supplierName) {
        // Find the supplier from your data (assuming 'suppliers' is an array)
        const supplier = suppliers.find(s => s.supplierName === supplierName);
        heading.textContent = `Edit Supplier - ${supplier.supplierName}`

        if (supplier) {
            // Fill out the form with supplier details
            suppliername.value = supplier.supplierName
            address.value = supplier.address || '';
            city.value = supplier.city || '';
            country.value = supplier.country || '';
            postalcode.value = supplier.postalCode || '';
            contact.value = supplier.contactNumber || '';
            shippingmethod.value = supplier.shippingMethod.toLowerCase() || '';
        } else {
            console.log("Supplier not found.");
        }
    } else {
        console.log("Supplier name not provided in the URL.");
    }
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
