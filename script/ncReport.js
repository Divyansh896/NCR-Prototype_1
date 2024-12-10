let AllReports = JSON.parse(localStorage.getItem('AllReports'))
const user = JSON.parse(sessionStorage.getItem("currentUser"))

const userName = document.getElementById('userName')
userName.innerHTML = `${user.firstname}  ${user.lastname}`

const notificationlist = document.getElementById('notification-list');
const notificationCount = document.getElementById('notification-count');
const modal = document.getElementById("popup")
const span = document.getElementById("closePopup")
const clearNotification = document.getElementById("btnClearNotification")
const btnExport = document.getElementById('btnExportExcel')
const btnEdit = document.querySelectorAll('.edit');
const ncrNo = localStorage.getItem('ncrNo')
const btnPrint = document.getElementById('print')
const btnDownload = document.getElementById('downloadPdf')
const ncrLink = document.querySelector('a[aria-label="Create a new Non-Conformance Report"]');

const btnBackToTop = document.getElementById('btnBackToTop')

loadImages()
updateToolContent()
initializeButtons()
function initializeButtons(){
    const report = JSON.parse(sessionStorage.getItem('data')) || {};
    if(report['purchasing_decision']?.resolved === true){
        btnPrint.style.display = 'block'
        btnDownload.style.display = 'block'
        btnExport.style.display = 'block'
    }else{
        btnPrint.style.display = 'none'
        btnDownload.style.display = 'none'
        btnExport.style.display = 'none'
    }
}
btnEdit.forEach(button => {
    button.addEventListener('click', () => {
        // Retrieve the department from a data attribute in the button
        const department = button.getAttribute('data-department');

        // Check if the user is an admin
        if (user.role === "Admin") {
            // Admins can edit any department
            editNCR(retrievedNCRData);
        } else if (user.role === department) {
            // Allow the action for the correct department
            editNCR(retrievedNCRData);
        } else {
            // Show an alert if the button belongs to another department
            showPopup('Access denied!', `You can only edit NCRs for your department (${user.role}).`, 'images/1382678.webp');
        }
    })
})
function editNCR(ncr) {
    //const data = extractData(ncr)
    sessionStorage.setItem('data', JSON.stringify(ncr))
    window.location.href = 'edit_Report.html' // Adjust the URL as needed
}

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


const retrievedNCRData = JSON.parse(sessionStorage.getItem('data')) || {};
console.log(retrievedNCRData)
function setSpanContentFromSession() {
    // Retrieve data from session storage

    // Set QA data to spans and inputs
    document.getElementById('supplier-name').textContent = retrievedNCRData.qa?.supplier_name || 'Not filled';
    document.getElementById('item-name').textContent = retrievedNCRData.qa?.item_name || 'Not filled';
    document.getElementById('product-no').textContent = retrievedNCRData['qa']?.po_no || 'Not filled';
    document.getElementById('sales-order-no').textContent = retrievedNCRData['qa']?.sales_order_no || 'Not filled';
    document.getElementById('description-item').textContent = retrievedNCRData['qa']?.item_description || 'Not filled';
    document.getElementById('quantity-received').textContent = retrievedNCRData['qa']?.quantity_received || 0;
    document.getElementById('quantity-defective').textContent = retrievedNCRData['qa']?.quantity_defective || 0;
    document.getElementById('description-defect').textContent = retrievedNCRData['qa']?.description_of_defect || 'Not filled';

   // Handle Non-Conforming Item marked spans
    if (retrievedNCRData['qa']?.item_marked_nonconforming === true) {
        document.getElementById('item-marked-yes').textContent = 'Yes';
        document.getElementById('item-marked-no').textContent = ''; // Clear 'No'
    } else if (retrievedNCRData['qa']?.item_marked_nonconforming === false) {
        document.getElementById('item-marked-no').textContent = 'No';
        document.getElementById('item-marked-yes').textContent = ''; // Clear 'Yes'
    } else {
        document.getElementById('item-marked-yes').textContent = ''; // Clear 'Yes'
        document.getElementById('item-marked-no').textContent = ''; // Clear 'No'
    }

    
    document.getElementById('qa-name').textContent = retrievedNCRData['qa']?.quality_representative_name || 'Not filled';
    document.getElementById('qa-date').textContent = retrievedNCRData['qa']?.date || 'Not filled';
    document.getElementById('qa-resolved').textContent = retrievedNCRData['qa']?.resolved === true ? 'Yes' : 'No';
    document.getElementById('ncr-no').textContent = retrievedNCRData['ncr_no'] || 'Not filled';

    if (retrievedNCRData['qa']?.process?.supplier_or_rec_insp == true) {
        document.getElementById('qa-process').textContent = 'Supplier or rec insp'; // Ensure correct value
    } else {
        document.getElementById('qa-process').textContent = 'Wip production order'; // Check if this is intended
    }

    // Set Engineering data to spans and inputs
    document.getElementById('engineer-name').textContent = retrievedNCRData['engineering']?.engineer_name || 'Not filled';
    document.getElementById('disposition').textContent = retrievedNCRData['engineering']?.disposition || 'Not filled'; // Set select value
    document.getElementById('disposition-details').textContent = retrievedNCRData['engineering']?.disposition_details || 'Not filled';
    document.getElementById('original-rev-number').textContent = retrievedNCRData['engineering']?.original_rev_number || 'Not filled';
    document.getElementById('updated-rev-number').textContent = retrievedNCRData['engineering']?.updated_rev_number || 'Not filled';
    document.getElementById('revision-date').textContent = retrievedNCRData['engineering']?.revision_date || 'Not filled'; // Set date input value
    document.getElementById('engineering-review-date').textContent = retrievedNCRData['engineering']?.engineering_review_date || 'Not filled'; // Set date input value
    document.getElementById('eng-resolved').textContent = retrievedNCRData['engineering']?.resolved === true ? 'Yes' : 'No';
    document.getElementById('customer-notification').textContent = retrievedNCRData['engineering']?.customer_notification_required === true ? 'Yes' : 'No';
    document.getElementById('drawing-update-required').textContent = retrievedNCRData['engineering']?.drawing_update_required === true ? 'Yes' : 'No';

    // Set Purchasing data to spans and inputs
    document.getElementById('preliminary-decision').textContent = retrievedNCRData['purchasing_decision']?.preliminary_decision || 'Not filled';

    const dispositionOptions = retrievedNCRData['purchasing_decision']?.options || {};
    for (const [key, value] of Object.entries(dispositionOptions)) {
        if (value === true) {
            document.getElementById('options').textContent = key.replace(/_/g, ' '); // Replace underscores with spaces for readability
            break; // Stop after the first true value
        }
        else 
        document.getElementById('options').textContent = 'Not filled'
    }

    document.getElementById('car-raised').textContent = retrievedNCRData['purchasing_decision']?.car_raised === true ? 'Yes' : 'No';
    document.getElementById('car-number').textContent = retrievedNCRData['purchasing_decision']?.car_number || 'Not filled';
    document.getElementById('follow-up-required').textContent = retrievedNCRData['purchasing_decision']?.follow_up_required === true ? 'Yes' : 'No';
    document.getElementById('operations-manager-name').textContent = retrievedNCRData['purchasing_decision']?.operations_manager_name || `${user.firstname} ${user.lastname}`
    document.getElementById('operations-manager-date').textContent = retrievedNCRData['purchasing_decision']?.operations_manager_date || 'Not filled'; // Set date input value
    document.getElementById('inspector-name').textContent = retrievedNCRData['purchasing_decision']?.inspector_name || 'Not filled';
    document.getElementById('ncr-closed').textContent = retrievedNCRData['purchasing_decision']?.ncr_closed === true ? 'Yes' : 'No';
    document.getElementById('pu-resolved').textContent = retrievedNCRData['purchasing_decision']?.resolved === true ? 'Yes' : 'No';
    document.getElementById('new-ncr-number').textContent = retrievedNCRData['purchasing_decision']?.new_ncr_number || 'Not filled';
    document.getElementById('re-inspected-acceptable').textContent = retrievedNCRData['purchasing_decision']?.re_inspected_acceptable === true ? 'Yes' : 'No';
}


// Call the function on page load
document.addEventListener("DOMContentLoaded", () => {
    // Debug: Check the contents of sessionStorage before retrieving data
    console.log("Debug: SessionStorage contents before retrieving data:", sessionStorage);

    const retrievedNCRData = JSON.parse(sessionStorage.getItem("data")) || {};

    // Debug: Log the retrieved NCR data
    console.log("Debug: Retrieved NCR data from sessionStorage:", retrievedNCRData);

    if (!retrievedNCRData.ncr_no) {
        alert("No report found. Please submit a report first.");
        window.location.href = "purchasing_decision.html"; // Redirect back if no data
        return;
    }

    // Populate the page with retrieved data
    setSpanContentFromSession(retrievedNCRData);

    // Debug: Confirm data is being passed to setSpanContentFromSession
    console.log("Debug: Data passed to setSpanContentFromSession:", retrievedNCRData);
});


//event for downloading a pdf
document.getElementById('downloadPdf').addEventListener('click', async function () {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4'); 
    const elements = document.querySelectorAll('details'); 

    const hideButtons = () => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => button.style.display = 'none'); 
    };


    const restoreButtons = () => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => button.style.display = '');
    };

    const imgWidth = 210; 
    const pageHeight = 297; 
    const options = {
        scale: 1, 
        useCORS: true, 
        background: '#fff' 
    };

    const images = [];
    const spacing = 10;

    //header layout
    const addHeader = async (pageNum, totalPages) => {
        pdf.setFontSize(12);
        pdf.setTextColor(0);
        pdf.setDrawColor(0);


        const logoBase64 = await convertWebPToBase64('images/logo.webp');
        pdf.addImage(logoBase64, "PNG", 0, 0, 65, 15);
        pdf.setFontSize(8);
        pdf.setTextColor(0);


        pdf.text('Document No.:', 10, 20);
        pdf.text('OPS-00011', 30, 20);
        pdf.text('Document Title:', 70, 20)
        pdf.text('Non-Conformance Report', 90, 20); 
        pdf.text(`Page: ${pageNum} of ${totalPages}`, 170, 20);

        pdf.setFontSize(14);
        pdf.text('Internal Process Document', 140, 10);


        pdf.setDrawColor(0);
        pdf.line(0, 15, imgWidth, 15);
        pdf.line(60, 15, 60, 25);
        pdf.line(160, 15, 160, 25);
        pdf.line(0, 25, imgWidth, 25); 
    };

    //footer layout
    const addFooter = () => {
        pdf.setFontSize(8);
        pdf.setTextColor(0);
        pdf.setDrawColor(0);

        const footerY = pageHeight - 5; 


        pdf.text('Document Author:', 2, footerY-3);

        pdf.text('Document Date:', 62, footerY-3);
        pdf.text(new Date().toLocaleDateString(), 62, footerY+1);

        pdf.text('Approved By:', 102, footerY-3);

        pdf.text('Revision Date:', 160, footerY-3);
        pdf.text('07.14.2020', 160, footerY+1); 

        pdf.text('Revision No:', 190, footerY-3);
        pdf.text('013', 190, footerY+1); 


        pdf.setDrawColor(0); 
        pdf.line(60, footerY - 7, 60, pageHeight);  
        pdf.line(100, footerY - 7, 100, pageHeight);
        pdf.line(157, footerY - 7, 157, pageHeight); 
        pdf.line(187, footerY - 7, 187, pageHeight); 

        pdf.line(0, footerY - 7, imgWidth, footerY - 7); 
    };

    const position = 30; 
    //overall report info
    hideButtons(); 


    for (let element of elements) {
        const originalFontSize = window.getComputedStyle(element).fontSize; 
        element.style.fontSize = '20px'; 

        const canvas = await html2canvas(element, options);
        const imgHeight = (canvas.height * imgWidth) / canvas.width; 

        // Convert canvas to JPEG for smaller size
        const imgData = canvas.toDataURL('image/jpeg', 0.8); 
        images.push({ imgData, imgHeight });

        element.style.fontSize = originalFontSize; 
    }

    restoreButtons();


    let totalPages = 1;
    let currentHeight = position;

    images.forEach((image, index) => {
        if (currentHeight + image.imgHeight + spacing > pageHeight) {
            totalPages++; 
            currentHeight = position; 
        }
        currentHeight += image.imgHeight + spacing;
    });


    currentHeight = position; 
    let pageNum = 1;

    for (let image of images) {
        if (currentHeight + image.imgHeight + spacing > pageHeight) {
            pageNum++;
            pdf.addPage(); 
            currentHeight = 30; 
        }


        await addHeader(pageNum, totalPages);
        addFooter();


        pdf.addImage(image.imgData, 'JPEG', 0, currentHeight, imgWidth, image.imgHeight);
        currentHeight += image.imgHeight + spacing; 
    }

    //function for logo to display properly
    async function convertWebPToBase64(imagePath) {
        const image = new Image();
        image.src = imagePath;
        image.crossOrigin = "Anonymous"; 

        return new Promise((resolve, reject) => {
            image.onload = function () {
                const canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext("2d");


                ctx.drawImage(image, 0, 0);

               
                const base64 = canvas.toDataURL("image/png"); 
                resolve(base64);
            };

            image.onerror = function () {
                reject("Failed to load the image.");
            };
        });
        }


        pdf.save('Non_Conformance_Report.pdf');
    });

//event for printing(same format and layout as pdf)
document.getElementById('print').addEventListener('click', async function () {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4'); 
    const elements = document.querySelectorAll('details'); 

    const hideButtons = () => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => button.style.display = 'none'); 
    };


    const restoreButtons = () => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => button.style.display = '');
    };

    const imgWidth = 210; 
    const pageHeight = 297; 
    const options = {
        scale: 1, 
        useCORS: true, 
        background: '#fff' 
    };

    const images = [];
    const spacing = 10;


    const addHeader = async (pageNum, totalPages) => {
        pdf.setFontSize(12);
        pdf.setTextColor(0);
        pdf.setDrawColor(0);


        const logoBase64 = await convertWebPToBase64('images/logo.webp');
        pdf.addImage(logoBase64, "PNG", 0, 0, 65, 15);
        pdf.setFontSize(8);
        pdf.setTextColor(0);


        pdf.text('Document No.:', 10, 20);
        pdf.text('OPS-00011', 30, 20);
        pdf.text('Document Title:', 70, 20)
        pdf.text('Non-Conformance Report', 90, 20); 
        pdf.text(`Page: ${pageNum} of ${totalPages}`, 170, 20);

        pdf.setFontSize(14);
        pdf.text('Internal Process Document', 140, 10);


        pdf.setDrawColor(0);
        pdf.line(0, 15, imgWidth, 15);
        pdf.line(60, 15, 60, 25);
        pdf.line(160, 15, 160, 25);
        pdf.line(0, 25, imgWidth, 25); 
    };


    const addFooter = () => {
        pdf.setFontSize(8);
        pdf.setTextColor(0);
        pdf.setDrawColor(0);

        const footerY = pageHeight - 5; 


        pdf.text('Document Author:', 2, footerY-3);

        pdf.text('Document Date:', 62, footerY-3);
        pdf.text(new Date().toLocaleDateString(), 62, footerY+1);

        pdf.text('Approved By:', 102, footerY-3);

        pdf.text('Revision Date:', 160, footerY-3);
        pdf.text('07.14.2020', 160, footerY+1); 

        pdf.text('Revision No:', 190, footerY-3);
        pdf.text('013', 190, footerY+1); 


        pdf.setDrawColor(0); 
        pdf.line(60, footerY - 7, 60, pageHeight);  
        pdf.line(100, footerY - 7, 100, pageHeight);
        pdf.line(157, footerY - 7, 157, pageHeight); 
        pdf.line(187, footerY - 7, 187, pageHeight); 

        pdf.line(0, footerY - 7, imgWidth, footerY - 7); 
    };

    const position = 30; 

    hideButtons(); 


    for (let element of elements) {
        const originalFontSize = window.getComputedStyle(element).fontSize; 
        element.style.fontSize = '20px'; 

        const canvas = await html2canvas(element, options);
        const imgHeight = (canvas.height * imgWidth) / canvas.width; 

        // Convert canvas to JPEG for smaller size
        const imgData = canvas.toDataURL('image/jpeg', 0.8); 
        images.push({ imgData, imgHeight });

        element.style.fontSize = originalFontSize; 
    }

    restoreButtons();


    let totalPages = 1;
    let currentHeight = position;

    images.forEach((image, index) => {
        if (currentHeight + image.imgHeight + spacing > pageHeight) {
            totalPages++; 
            currentHeight = position; 
        }
        currentHeight += image.imgHeight + spacing;
    });


    currentHeight = position; 
    let pageNum = 1;

    for (let image of images) {
        if (currentHeight + image.imgHeight + spacing > pageHeight) {
            pageNum++;
            pdf.addPage(); 
            currentHeight = 30; 
        }


        await addHeader(pageNum, totalPages);
        addFooter();


        pdf.addImage(image.imgData, 'JPEG', 0, currentHeight, imgWidth, image.imgHeight);
        currentHeight += image.imgHeight + spacing; 
    }

    async function convertWebPToBase64(imagePath) {
        const image = new Image();
        image.src = imagePath;
        image.crossOrigin = "Anonymous"; 

        return new Promise((resolve, reject) => {
            image.onload = function () {
                const canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext("2d");


                ctx.drawImage(image, 0, 0);

               
                const base64 = canvas.toDataURL("image/png"); 
                resolve(base64);
            };

            image.onerror = function () {
                reject("Failed to load the image.");
            };
        });
    }

    // Open the PDF in a new tab for print preview
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfUrl);

    printWindow.addEventListener('load', function () {
        printWindow.print(); 
    });
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
        let notifications = JSON.parse(localStorage.getItem('notifications')) || []
        notifications = notifications.map(notification => {
            return {
                ...notification, // Copy all existing properties
                ischecked: true  // Override the `ischecked` property
            };
        });
        

        localStorage.setItem('notifications', JSON.stringify(notifications));
        setNotificationText()

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

function loadImages() {
    const imageContainer = document.getElementById('defectedProdImages'); // Make sure this container exists in your HTML

    // List of image filenames in your 'productImages' folder
    const imageFiles = [
        'screwimage1.jpg',
        'screwimage2.jpg',
        'screwimage3.jpg'
    ];

    // Loop through the image files and create img elements
    imageFiles.forEach(imageFile => {
        const imgElement = document.createElement('img');
        imgElement.src = `/productImages/${imageFile}`; // URL pointing to the static folder
        imgElement.alt = imageFile; // Image file name as alt text
        imgElement.classList.add('dynamic-image'); // Add a class to the image
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

btnExport.addEventListener('click', () => {
    exportToExcel(retrievedNCRData['ncr_no'])

})
async function exportToExcel(ncrNum) {

    let index = AllReports.findIndex(report => report.ncr_no == ncrNum)
    let report = AllReports[index]
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('sheet1')

    // Title and date header
    worksheet.mergeCells('A1:E1')
    worksheet.getCell('A1').value = 'Non Conformance Report'
    worksheet.getCell('A1').alignment = { horizontal: 'center' }
    worksheet.getCell('A1').font = { bold: true, size: 20 }

    worksheet.mergeCells('A2:E2')
    worksheet.getCell('A2').value = `NCR No: ${ncrNum} - Date of Report: ${report.qa.date}`
    worksheet.getCell('A2').alignment = { horizontal: 'center', wrapText: true }


    // Create headers for QA, Engineering, and Purchasing
    worksheet.mergeCells('A3:B3')
    worksheet.getCell('A3').value = 'QA Information'
    worksheet.getCell('A3').alignment = { horizontal: 'Left' }
    worksheet.getCell('A3').font = { bold: true, underline: true, size: 18 }

    worksheet.getCell('A4').value = 'Supplier Name'
    worksheet.getCell('A4').font = { bold: true }
    worksheet.getCell('B4').value = report.qa.supplier_name

    worksheet.getCell('A5').value = 'Product Number'
    worksheet.getCell('A5').font = { bold: true }
    worksheet.getCell('B5').value = report.qa.po_no

    worksheet.getCell('A6').value = 'Item Name'
    worksheet.getCell('A6').font = { bold: true }
    worksheet.getCell('B6').value = report.qa.item_name

    worksheet.getCell('A7').value = 'Item Description'
    worksheet.getCell('A7').font = { bold: true }
    worksheet.getCell('B7').value = report.qa.item_description


    worksheet.getCell('A8').value = 'Sales Order Number'
    worksheet.getCell('A8').font = { bold: true }
    worksheet.getCell('B8').value = report.qa.sales_order_no

    worksheet.getCell('A9').value = 'Quantity Received'
    worksheet.getCell('A9').font = { bold: true }
    worksheet.getCell('B9').value = report.qa.quantity_received
    worksheet.getCell('B9').alignment = { horizontal: 'left' }

    worksheet.getCell('A10').value = 'Quantity Defective'
    worksheet.getCell('A10').font = { bold: true }
    worksheet.getCell('B10').value = report.qa.quantity_defective
    worksheet.getCell('B10').alignment = { horizontal: 'left' }

    worksheet.getCell('D4').value = 'Description Of Defect'
    worksheet.getCell('D4').font = { bold: true }
    worksheet.getCell('E4').value = report.qa.description_of_defect

    worksheet.getCell('D5').value = 'Item Marked Non-Conforming'
    worksheet.getCell('D5').font = { bold: true }
    worksheet.getCell('E5').value = report.qa.item_marked_nonconforming === true ? 'Yes' : 'No'

    worksheet.getCell('D6').value = 'Quality Representative name'
    worksheet.getCell('D6').font = { bold: true }
    worksheet.getCell('E6').value = report.qa.quality_representative_name

    worksheet.getCell('D7').value = 'Resolved'
    worksheet.getCell('D7').font = { bold: true }
    worksheet.getCell('E7').value = report.qa.resolved === true ? 'Yes' : 'No'

    // Engineering Department
    worksheet.mergeCells('A13:B13')
    worksheet.getCell('A13').value = 'Engineering'
    worksheet.getCell('A13').alignment = { horizontal: 'Left' }
    worksheet.getCell('A13').font = { bold: true, underline: true, size: 18 }

    worksheet.getCell('A14').value = 'Disposition'
    worksheet.getCell('A14').font = { bold: true }
    worksheet.getCell('B14').value = report.engineering.disposition

    worksheet.getCell('A15').value = 'Original Version Number'
    worksheet.getCell('A15').font = { bold: true }
    worksheet.getCell('B15').value = report.engineering.original_rev_number

    worksheet.getCell('A16').value = 'Updated Revision Number'
    worksheet.getCell('A16').font = { bold: true }
    worksheet.getCell('B16').value = report.engineering.updated_rev_number

    worksheet.getCell('A17').value = 'Engineer Name'
    worksheet.getCell('A17').font = { bold: true }
    worksheet.getCell('B17').value = report.engineering.engineer_name


    worksheet.getCell('A18').value = 'Revision Date'
    worksheet.getCell('A18').font = { bold: true }
    worksheet.getCell('B18').value = report.engineering.revision_date

    worksheet.getCell('A19').value = 'Engineer Review Date'
    worksheet.getCell('A19').font = { bold: true }
    worksheet.getCell('B19').value = report.engineering.engineering_review_date


    worksheet.getCell('D14').value = 'Disposition Details'
    worksheet.getCell('D14').font = { bold: true }
    worksheet.getCell('E14').value = report.engineering.disposition_details

    worksheet.getCell('D15').value = 'Drawing Update Required'
    worksheet.getCell('D15').font = { bold: true }
    worksheet.getCell('E15').value = report.engineering.drawing_update_required === true ? 'Yes' : 'No'

    worksheet.getCell('D16').value = 'Quality Representative name'
    worksheet.getCell('D16').font = { bold: true }
    worksheet.getCell('E16').value = report.qa.quality_representative_name

    worksheet.getCell('D17').value = 'Resolved'
    worksheet.getCell('D17').font = { bold: true }
    worksheet.getCell('E17').value = report.qa.resolved === true ? 'Yes' : 'No'

    // Purchasing Department
    worksheet.mergeCells('A22:B22')
    worksheet.getCell('A22').value = 'Purchasing'
    worksheet.getCell('A22').alignment = { horizontal: 'Left' }
    worksheet.getCell('A22').font = { bold: true, underline: true, size: 18 }

    worksheet.getCell('A23').value = 'Preliminary Decision'
    worksheet.getCell('A23').font = { bold: true }
    worksheet.getCell('B23').value = report.purchasing_decision.preliminary_decision

    worksheet.getCell('A24').value = 'Rework In-House'
    worksheet.getCell('A24').font = { bold: true }
    worksheet.getCell('B24').value = report.purchasing_decision.options.rework_in_house === true ? 'Yes' : 'No'

    worksheet.getCell('A25').value = 'Scrap In-House'
    worksheet.getCell('A25').font = { bold: true }
    worksheet.getCell('B25').value = report.purchasing_decision.options.scrap_in_house === true ? 'Yes' : 'No'

    worksheet.getCell('A26').value = 'Defer to Engineering'
    worksheet.getCell('A26').font = { bold: true }
    worksheet.getCell('B26').value = report.purchasing_decision.options.defer_to_engineering === true ? 'Yes' : 'No'

    worksheet.getCell('A27').value = 'CAR Raised'
    worksheet.getCell('A27').font = { bold: true }
    worksheet.getCell('B27').value = report.purchasing_decision.car_raised === true ? 'Yes' : 'No'

    worksheet.getCell('A28').value = 'CAR Number'
    worksheet.getCell('A28').font = { bold: true }
    worksheet.getCell('B28').value = report.purchasing_decision.car_number

    worksheet.getCell('A29').value = 'Follow-Up Required'
    worksheet.getCell('A29').font = { bold: true }
    worksheet.getCell('B29').value = report.purchasing_decision.follow_up_required === true ? 'Yes' : 'No'

    worksheet.getCell('D23').value = 'Operations Manager Name'
    worksheet.getCell('D23').font = { bold: true }
    worksheet.getCell('E23').value = report.purchasing_decision.operations_manager_name

    worksheet.getCell('D24').value = 'Operations Manager Date'
    worksheet.getCell('D24').font = { bold: true }
    worksheet.getCell('E24').value = report.purchasing_decision.operations_manager_date

    worksheet.getCell('D25').value = 'Re-Inspected Acceptable'
    worksheet.getCell('D25').font = { bold: true }
    worksheet.getCell('E25').value = report.purchasing_decision.re_inspected_acceptable === true ? 'Yes' : 'No'

    worksheet.getCell('D26').value = 'New NCR Number'
    worksheet.getCell('D26').font = { bold: true }
    worksheet.getCell('E26').value = report.purchasing_decision.new_ncr_number

    worksheet.getCell('D27').value = 'Inspector Name'
    worksheet.getCell('D27').font = { bold: true }
    worksheet.getCell('E27').value = report.purchasing_decision.inspector_name

    worksheet.getCell('D28').value = 'NCR Closed'
    worksheet.getCell('D28').font = { bold: true }
    worksheet.getCell('E28').value = report.purchasing_decision.ncr_closed === true ? 'Yes' : 'No'

    worksheet.getCell('D29').value = 'Resolved'
    worksheet.getCell('D29').font = { bold: true }
    worksheet.getCell('E29').value = report.purchasing_decision.resolved === true ? 'Yes' : 'No'

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `NCR-${report.ncr_no}.xlsx`);
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