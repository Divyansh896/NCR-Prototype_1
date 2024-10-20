// Smooth scroll to top on footer click
const footer = document.getElementById('footer-scroll');
footer.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    });
});
const retrievedNCRData = JSON.parse(sessionStorage.getItem('data'));

function setSpanContentFromSession() {
    // Retrieve values from session storage for each department


    // Set QA data to spans and inputs
    document.getElementById('supplier-name').textContent = retrievedNCRData['supplier_name'] || '';
    document.getElementById('product-no').textContent = retrievedNCRData['product_no'] || '';
    document.getElementById('sales-order-no').textContent = retrievedNCRData['sales_order_no'] || '';
    document.getElementById('description-item').textContent = retrievedNCRData['item_description'] || '';
    document.getElementById('quantity-received').textContent = retrievedNCRData['quantity_received'] || '';
    document.getElementById('quantity-defective').textContent = retrievedNCRData['quantity_defective'] || '';
    document.getElementById('description-defect').textContent = retrievedNCRData['description_of_defect'] || '';
    
    // Handle Non-Conforming Item marked spans
    if (retrievedNCRData['item_marked_nonconforming'] === true) {
        document.getElementById('item-marked-yes').textContent = 'Yes';
        document.getElementById('item-marked-no').textContent = ''; // Clear 'No'
    } else if (retrievedNCRData['item_marked_nonconforming'] === false) {
        document.getElementById('item-marked-no').textContent = 'No';
        document.getElementById('item-marked-yes').textContent = ''; // Clear 'Yes'
    } else {
        document.getElementById('item-marked-yes').textContent = ''; // Clear 'Yes'
        document.getElementById('item-marked-no').textContent = ''; // Clear 'No'
    }

    document.getElementById('qa-name').textContent = retrievedNCRData['quality_representative_name'] || '';
    document.getElementById('qa-date').textContent = retrievedNCRData['date'] || '';
    document.getElementById('qa-resolved').textContent = retrievedNCRData['qa_resolved'] === 'true' ? 'Yes' : 'No';
    document.getElementById('ncr-no').textContent = retrievedNCRData['ncr_no'] || '';

    if(retrievedNCRData['supplier_or_rec_insp'] == true){

        document.getElementById('qa-process').textContent = 'Supplier or rec insp'; // Ensure correct value
    }else{

        document.getElementById('qa-process').textContent = 'Wip production order'; // Check if this is intended
    }

    // Set Engineering data to spans and inputs
    document.getElementById('engineer-name').textContent = retrievedNCRData['engineer_name'] || '';
    document.getElementById('disposition').textContent = retrievedNCRData['disposition'] || ''; // Set select value
    document.getElementById('disposition-details').textContent = retrievedNCRData['disposition_details'] || '';
    document.getElementById('original-rev-number').textContent = retrievedNCRData['original_rev_number'] || '';
    document.getElementById('updated-rev-number').textContent = retrievedNCRData['updated_rev_number'] || '';
    document.getElementById('revision-date').textContent = retrievedNCRData['revision_date'] || ''; // Set date input value
    document.getElementById('engineering-review-date').textContent = retrievedNCRData['engineering_review_date'] || ''; // Set date input value
    document.getElementById('eng-resolved').textContent = retrievedNCRData['eng_resolved'] === 'true' ? 'Yes' : 'No';
    document.getElementById('customer-notification').textContent = retrievedNCRData['customer_notification_required'] === 'true' ? 'Yes' : 'No';
    document.getElementById('drawing-update-required').textContent = retrievedNCRData['drawing_update_required'] === 'true' ? 'Yes' : 'No';

    // Set Purchasing data to spans and inputs
    document.getElementById('preliminary-decision').textContent = retrievedNCRData['preliminary_decision'] || '';
    const dispositionOptions = retrievedNCRData['options'] || {};
    for (const [key, value] of Object.entries(dispositionOptions)) {
        if (value === true) {
            document.getElementById('options').textContent = key.replace(/_/g, ' '); // Replace underscores with spaces for readability
            break; // Stop after the first true value
        }
    }
    
    // document.getElementById('options').textContent = retrievedNCRData['options'] || ''; // Set select value
    document.getElementById('car-raised').textContent = retrievedNCRData['car_raised'] === 'true' ? 'Yes' : 'No';
    document.getElementById('car-number').textContent = retrievedNCRData['car_number'] || '';
    document.getElementById('follow-up-required').textContent = retrievedNCRData['follow_up_required'] === 'true' ? 'Yes' : 'No';
    document.getElementById('operations-manager-name').textContent = retrievedNCRData['operations_manager_name'] || '';
    document.getElementById('operations-manager-date').textContent = retrievedNCRData['operations_manager_date'] || ''; // Set date input value
    document.getElementById('inspector-name').textContent = retrievedNCRData['inspector_name'] || '';
    document.getElementById('ncr-closed').textContent = retrievedNCRData['ncr_closed'] === 'true' ? 'Yes' : 'No';
    document.getElementById('pu-resolved').textContent = retrievedNCRData['pu_resolved'] === 'true' ? 'Yes' : 'No';
    document.getElementById('new-ncr-number').textContent = retrievedNCRData['new_ncr_number'] || '';
    // console.log('review date:', retrievedNCRData['engineering_review_date'])
    // console.log('Product No:', qaData.productNo);
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', setSpanContentFromSession);
// Add similar logs for other data points

