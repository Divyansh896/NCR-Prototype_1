const user = JSON.parse(sessionStorage.getItem("currentUser"));
const ncrNo = localStorage.getItem('ncrNo')
const notificationlist = document.getElementById('notification-list');
const notificationCount = document.getElementById('notification-count');
const modal = document.getElementById("popup")
const span = document.getElementById("closePopup")
setNotificationText()
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
const footer = document.getElementById('footer-scroll') 
footer.addEventListener('click', ()=>{
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})

const ncrLink = document.querySelector('a[aria-label="Create a new Non-Conformance Report"]');
if (ncrLink && user.role == "QA Inspector") {
    ncrLink.href = `create_NCR.html?ncr_no=${ncrNo}`;
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

// HelpPage
document.addEventListener("click",function(){
    //get all the buttons 
    const help=document.getElementsByClassName("accordion");

    //loop throught all the buttons to add click event 
    for (let i=0; i<help.length; i++){
        help[i].addEventListener("click",function(){
            this.classList.toggle("active");
            this.parentElement.classList.toggle("active");

            const answer = this.nextElementSibling;
            if(answer.style.display === "block"){
                answer.style.display="none";
            }
            else{
                answer.style.display="block";
            }
        });
    }

});

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