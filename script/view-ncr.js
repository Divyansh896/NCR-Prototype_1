let ncrData = []; // Define a variable to hold the data
const footer = document.getElementById('footer-scroll') 
footer.addEventListener('click', ()=>{
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})
// DOMContentLoaded ensures that first all of the HTML is loaded in the web page before adding anything to the HTML structure.
document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading the data
    fetch('Data/ncr_reports.json')
        .then(response => response.json()) // Convert the response to JSON format
        .then(data => {
            ncrData = data; // Assign fetched data to ncrData
            populateTable(ncrData); // Populate table initially
            document.getElementById('record-count').textContent = `Records found: ${ncrData.length}`;
            document.getElementById('status-all').checked = true
        })
        .catch(error => console.error("An error occurred while retrieving data: ", error));
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      const activeElement = document.activeElement;
      if (activeElement.type === 'radio') {
        activeElement.click(); // Programmatically click the radio button
      }
    }
  });
  

function getReportStage(ncr) {
    if (!ncr.qa.resolved) {
        return 'QA'; // QA stage is open
    } else if (!ncr.engineering.resolved) {
        return 'engineering'; // Engineering stage is open
    } else if (!ncr.purchasing_decision.resolved) {
        return 'Purchasing'; // Purchasing stage is open
    } else {
        return 'Closed'; // All stages are closed
    }
}
// 2. Function to populate the table
function populateTable(data) {
    const tBody = document.getElementById('ncr-tbody'); // Get the table body
    tBody.innerHTML = ''; // Resetting the table to empty

    // Populate the table with data
    data.forEach(ncr => {
        // Create a new row
        const row = document.createElement('tr');
        const reportStage = getReportStage(ncr);


        // Add table cells (td) for each piece of data
        row.innerHTML = `
            <td>${ncr.qa.supplier_name || 'N/A'}</td>
            <td>${ncr.ncr_no || 'N/A'}</td>
            <td>${ncr.qa.item_description || 'N/A'}</td>
            <td>${ncr.qa.date || 'N/A'}</td>
            <td>${ncr.status}</td>
            <td>${reportStage}</td>
        `;

        row.addEventListener('click', () => {
            let data = {
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
            sessionStorage.setItem('data', JSON.stringify(data))
            window.location.href = `ncReport.html`; // Adjust the URL to your routing
        });

        // Append the row to the table body
        tBody.appendChild(row);
    });
}
// 3. Filtering the NCR reports logic
function filterNcr(ncrData) {
    // Getting the data from the filtering options
    const search = document.getElementById('search').value; // Get the selected option value
    const date = document.getElementById('date-filter').value;

    // Getting the selected status filter value
    const status = document.querySelector('input[name="status"]:checked')?.value; // Optional chaining for safety

    let records = document.getElementById('record-count');

    const filteredData = ncrData.filter(ncr => {
        // Filtering the data based on search by supplier name
        const matchedSearch = (search === "All") || (ncr.qa.supplier_name === search);

        // Filtering the data based on date
        const matchedDate = !date || (date === ncr.qa.date);

        // Filtering by status
        const matchedStatus = !status ||
            (status === 'all') ||
            (status === 'completed' && ncr.status === 'completed') ||
            (status === 'incomplete' && ncr.status === 'incomplete');

        return matchedSearch && matchedDate && matchedStatus;
    });

    records.textContent = `Records found: ${filteredData.length}`;
    populateTable(filteredData); // Re-populate table with filtered data
}

// Attaching the events to the filter inputs
document.getElementById('search').addEventListener('change', () => filterNcr(ncrData));
document.getElementById('date-filter').addEventListener('change', () => filterNcr(ncrData));
document.querySelectorAll('input[name="status"]').forEach(input => {
    input.addEventListener('change', () => filterNcr(ncrData));
});


// 4. Attaching the events to the filter inputs
document.getElementById('search').addEventListener('input', () => filterNcr(ncrData));
document.getElementById('date-filter').addEventListener('change', () => filterNcr(ncrData));
document.querySelectorAll('input[name="status"]').forEach(input => {
    input.addEventListener('change', () => filterNcr(ncrData));
});
