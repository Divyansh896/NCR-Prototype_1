const supplierSelect = document.getElementById("supplier-select");
const supplierInfo = document.getElementById("supplier-info");
const supplierDetails = document.getElementById("supplier-details-container");
const supplierName = document.getElementById("supplier-name");
const supplierAddress = document.getElementById("supplier-address");
const supplierCity = document.getElementById("supplier-city");
const supplierCountry = document.getElementById("supplier-country");
const supplierPostalCode = document.getElementById("supplier-postalCode");
const supplierContact = document.getElementById("supplier-contact");
const supplierShippingMethod = document.getElementById("supplier-shippingMethod");
const supplierDataContainer = document.getElementById("supplier-data-container");
const btnExport = document.getElementById('export-supplier');
const panels = document.querySelectorAll('.tab-panel');
const btnsupplier = document.getElementById('btn-supplier');
const btnemployee = document.getElementById('btn-employee');
let suppliers = JSON.parse(localStorage.getItem('suppliers'));

btnExport.addEventListener('click', () => {
    if (supplierSelect.value == 'All') {
        exportAllSuppliersToExcel();
    } else {
        exportToExcel(supplierSelect.value);
    }
});

// Populate the dropdown on page load
populateSuppliers();
populateAllSuppliers()
// Initially, hide supplier details and show supplier list
supplierDetails.style.display = 'none';
supplierDataContainer.style.display = 'block';

function populateSuppliers() {
    supplierSelect.innerHTML = ""; // Clear all options

    // Default "All Suppliers" option
    const option = document.createElement("option");
    option.value = "All";
    option.textContent = "All Suppliers";
    supplierSelect.appendChild(option);

    // Add options for each supplier
    suppliers.forEach(supplier => {
        const option = document.createElement("option");
        option.value = supplier.supplierName;
        option.textContent = supplier.supplierName;
        supplierSelect.appendChild(option);
    });

    supplierSelect.value = 'All'; // Set "All" as the default selection
}

// Event listener for supplier selection change
supplierSelect.addEventListener('change', () => {
    if (supplierSelect.value === "All") {
        supplierDetails.style.display = 'none';
        supplierDataContainer.style.display = 'block';
        populateAllSuppliers(); // Populate all suppliers list
    } else {
        supplierDetails.style.display = 'block';
        supplierDataContainer.style.display = 'none';
        populateSupplierDetails(); // Populate selected supplier details
    }
});

function populateSupplierDetails() {
    let selectedSupplier = supplierSelect.value;
    let supplier = suppliers.find(supplier => supplier.supplierName === selectedSupplier);

    if (supplier) {
        supplierName.textContent = supplier.supplierName;
        supplierAddress.textContent = supplier.address;
        supplierCity.textContent = supplier.city;
        supplierCountry.textContent = supplier.country;
        supplierPostalCode.textContent = supplier.postalCode;
        supplierContact.textContent = supplier.contactNumber;
        supplierShippingMethod.textContent = supplier.shippingMethod;
    }
}

function populateAllSuppliers() {
    supplierDataContainer.innerHTML = ""; // Clear existing supplier data

    // Add the export button once
    const exportButtonDiv = document.createElement("div");
    exportButtonDiv.classList.add("supplier-actions");
    exportButtonDiv.innerHTML = `<button id="export-supplier" onclick='exportAllSuppliersToExcel()'>Export</button>`;
    supplierDataContainer.appendChild(exportButtonDiv);

    // Loop through all suppliers and create the supplier divs
    suppliers.forEach(supplier => {
        const supplierDiv = document.createElement("div");
        supplierDiv.classList.add("supplier-two-cols", "drop-shadow");

        supplierDiv.innerHTML = `
            <div>
                <div class="supplier-detail">
                    <label>Supplier Name:</label>
                    <span>${supplier.supplierName}</span>
                </div>
                <div class="supplier-detail">
                    <label>Address:</label>
                    <span>${supplier.address}</span>
                </div>
                <div class="supplier-detail">
                    <label>City:</label>
                    <span>${supplier.city}</span>
                </div>
                <div class="supplier-detail">
                    <label>Country:</label>
                    <span>${supplier.country}</span>
                </div>
            </div>
            <div>
                <div class="supplier-detail">
                    <label>Postal Code:</label>
                    <span>${supplier.postalCode}</span>
                </div>
                <div class="supplier-detail">
                    <label>Contact:</label>
                    <span>${supplier.contactNumber}</span>
                </div>
                <div class="supplier-detail">
                    <label>Shipping Method:</label>
                    <span>${supplier.shippingMethod}</span>
                </div>
            </div>
        `;

        supplierDataContainer.appendChild(supplierDiv);
    });
}


async function exportToExcel(supplierName) {
    console.log(supplierName)
    let index = suppliers.findIndex(supplier => supplier.supplierName == supplierName)
    let supplier = suppliers[index]
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('sheet1')

    // Title and date header
    worksheet.mergeCells('A1:E1')
    worksheet.getCell('A1').value = 'Supplier Data Report'
    worksheet.getCell('A1').alignment = { horizontal: 'center' }
    worksheet.getCell('A1').font = { bold: true, size: 20 }

    worksheet.mergeCells('A2:E2')
    worksheet.getCell('A2').value = `Date of Report: ${new Date().toLocaleDateString()}`
    worksheet.getCell('A2').alignment = { horizontal: 'center', wrapText: true }


    // Create headers for QA, Engineering, and Purchasing
    // worksheet.mergeCells('A3:B3')
    // worksheet.getCell('A3').value = 'QA Information'
    // worksheet.getCell('A3').alignment = { horizontal: 'Left' }
    // worksheet.getCell('A3').font = { bold: true, underline: true, size: 18 }

    worksheet.getCell('A4').value = 'Supplier Name'
    worksheet.getCell('A4').font = { bold: true }
    worksheet.getCell('B4').value = supplier.supplierName

    worksheet.getCell('A5').value = 'Address'
    worksheet.getCell('A5').font = { bold: true }
    worksheet.getCell('B5').value = supplier.address

    worksheet.getCell('A6').value = 'City'
    worksheet.getCell('A6').font = { bold: true }
    worksheet.getCell('B6').value = supplier.city

    worksheet.getCell('A7').value = 'Country'
    worksheet.getCell('A7').font = { bold: true }
    worksheet.getCell('B7').value = supplier.country


    worksheet.getCell('A8').value = 'Postal Code'
    worksheet.getCell('A8').font = { bold: true }
    worksheet.getCell('B8').value = supplier.postalCode

    worksheet.getCell('A9').value = 'Contact no.'
    worksheet.getCell('A9').font = { bold: true }
    worksheet.getCell('B9').value = supplier.contactNumber

    worksheet.getCell('A10').value = 'Shipping Method'
    worksheet.getCell('A10').font = { bold: true }
    worksheet.getCell('B10').value = supplier.shippingMethod


    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `${supplier.supplierName}.xlsx`);
}

async function exportAllSuppliersToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('All Suppliers');

    // Title and date header
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = 'All Suppliers Data Report';
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { bold: true, size: 20 };

    worksheet.mergeCells('A2:E2');
    worksheet.getCell('A2').value = `Date of Report: ${new Date().toLocaleDateString()}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    // Header row
    const headers = [
        'Supplier Name', 'Address', 'City', 'Country',
        'Postal Code', 'Contact', 'Shipping Method'
    ];
    worksheet.addRow(headers).font = { bold: true };

    // Add supplier data with spacing
    suppliers.forEach((supplier, index) => {
        worksheet.addRow([
            supplier.supplierName,
            supplier.address,
            supplier.city,
            supplier.country,
            supplier.postalCode,
            supplier.contactNumber,
            supplier.shippingMethod,
        ]);

        // Add two empty rows between suppliers
        if (index < suppliers.length - 1) {
            worksheet.addRow([]);
            worksheet.addRow([]);
        }
    });

    // Adjust column widths
    worksheet.columns = [
        { width: 20 }, // Supplier Name
        { width: 30 }, // Address
        { width: 15 }, // City
        { width: 15 }, // Country
        { width: 12 }, // Postal Code
        { width: 20 }, // Contact
        { width: 20 }, // Shipping Method
    ];

    // Save the workbook
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `All-Suppliers-Data-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// Initialize tab buttons
btnsupplier.addEventListener('click', () => {
    showTab('supplier')
})

btnemployee.addEventListener('click', () => {
    showTab('employee')

})


function showTab(tab) {
    // Hide all panels
    panels.forEach(panel => panel.classList.remove('active'))

    // Deactivate all buttons
    btnsupplier.classList.remove('active')
    btnemployee.classList.remove('active')

    // Activate the selected tab
    if (tab === 'supplier') {
        document.getElementById('supplier-container').classList.add('active')
        btnsupplier.classList.add('active') // Activate recent button
    } else if (tab === 'employee') {
        document.getElementById('employee-container').classList.add('active')
        btnemployee.classList.add('active') // Activate pinned button
    }
}