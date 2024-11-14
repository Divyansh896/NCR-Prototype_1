// Variables to hold NCR data and user
let ncr = [];
const user = JSON.parse(sessionStorage.getItem("currentUser"))
const panels = document.querySelectorAll('.tab-panel');
const btnRecent = document.getElementById('btn-recent');
const btnPinned = document.getElementById('btn-pinned');
const btnSaved = document.getElementById('btn-saved');
const recentContainer = document.getElementById('recentReportsContainer');
const pinnedContainer = document.getElementById('pinnedReportsContainer');
const notificationlist = document.getElementById('notification-list');
const notificationCount = document.getElementById('notification-count');
setNotificationText()
// Get the modal
const modal = document.getElementById("popup");

// Get the <span> element that closes the modal
const span = document.getElementById("closePopup");
const userName = document.getElementById('userName');
userName.innerHTML = `${user.firstname}  ${user.lastname}`

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the current user from session storage
    // user = JSON.parse(sessionStorage.getItem("currentUser"));
    // console.log(user?.role); // Optional chaining to prevent errors if user is null

    // Fetch NCR data
    fetch('Data/ncr_reports.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            ncr = data; // Store NCR data
            // localStorage.setItem('AllReports', JSON.stringify(ncr))

            initializeButtons();
            displayRecentReports(ncr); // Initially display recent reports
            initializeItemBarChart();
            initializeDateLineChart(ncr); // Pass in your dataset as `ncrData`

        })
        .catch(error => console.error('Error fetching NCR data:', error));
});

ncr = JSON.parse(localStorage.getItem('AllReports'))
// Check if user data is available and has a role
if (user && user.role) {
    // Update the Create NCR link based on user role
    function updateNCRLink() {
        var ncrLink = document.querySelector('a[aria-label="Create a new Non-Conformance Report"]')

        if (ncrLink) { // Ensure ncrLink exists
            if (user.role === "Lead Engineer" || user.role === "Purchasing") {
                // Change to "Logged NCR" for lead engineers and purchasing roles
                ncrLink.href = `current_NCR.html`
                ncrLink.innerHTML = '<i class="fa fa-sign-in"></i>Current NCR'
                ncrLink.setAttribute("aria-label", "View current Non-Conformance Reports")
            }
        } else {
            console.warn('Link with aria-label "Create a new Non-Conformance Report" not found.')
        }
    }

    updateNCRLink()
} else {
    console.warn("User data not found in sessionStorage or missing role.")
}
const footer = document.getElementById('footer-scroll');
footer.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    });
});

// Initialize button click event listeners
function initializeButtons() {
    const btnCreate = document.getElementById('createNcr');
    const btnView = document.getElementById('viewNcr');
    const btnManage = document.getElementById('ManageAcc');
    const p = document.getElementById('create-ncr-p');
    const header = document.getElementById('create-ncr-header');

    if (user.role === 'QA Inspector') {
        const nextNcrNumber = generateNextNcrNumber(ncr); // Calculate only once

        // Update the 'Create NCR' button's action
        btnCreate.addEventListener('click', () => {
            window.location.href = `create_NCR.html?ncr_no=${nextNcrNumber}`;
        });

        // Update the link's href
        const ncrLink = document.querySelector('a[aria-label="Create a new Non-Conformance Report"]');
        if (ncrLink) {
            ncrLink.href = `create_NCR.html?ncr_no=${nextNcrNumber}`;
        }
    }

    else {
        btnCreate.innerHTML = '<i class="fa fa-clipboard"></i> Open current NCR';
        btnCreate.nextElementSibling.textContent = "Click to open current NCRs"
        header.innerHTML = 'Open current NCR';
        p.innerHTML = 'Open Recent Non-Conformance Reports';
        btnCreate.addEventListener('click', () => {
            const queryString = createQueryString(ncr[0]);
            window.location.href = `current_NCR.html?${queryString}`;
        });
    }

    btnView.addEventListener('click', () => {
        window.location.href = 'NCR_log.html';
    });

    btnManage.addEventListener('click', () => {
        window.location.href = 'account.html';
    });
}

// Generate the next NCR number
function generateNextNcrNumber(ncrData) {
    const lastNcrNumber = ncrData[ncrData.length - 1].ncr_no; // Get the last NCR number from data
    const year = lastNcrNumber.substring(0, 4); // Extract the first 4 digits as the year
    const lastNumber = lastNcrNumber.slice(-3); // Extract the last 3 digits
    const currentYear = new Date().getFullYear().toString();
    let nextNumber;

    // Increment number if it's the same year
    if (year === currentYear) {
        nextNumber = (parseInt(lastNumber) + 1).toString().padStart(3, '0');
    } else {
        nextNumber = '001'; // Reset number if it's a new year
    }

    const num = `${currentYear}-${nextNumber}`

    localStorage.setItem('ncrNo', num)
    return num ; // Return new NCR number
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

function getReportStage(ncr) {
    if (!ncr.qa.resolved) return 'QA';
    if (!ncr.engineering.resolved) return 'Engineering';
    if (!ncr.purchasing_decision.resolved) return 'Purchasing';
    return '';
}

function displayRecentReports(data) {
    const container = recentContainer;
    container.innerHTML = ''; // Clear previous content


    // Get the last 5 reports
    const lastFiveReports = data.slice(-5);

    lastFiveReports.forEach(ncr => {
        // Create the main container for each report card
        const reportCard = document.createElement('div');
        reportCard.classList.add('report-card');

        // Supplier and report information
        const supplierName = document.createElement('span');
        supplierName.classList.add('supplier-name');
        supplierName.textContent = ncr.qa?.supplier_name || 'Unknown Supplier';

        const reportInfo = document.createElement('span');
        reportInfo.classList.add('reportInfo');
        reportInfo.textContent = `${ncr.qa?.date || 'No Date Available'} - NCR No: ${ncr.ncr_no || 'N/A'} - ${ncr.qa?.item_description?.substring(0, 80) || 'No Description Available'}...`;

        // Tooltip container and tooltip
        const tooltipContainer = document.createElement('div');
        tooltipContainer.classList.add('tooltip-container');

        const tooltip = document.createElement('span');
        tooltip.classList.add('tooltip');
        tooltip.textContent = "Click to view/edit NCR";

        // Pin icon with tooltip events
        const pinIcon = document.createElement('span');
        pinIcon.classList.add('pinIcon');
        pinIcon.innerHTML = `<i class="fa fa-thumb-tack" aria-hidden="true"></i>`;

        // Tooltip text change on hover
        pinIcon.addEventListener('mouseenter', (e) => {
            tooltip.textContent = "Click to pin this NCR";

        });
        pinIcon.addEventListener('mouseleave', () => {
            tooltip.textContent = "Click to open/edit NCR";
        });



        // Add click event to pin icon for pinning
        pinIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents triggering the report card click event

            const pinnedReports = JSON.parse(sessionStorage.getItem('pinnedReports')) || [];
            const isAlreadyPinned = pinnedReports.some(report => report.ncr_no === ncr.ncr_no);

            if (!isAlreadyPinned) {
                pinnedReports.push(ncr);
                sessionStorage.setItem('pinnedReports', JSON.stringify(pinnedReports));
                showPopup(
                    'Report Pinned!',
                    `NCR Report No. <strong>${ncr.ncr_no}</strong> has been added to your pinned reports!`,
                    'images/pin.png'
                );
            } else {
                showPopup(
                    'Already Pinned!',
                    `NCR Report No. <strong>${ncr.ncr_no}</strong> is already in your pinned reports.`,
                    'images/pin.png'
                );
            }
        });

        // Report card click event
        reportCard.addEventListener("click", () => {
            const data = extractData(ncr);
            sessionStorage.setItem('data', JSON.stringify(data));
            window.location.href = 'NC_Report.html';
        });

        // Append elements to the report card
        reportCard.appendChild(supplierName);
        reportCard.appendChild(reportInfo);
        reportCard.appendChild(pinIcon);

        // Append report card and tooltip to the tooltip container
        tooltipContainer.appendChild(reportCard);
        tooltipContainer.appendChild(tooltip);

        // Append tooltip container to the main container
        container.appendChild(tooltipContainer);
    });
}


function displayPinnedReports() {
    const container = pinnedContainer; // Use the existing pinnedReportsContainer
    container.innerHTML = ''; // Clear previous content

    // Retrieve pinned reports from session storage
    const pinnedReports = JSON.parse(sessionStorage.getItem('pinnedReports')) || []; // Ensure pinnedReports is defined

    if (pinnedReports.length === 0) {
        container.innerHTML = '<p>No pinned reports available.</p>';
        return;
    }

    pinnedReports.forEach(ncr => {
        const reportCard = document.createElement('div');
        reportCard.classList.add('report-card');

        // Assuming ncr is an individual object representing a report
        const supplierName = document.createElement('span');
        supplierName.classList.add('supplier-name');
        supplierName.textContent = ncr.qa?.supplier_name || 'Unknown Supplier';

        const reportinfo = document.createElement('span');
        reportinfo.classList.add('reportInfo')
        reportinfo.textContent = `${ncr.qa?.date || 'No Date Available'} - NCR No: ${ncr.ncr_no || 'N/A'} - ${ncr.qa?.item_description?.substring(0, 80) || 'No Description Available'}...`;

        const tooltipContainer = document.createElement('div');
        tooltipContainer.classList.add('tooltip-container');

        const tooltip = document.createElement('span');
        tooltip.classList.add('tooltip');
        tooltip.textContent = "Click to view/edit NCR";

        // Create the unpin icon
        const unpinIcon = document.createElement('span');
        unpinIcon.classList.add('unpinIcon');
        unpinIcon.innerHTML = `<i class="fa fa-thumb-tack" aria-hidden="true" style="position: relative; font-size: 24px;">
    <span style="
        position: absolute;
        top: 11px;
        left: -5px;
        right: -5px;
        bottom: 0;
        height: 2px;
        background-color: black;
        transform: rotate(-45deg) scale(1.2);
        transform-origin: center;
    "></span>
</i>

`
        // Add an event listener to the unpin icon
        unpinIcon.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering the report card's click event

            // Remove the report from the pinned reports array
            const updatedPinnedReports = pinnedReports.filter(report => report.ncr_no !== ncr.ncr_no);
            sessionStorage.setItem('pinnedReports', JSON.stringify(updatedPinnedReports));

            // Re-display pinned reports
            displayPinnedReports();
        });

        // Tooltip text change on hover
        unpinIcon.addEventListener('mouseenter', (e) => {
            tooltip.textContent = "Click to unpin this pinned NCR";

        });
        unpinIcon.addEventListener('mouseleave', () => {
            tooltip.textContent = "Click to open/edit NCR";
        });
        // Add a click event for the entire report card (if needed)
        reportCard.addEventListener("click", () => {
            const data = extractData(ncr);
            sessionStorage.setItem('data', JSON.stringify(data));
            window.location.href = 'NC_Report.html'; // Adjust the URL as needed
        });

        // Append the unpin icon to the report card
        reportCard.appendChild(supplierName);
        reportCard.appendChild(reportinfo);
        reportCard.appendChild(unpinIcon)

        tooltipContainer.appendChild(reportCard);
        tooltipContainer.appendChild(tooltip);

        // Append tooltip container to the main container
        container.appendChild(tooltipContainer);
    });
}

function displaySavedReports() {
    const container = document.getElementById("savedReportsContainer");
    container.innerHTML = ''; // Clear previous content

    const savedNCRs = JSON.parse(localStorage.getItem('savedNCRs')) || [];

    if (savedNCRs.length === 0) {
        container.innerHTML = '<p>No saved reports available.</p>';
        return;
    }

    savedNCRs.forEach(ncr => {
        const reportCard = document.createElement('div');
        reportCard.classList.add('report-card');

        const supplierName = document.createElement('span');
        supplierName.classList.add('supplier-name');
        supplierName.textContent = ncr.supplier_name || 'Unknown Supplier';

        const reportInfo = document.createElement('span');
        reportInfo.classList.add('reportInfo');
        reportInfo.textContent = `${ncr.date_of_saved || 'No Date Available'} - NCR No: ${ncr.ncr_no || 'N/A'} - ${ncr.dispositionDetails.substring(0, 80) || 'No Description Available'}...`;

        // "Continue Editing" Button
        const continueButton = document.createElement('button');
        continueButton.classList.add('continue-button');
        continueButton.textContent = "Continue Editing";

        // Button click event to navigate to form page with pre-filled data
        continueButton.addEventListener('click', () => {
            if (ncr.ncr_no && ncr.ncr_no !== '[NCR NO]') {
                // Pass the `ncr_no` via query parameter to `logged_NCR.html`
                window.location.href = `logged_NCR.html?ncr_no=${encodeURIComponent(ncr.ncr_no)}`;
            } else {
                alert('NCR Number is not valid. Please check the saved report.');
            }
        });

        reportCard.appendChild(supplierName);
        reportCard.appendChild(reportInfo);
        reportCard.appendChild(continueButton); // Append the button to the card

        container.appendChild(reportCard);
    });
}


// Initialize tab buttons
btnRecent.addEventListener('click', () => {
    showTab('recent');
    displayRecentReports(ncr); // Ensure recent reports are displayed when tab is clicked
});

btnPinned.addEventListener('click', () => {
    showTab('pinned');

    displayPinnedReports(); // Ensure pinned reports are displayed when tab is clicked
});
btnSaved.addEventListener('click', () => {
    showTab('saved');

    displaySavedReports(); // Ensure pinned reports are displayed when tab is clicked
    console.log(JSON.parse(localStorage.getItem("savedNCRs")))
});

function showTab(tab) {
    // Hide all panels
    panels.forEach(panel => panel.classList.remove('active'));

    // Deactivate all buttons
    btnRecent.classList.remove('active');
    btnPinned.classList.remove('active');
    btnSaved.classList.remove('active');

    // Activate the selected tab
    if (tab === 'recent') {
        document.getElementById('recent-reports').classList.add('active');
        btnRecent.classList.add('active'); // Activate recent button
    } else if (tab === 'pinned') {
        document.getElementById('pinned-reports').classList.add('active');
        btnPinned.classList.add('active'); // Activate pinned button
    } else if (tab === 'saved') {
        document.getElementById('saved-reports').classList.add('active');
        btnSaved.classList.add('active');
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
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('breadcrumbTrail')
    location.replace('index.html')
}

function initializeItemBarChart() {
    // Initialize an object to store the count of each item
    const itemCounts = {};

    // Count occurrences of each item name in the NCR data
    ncr.forEach(report => {
        const itemName = report.qa.item_name; // Access the item name from QA section
        // Increment the count for the item name
        if (itemCounts[itemName]) {
            itemCounts[itemName] += 1;
        } else {
            itemCounts[itemName] = 1;
        }
    });

    // Prepare data for the chart
    const labels = Object.keys(itemCounts); // Unique item names as labels
    const data = Object.values(itemCounts); // Counts as data points

    // Get the context of the canvas element
    const ctx = document.getElementById('itemBarChart').getContext('2d');

    // Create the bar chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels, // Set labels from item names
            datasets: [{
                label: 'Occurrences of Items in Reports', // Dataset label
                data: data, // Set data from item counts
                backgroundColor: 'rgba(2, 188, 188, 0.85)', // Darker bar color with less transparency
                borderColor: 'rgba(2, 188, 188, 0.85)', // Even darker border color for contrast
                borderWidth: 1, // Slightly thicker border to make the bars stand out
            }]
        },
        options: {
            responsive: true,
            title: { display: true, text: 'Count of Each Item in Reports' }, // Chart title
            scales: {
                y: {
                    title: { display: true, text: 'Count' }, // Y-axis title
                    beginAtZero: true
                },
                x: {
                    title: { display: true, text: 'Items' }
                }
            }
        }
    });
}




function initializeDateLineChart(ncrData) {
    // Initialize an object to hold the count of reports per date
    const reportCountsByDate = {};

    // Process each report in the data
    ncrData.forEach(report => {
        const reportDate = report.qa.date; // Assuming the date is in `qa.date`

        // Increment count for each report date
        if (reportCountsByDate[reportDate]) {
            reportCountsByDate[reportDate]++;
        } else {
            reportCountsByDate[reportDate] = 1;
        }
    });

    // Prepare data for the chart
    const dates = Object.keys(reportCountsByDate).sort(); // Sorted dates
    const reportCounts = dates.map(date => reportCountsByDate[date]); // Report counts matching dates

    // Get the context of the canvas element
    const ctx = document.getElementById('dateLineChart').getContext('2d');

    // Create the line chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates, // Dates as labels on the x-axis
            datasets: [{
                label: 'Reports Over Time',
                data: reportCounts, // Counts of reports on each date
                borderColor: 'rgba(2, 188, 188, 0.85)',
                backgroundColor: 'rgba(2, 188, 188, 0.85)',
                borderWidth: 1,
                tension: 0.5 // Smooth lines
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Report Trend Over Time'
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    },
                    type: 'time', // Time scale for the x-axis
                    time: {
                        unit: 'day', // Display daily data
                        displayFormats: {
                            day: 'MMM d' // Corrected to use lowercase 'd'
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Reports'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}



// Show the modal with a title, message, and icon
function showPopup(title, message, icon, callback) {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.querySelector('h2').innerText = title; // Set the title
    modalContent.querySelector('p').innerHTML = message; // Set the message as HTML

    const iconDiv = document.querySelector('.icon');
    // Clear previous icons
    iconDiv.innerHTML = '';
    const imgElement = document.createElement('img');
    imgElement.src = icon; // Replace with your image URL
    iconDiv.appendChild(imgElement);

    modal.style.display = "block"; // Show the modal

    setTimeout(() => {
        modalContent.style.opacity = "1"; // Fade in effect
        modalContent.style.transform = "translate(-50%, -50%)"; // Ensure it's centered
    }, 10); // Short timeout to ensure the transition applies

    // Define the close function
    const closeModal = () => {
        modalContent.style.opacity = "0"; // Fade out effect
        modalContent.style.transform = "translate(-50%, -60%)"; // Adjust position for effect
        setTimeout(() => {
            modal.style.display = "none"; // Hide the modal after transition
            callback(); // Execute the callback after closing the modal
        }, 500); // Wait for the transition to finish before hiding
    };

    // Close modal when <span> (x) is clicked
    span.onclick = closeModal;

    // Close modal when clicking outside of it
    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };
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
        if(user.role == 'Lead Engineer'){

            if (notificationText.includes('Engineering')) {
                // engineering department person get the mail from qa (will show review and begin work)
                li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>Please review and begin work as assigned.`;
            } else {
                // engineering department person sends the form to purchasing (will show has been sent to purchasing department)
                li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>${notificationText.slice(17)}`;
            }
        }
        else{
            li.innerHTML = `<strong>${notificationText.slice(0, 16)}</strong><br><br>${notificationText.slice(17)}`;

        }
        

        notificationList.prepend(li);
    });
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