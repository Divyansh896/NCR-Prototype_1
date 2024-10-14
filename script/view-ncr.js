let ncrData = []; // Define a variable to hold the data
const footer = document.getElementById('footer-scroll');

// Smooth scroll to the top on footer click
footer.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    });
});

// Load data after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    fetch('Data/ncr_reports.json')
        .then(response => response.json())
        .then(data => {
            ncrData = data;
            populateTable(ncrData); // Populate table initially
            document.getElementById('record-count').textContent = `Records found: ${ncrData.length}`;
            document.getElementById('status-all').checked = true;
        })
        .catch(error => console.error("An error occurred while retrieving data: ", error));
});

// Allow radio buttons to be selected with the 'Enter' key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.type === 'radio') {
            activeElement.click(); // Programmatically click the radio button
        }
    }
});

function getReportStage(ncr) {
    if (!ncr.qa.resolved) return 'QA';
    if (!ncr.engineering.resolved) return 'Engineering';
    if (!ncr.purchasing_decision.resolved) return 'Purchasing';
    return 'Closed';
}

function populateTable(data) {
    const tBody = document.getElementById('ncr-tbody');
    tBody.innerHTML = ''; // Clear the table

    data.forEach(ncr => {
        const row = document.createElement('tr');
        const reportStage = getReportStage(ncr);

        row.innerHTML = `
            <td>${ncr.qa.supplier_name || 'N/A'}</td>
            <td>${ncr.ncr_no || 'N/A'}</td>
            <td>${ncr.qa.item_description || 'N/A'}</td>
            <td>${ncr.qa.date || 'N/A'}</td>
            <td>${ncr.status}</td>
            <td>${reportStage}</td>
        `;

        row.addEventListener('click', () => {
            const data = {
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
            };
            sessionStorage.setItem('data', JSON.stringify(data));
            window.location.href = `ncReport.html`; // Adjust the URL as needed
        });

        tBody.appendChild(row);
    });
}

function filterNcr(ncrData) {
    const search = document.getElementById('search');
    const date = document.getElementById('date-filter');
    const status = document.querySelector('input[name="status"]:checked')?.value;
    const records = document.getElementById('record-count');

    const filteredData = ncrData.filter(ncr => {
        const matchedSearch = (search.value === "All") || (ncr.qa.supplier_name === search.value);
        const matchedDate = !date.value || (date.value === ncr.qa.date);
        const matchedStatus = !status ||
            (status === 'all') ||
            (status === 'completed' && ncr.status === 'completed') ||
            (status === 'incomplete' && ncr.status === 'incomplete');

        return matchedSearch && matchedDate && matchedStatus;
    });

    records.textContent = `Records found: ${filteredData.length}`;
    populateTable(filteredData);
}

// Attach filter events
document.getElementById('search').addEventListener('change', () => filterNcr(ncrData));
document.getElementById('date-filter').addEventListener('change', () => filterNcr(ncrData));
document.querySelectorAll('input[name="status"]').forEach(input => {
    input.addEventListener('change', () => filterNcr(ncrData));
});

// Reset filter inputs and update table
document.getElementById('btn-reset').addEventListener('click', () => {
    document.getElementById('search').value = "All";
    document.getElementById('date-filter').value = null;
    document.getElementById('status-all').checked = true;
    filterNcr(ncrData); // Update the table after resetting filters
});
