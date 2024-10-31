// home.js

// Variables to hold NCR data and user
let ncr = [];
let user = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Home page script running');

    // Retrieve the current user from session storage
    user = JSON.parse(sessionStorage.getItem("currentUser"));
    console.log(user?.role); // Optional chaining to prevent errors if user is null

    // Fetch NCR data
    fetch('Data/ncr_reports.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            ncr = data; // Store NCR data
            initializeButtons();
            // initializeChart()
            // initializeBarChart()
        })
        .catch(error => console.error('Error fetching NCR data:', error));
});
const footer = document.getElementById('footer-scroll') 
footer.addEventListener('click', ()=>{
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})
// Initialize button click event listeners
function initializeButtons() {
    const btnCreate = document.getElementById('createNcr');
    const btnView = document.getElementById('viewNcr');
    const btnManage = document.getElementById('ManageAcc');
    const p = document.getElementById('create-ncr-p');
    const header = document.getElementById('create-ncr-header');

    if(user.role == 'QA Inspector'){

        btnCreate.addEventListener('click', () => {
            window.location.href = `create_NCR.html?ncr_no=${generateNextNcrNumber(ncr)}`;
        });
    }
    else{
        btnCreate.innerHTML = '<i class="fa fa-clipboard"></i> Open Logged NCR'
        header.innerHTML = 'Open NCR'
        p.innerHTML = 'Open Recent Non-Conformance Reports'
        btnCreate.addEventListener('click', ()=>{
            const queryString = createQueryString(ncr[0]);
            window.location.href = `logged_NCR.html?${queryString}`
        })
    }

    btnView.addEventListener('click', () => {
        window.location.href = 'view.html';
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

    return `${currentYear}${nextNumber}`; // Return new NCR number
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

function toggleNotifications() {
    var notificationBox = document.getElementById("notification-box");
    if (notificationBox.style.display === "none" || notificationBox.style.display === "") {
        notificationBox.style.display = "block";
    } else {
        notificationBox.style.display = "none";
    }
}

// Optional: Hide the notification box if clicked outside
document.addEventListener("click", function(event) {
    var notificationBox = document.getElementById("notification-box");
    var iconBadge = document.querySelector(".icon-badge");

    if (!notificationBox.contains(event.target) && !iconBadge.contains(event.target)) {
        notificationBox.style.display = "none";
    }
});

// const dates = ncr.map(report => new Date(report.qa.date));

// function initializeChart() {
//     const dates = [];
//     const qaDefects = [];

//     ncr.forEach(report => {
//         const date = new Date(report.qa.date); // Parse date
//         dates.push(date);
//         qaDefects.push(report.qa.quantity_defective || 0); // Only focusing on QA defects
//     });

//     // Ensure at least one data point to avoid empty lines
//     if (dates.length === 0) return console.error("No data available to display in chart");

//     const ctx = document.getElementById('ncrChart').getContext('2d');
//     new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: dates,
//             datasets: [
//                 { label: 'QA Defects', data: qaDefects, borderColor: 'rgba(255, 0, 0, 1)', fill: false } // Use a standout color like red
//             ]
//         },
//         options: {
//             responsive: true,
//             title: { display: true, text: 'QA Defects Over Time' }, // Clear and straightforward title
//             scales: {
//                 x: {
//                     type: 'time', // Ensure x-axis treats data as time
//                     time: { unit: 'day' },
//                     title: { display: true, text: 'Date' }
//                 },
//                 y: { title: { display: true, text: 'Number of Defects' } }
//             }
//         }
//     });
// }
// function initializeBarChart() {
//     // Initialize total defects counters for each department
//     const totalDefects = {
//         qa: 0,
//         engineering: 0,
//         purchasing: 0,
//     };

//     // Calculate total defects for each department from the NCR data
//     ncr.forEach(report => {
//         totalDefects.qa += report.qa.quantity_defective || 0;
//         totalDefects.engineering += report.engineering.resolved ? 1 : 0;
//         totalDefects.purchasing += report.purchasing_decision.ncr_closed ? 1 : 0;
//     });

//     // Get the context of the canvas element
//     const ctx = document.getElementById('barChart').getContext('2d');

//     // Create the bar chart
//     new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: ['QA', 'Engineering', 'Purchasing'], // Department labels
//             datasets: [{
//                 label: 'Total Defects', // Dataset label
//                 data: [totalDefects.qa, totalDefects.engineering, totalDefects.purchasing], // Defect counts
//                 backgroundColor: [
//                     'rgba(75, 192, 192, 0.6)', // Color for QA
//                     'rgba(54, 162, 235, 0.6)', // Color for Engineering
//                     'rgba(255, 206, 86, 0.6)'  // Color for Purchasing
//                 ],
//             }]
//         },
//         options: {
//             responsive: true,
//             title: { display: true, text: 'Total Defects by Department' }, // Chart title
//             scales: {
//                 y: { title: { display: true, text: 'Number of Defects' } } // Y-axis title
//             }
//         }
//     });
// }


