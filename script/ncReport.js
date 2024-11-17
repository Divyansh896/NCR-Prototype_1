const user = JSON.parse(sessionStorage.getItem("currentUser"))
const userName = document.getElementById('userName')
userName.innerHTML = `${user.firstname}  ${user.lastname}`

const notificationlist = document.getElementById('notification-list');
const notificationCount = document.getElementById('notification-count');
loadImages()

const btnEdit = document.querySelectorAll('.edit');
btnEdit.forEach(button => {
    button.addEventListener('click', () => {
        editNCR(retrievedNCRData);
    });
});

const ncrNo = localStorage.getItem('ncrNo')

const ncrLink = document.querySelector('a[aria-label="Create a new Non-Conformance Report"]');
if (ncrLink && user.role == "QA Inspector") {
    ncrLink.href = `create_NCR.html?ncr_no=${ncrNo}`;
}
setNotificationText()
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
function editNCR(retrievedNCRData) {
    // const data = extractData(ncr)
    sessionStorage.setItem('data', JSON.stringify(retrievedNCRData))
    window.location.href = 'edit_Report.html' // Adjust the URL as needed
}
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

    if (retrievedNCRData['supplier_or_rec_insp'] == true) {

        document.getElementById('qa-process').textContent = 'Supplier or rec insp' // Ensure correct value
    } else {

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



document.getElementById('downloadPdf').addEventListener('click', async function () {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4'); // A4 paper size in mm
    const elements = document.querySelectorAll('details'); // Select all details elements

    // Function to hide buttons
    const hideButtons = () => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => button.style.display = 'none'); // Hide all buttons
    };

    // Function to restore buttons
    const restoreButtons = () => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => button.style.display = ''); // Restore all buttons
    };

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const options = {
        scale: 1, // Slightly lower scale for smaller file size
        useCORS: true, // Enable CORS for external resources
        background: '#fff' // Ensure background is solid white
    };

    const images = [];
    const spacing = 10; // Add 10mm spacing between elements

    // Add the title at the top of the PDF
    pdf.setFontSize(25);
    const title = 'Non-Conformance Report';
    const titleWidth = pdf.getTextWidth(title);
    const pageWidth = pdf.internal.pageSize.width; // Page width in mm
    pdf.text(title, (pageWidth - titleWidth) / 2, 20); // Center the title, adjusted to ensure it doesn't take up the whole width

    const position = 30; // Starting position for the images/content

    hideButtons(); // Hide buttons before generating PDF

    // Capture each element's canvas
    for (let element of elements) {
        const originalFontSize = window.getComputedStyle(element).fontSize; // Store the original font size
        element.style.fontSize = '25px'; // Temporarily increase font size (e.g., 20px)
        
        const canvas = await html2canvas(element, options);
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

        // Convert canvas to JPEG for smaller size
        const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG with 80% quality
        images.push({ imgData, imgHeight });

        element.style.fontSize = originalFontSize; // Restore the original font size
    }

    restoreButtons(); // Restore buttons after capturing the canvas

    // Adjust the image to fit A4 and add spacing
    let currentHeight = position; // Start from the title's position

    images.forEach((image, index) => {
        if (currentHeight + image.imgHeight + spacing > pageHeight) {
            pdf.addPage(); // Add a new page if the content exceeds the page height
            currentHeight = 20; // Reset vertical position after adding a new page
        }

        // Add the image to the PDF, adjusting the position and size
        pdf.addImage(image.imgData, 'JPEG', 0, currentHeight, imgWidth, image.imgHeight);
        currentHeight += image.imgHeight + spacing; // Update the current height after adding the image and spacing
    });

    // Save the generated PDF
    pdf.save('Quality_Assurance_Report.pdf');
});



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
    document.querySelector(".tools-container").classList.toggle("show-tools");

}

function setNotificationText() {
    // Retrieve and parse notifications from localStorage
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    // Set the notification count
    const count = document.getElementById('notification-count');
    count.innerHTML = notifications.length;

    // Clear any existing notifications in the list to avoid duplicates
    const notificationList = document.getElementById('notification-list'); // Ensure this element exists in your HTML
    notificationList.innerHTML = ''; // Clear existing list items

    // Append each notification as an <li> element
    notifications.forEach(notificationText => {
        const li = document.createElement('li');
        if (user.role == 'Lead Engineer') {

            if (notificationText.includes('Engineering')) {
                // engineering department person get the mail from qa (will show review and begin work)
                li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>Please review and begin work as assigned.`;
            } else {
                // engineering department person sends the form to purchasing (will show has been sent to purchasing department)
                li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>${notificationText.slice(17)}`;
            }
        }
        else {
            li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>${notificationText.slice(17)}`;

        }


        notificationList.prepend(li);
    });
}

function loadImages() {
    const imageContainer = document.getElementById('defectedProdImages'); // Make sure this container exists in your HTML

    // List of image filenames in your 'productImages' folder
    const imageFiles = [
        'screw image 1.jpg',
        'screw image 2.jpg',
        'screw image 3.jpg'
    ];

    imageContainer.style.display = 'flex'

    // Loop through the image files and create img elements
    imageFiles.forEach(imageFile => {
        const imgElement = document.createElement('img');
        imgElement.src = `/productImages/${imageFile}`; // URL pointing to the static folder
        imgElement.alt = imageFile; // Image file name as alt text
        imgElement.style.width = '250px'
        imgElement.style.height = '250px'
        imgElement.style.marginLeft = '115px'
        imageContainer.appendChild(imgElement);
    });
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