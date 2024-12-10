const user = JSON.parse(sessionStorage.getItem("currentUser"));
let employees = JSON.parse(localStorage.getItem('employees'));

const ncrNo = localStorage.getItem('ncrNo')
const addEmp = document.getElementById("add");
const empID = document.getElementById("empId");
const email = document.getElementById("email");
const fName = document.getElementById("firstName");
const lName = document.getElementById("lastName");
const dob = document.getElementById("dob");
const pass = document.getElementById("password");
const dept = document.getElementById("department");
const notificationlist = document.getElementById('notification-list');
const notificationCount = document.getElementById('notification-count');
const clearNotification = document.getElementById("btnClearNotification")
const btnBackToTop = document.getElementById('btnBackToTop')
const modal = document.getElementById("popup")
const span = document.getElementById("closePopup")
const ncrLink = document.querySelector('a[aria-label="Create a new Non-Conformance Report"]');

if (ncrLink && user.role == "QA Inspector") {
    ncrLink.href = `create_NCR.html?ncr_no=${ncrNo}`;
}

setNotificationText()
fillEmployeeDetailsFromURL()
updateToolContent()

const requiredFields = [
    { fieldId: 'empId', errorId: 'empID-error' },
    { fieldId: 'email', errorId: 'eMail-error' },
    { fieldId: 'firstName', errorId: 'fName-error' },
    { fieldId: 'lastName', errorId: 'lName-error' },
    { fieldId: 'dob', errorId: 'DOB-error' },
    { fieldId: 'password', errorId: 'password-error' },
    { fieldId: 'department', errorId: 'dept-error' }
];

clearErrorMessage()

document.getElementById("clear").addEventListener("click", function () {
    document.querySelector("form").reset();
});


addEmp.addEventListener("click", (e) => {
    e.preventDefault();
    if (showRequiredFields()) {

        showPopup('Confirmation', 'Employee Added successfully', 'images/confirmationIcon.webp');
    }
    //else if(empID.value.length > 4){
    //     const errorMessage = document.getElementById('empID-error');
    //     errorMessage.style.display='inline'
    //     errorMessage.textContent = "Employee ID cannot be greater than 4 digits"
    //     showPopup('Invalid Employee ID', 'Employee ID cannot be less than 4', 'images/1382678.webp');

    // }else if(empID.value.length < 4){
    //     const errorMessage = document.getElementById('empID-error');
    //     errorMessage.style.display='inline'
    //     errorMessage.textContent = "Employee ID cannot be less than 4 digits"
    //     showPopup('Invalid Employee ID', 'Employee ID cannot be less than 4', 'images/1382678.webp');

    // }else if (!email.value.includes("@crossfire.ca")) {
    //     showPopup('Invalid Email ID', 'Email is not valid', 'images/1382678.webp');
    //     const errorMessage = document.getElementById('eMail-error');
    //     errorMessage.style.display='inline'
    //     errorMessage.textContent = "Email Address must follow the same pattern"

    // } 
    else {

        showPopup('Required field missing', 'Please fill in the required fields before procedding.', 'images/1382678.webp');
    }



});
function showRequiredFields() {
    let isvalid = true;

    requiredFields.forEach(({ fieldId, errorId }) => {
        const inputElement = document.getElementById(fieldId);
        const errorMessage = document.getElementById(errorId);



        // Check if the input is empty
        if (inputElement.value.trim() === '') {
            errorMessage.style.display = 'inline'; // Show error if empty
            isvalid = false;
        } else {
            errorMessage.style.display = 'none'; // Hide error if filled
        }
    });

    return isvalid; // Return the final validation result
}

function clearErrorMessage() {


    requiredFields.forEach(({ fieldId, errorId }) => {
        const inputElement = document.getElementById(fieldId);
        const errorMessage = document.getElementById(errorId);


        const eventType = inputElement.tagName === 'SELECT' || inputElement.type === 'date' ? 'change' : 'input';

        inputElement.addEventListener(eventType, () => {
            if (inputElement.value.trim() !== '') {
                errorMessage.style.display = 'none'; // Hide error message when input is valid
            }
        });
    });
}


document.getElementById('clear').addEventListener('click', () => {
    const spans = document.querySelectorAll('.error-message')
    spans.forEach(element => {
        element.style.display = 'none'
    });

})

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

function logout() {
    localStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('breadcrumbTrail')
    location.replace('index.html')
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


function toggleSettings() {
    var settingsBox = document.getElementById("settings-box")
    if (settingsBox.style.display === "none" || settingsBox.style.display === "") {
        settingsBox.style.display = "inline"
    } else {
        settingsBox.style.display = "none"
    }
}

function toggleNotifications() {
    var notificationBox = document.getElementById("notification-box")
    if (notificationBox.style.display === "none" || notificationBox.style.display === "") {
        notificationBox.style.display = "inline"
    } else {
        notificationBox.style.display = "none"
    }
}
function openTools() {
    document.querySelector(".tools-container").classList.toggle("show-tools");

}

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

    modal.style.display = "inline" // Show the modal

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

function fillEmployeeDetailsFromURL() {
    // Extract the supplier name from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const employeeName = urlParams.get('EmployeeuserName');
    const heading = document.getElementById('heading')
    document.getElementById('add').textContent = 'Save'

    if (employeeName) {
        // Find the supplier from your data (assuming 'suppliers' is an array)
        const employee = employees.find(s => s.username === employeeName);
        heading.textContent = `Edit Employee - ${employee.username}`

        if (employee) {
            fName.value = employee.firstname || '';
            lName.value = employee.lastname || '';
            empID.value = employee.employeeID || '';
            dept.value = employee.department || '';
            email.value = employee.emailID || '';
            pass.value = employee.password || '';
            //phone.value = employee.phone || '';
            dob.value = employee.dob || '';
            //gender.value = employee.gender || '';
        } else {
            console.log("employee not found.");
        }
    } else {
        console.log("employee name not provided in the URL.");
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