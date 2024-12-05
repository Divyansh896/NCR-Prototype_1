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
const btnExportSupplier = document.getElementById('export-supplier');
const btnEditSupplier = document.getElementById('edit-supplier');
const panels = document.querySelectorAll('.tab-panel');
const btnsupplier = document.getElementById('btn-supplier');
const btnemployee = document.getElementById('btn-employee');
const employeeSelect = document.getElementById("employee-select");
const employeeInfo = document.getElementById("employee-info");
const employeeDetails = document.getElementById("employee-details-container");
const employeeFirstName = document.getElementById("employee-firstname");
const employeeLastName = document.getElementById("employee-lastname");
const employeeUsername = document.getElementById("employee-username");
const employeeDepartment = document.getElementById("employee-department");
const employeeRole = document.getElementById("employee-role");
const employeeEmail = document.getElementById("employee-email");
const employeePhone = document.getElementById("employee-phone");
const employeeDob = document.getElementById("employee-dob");
const employeeGender = document.getElementById("employee-gender");
const btnEditEmployee = document.getElementById('edit-employee');

const employeeDataContainer = document.getElementById("employee-data-container");
const btnExportEmp = document.getElementById('export-employee');
const btnEmployee = document.getElementById('btn-employee');
const btnSupplier = document.getElementById('btn-supplier');
const modal = document.getElementById("popup")
const span = document.getElementById("closePopup")

let suppliers = JSON.parse(localStorage.getItem('suppliers'));
let employees = JSON.parse(localStorage.getItem('employees'));
const user = JSON.parse(sessionStorage.getItem("currentUser"))
const clearNotification = document.getElementById("btnClearNotification")
const btnBackToTop = document.getElementById('btnBackToTop')
const footer = document.getElementById('footer-scroll')


const userName = document.getElementById('userName')
userName.innerHTML = `${user.firstname}  ${user.lastname}`

btnExportSupplier.addEventListener('click', () => {
    if (supplierSelect.value == 'All') {
        exportAllSuppliersToExcel();
    } else {
        exportToExcelSupplier(supplierSelect.value);
    }
});
btnExportEmp.addEventListener('click', () => {
    if (employeeSelect.value === 'All') {
        exportAllEmployeesToExcel();
    } else {
        exportToExcelEmployee(employeeSelect.value);
    }
});


//hide the employees list from everyone who is not an admin
if (user.role !== 'Admin'){
    document.getElementById("btn-employee").style.display = "none"
}

// Populate the dropdown on page load
populateSuppliers();
populateEmployees()
populateAllSuppliers()
populateAllEmployees()
setNotificationText()
// Initially, hide supplier details and show supplier list
supplierDetails.style.display = 'none';
supplierDataContainer.style.display = 'block';
// Initially, hide employee details and show employee list
employeeDetails.style.display = 'none';
employeeDataContainer.style.display = 'block';

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
function populateEmployees() {
    employeeSelect.innerHTML = ""; // Clear all options

    // Default "All Employees" option
    const option = document.createElement("option");
    option.value = "All";
    option.textContent = "All Employees";
    employeeSelect.appendChild(option);

    // Add options for each employee
    employees.forEach(employee => {
        const option = document.createElement("option");
        option.value = employee.username; // Using username as a unique identifier
        option.textContent = `${employee.firstname} ${employee.lastname}`; // Displaying full name
        employeeSelect.appendChild(option);
    });

    employeeSelect.value = 'All'; // Set "All" as the default selection
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

employeeSelect.addEventListener('change', () => {
    if (employeeSelect.value === "All") {
        employeeDetails.style.display = 'none';
        employeeDataContainer.style.display = 'block';
        populateAllEmployees(); // Populate all employees list
    } else {
        employeeDetails.style.display = 'block';
        employeeDataContainer.style.display = 'none';
        populateEmployeeDetails(); // Populate selected employee details
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
function populateEmployeeDetails() {
    let selectedEmployee = employeeSelect.value;
    let employee = employees.find(employee => employee.username === selectedEmployee);

    if (employee) {
        employeeFirstName.textContent = employee.firstname;
        employeeLastName.textContent = employee.lastname;
        employeeUsername.textContent = employee.username;
        employeeDepartment.textContent = employee.department;
        employeeRole.textContent = employee.role;
        employeeEmail.textContent = employee.emailID;
        employeePhone.textContent = employee.phone;
        employeeDob.textContent = employee.dob;
        employeeGender.textContent = employee.gender;
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
                <div>
                    <button id="edit-supplier" class="edit-supplier-btn">Edit</button>
                </div>
            </div>
        `;
        const editButton = supplierDiv.querySelector(`#edit-supplier`);
        editButton.addEventListener('click', () => {
            // Redirect to the Edit Supplier page with the supplier name in the URL
            EditSupplier(supplier.supplierName)
        });
        supplierDataContainer.appendChild(supplierDiv);
    });
}

function populateAllEmployees() {
    employeeDataContainer.innerHTML = ""; // Clear existing employee data

    // Add the export button once
    const exportButtonDiv = document.createElement("div");
    exportButtonDiv.classList.add("employee-actions");
    exportButtonDiv.innerHTML = `<button id="export-employee" onclick='exportAllEmployeesToExcel()'>Export</button>`;
    exportButtonDiv.style.marginRight = '30px'
    employeeDataContainer.appendChild(exportButtonDiv);

    // Loop through all employees and create the employee divs
    employees.forEach(employee => {
        const employeeDiv = document.createElement("div");
        employeeDiv.classList.add("employee-two-cols", "drop-shadow");

        employeeDiv.innerHTML = `
            <div>
                <div class="employee-detail">
                    <label>First Name:</label>
                    <span>${employee.firstname}</span>
                </div>
                <div class="employee-detail">
                    <label>Last Name:</label>
                    <span>${employee.lastname}</span>
                </div>
                <div class="employee-detail">
                    <label>Username:</label>
                    <span>${employee.username}</span>
                </div>
                <div class="employee-detail">
                    <label>Department:</label>
                    <span>${employee.department}</span>
                </div>
                <div class="employee-detail">
                    <label>Role:</label>
                    <span>${employee.role}</span>
                </div>
            </div>
            <div>
                <div class="employee-detail">
                    <label>Email ID:</label>
                    <span>${employee.emailID}</span>
                </div>
                <div class="employee-detail">
                    <label>Phone:</label>
                    <span>${employee.phone}</span>
                </div>
                <div class="employee-detail">
                    <label>Date of Birth:</label>
                    <span>${employee.dob}</span>
                </div>
                <div class="employee-detail">
                    <label>Gender:</label>
                    <span>${employee.gender}</span>
                </div>
            <div>
            <button id="edit-employee" class="edit-supplier-btn">Edit</button>
        `;
        const editButton = employeeDiv.querySelector(`#edit-employee`);
        editButton.addEventListener('click', () => {
            // Redirect to the Edit Supplier page with the supplier name in the URL
            EditEmployee(employee.username)
        });

        employeeDataContainer.appendChild(employeeDiv);
    });
}

async function exportToExcelSupplier(supplierName) {
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
async function exportToExcelEmployee(employeeUsername) {
    console.log(employeeUsername);
    let index = employees.findIndex(employee => employee.username == employeeUsername);
    let employee = employees[index];
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('sheet1');

    // Title and date header
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = 'Employee Data Report';
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { bold: true, size: 20 };

    worksheet.mergeCells('A2:E2');
    worksheet.getCell('A2').value = `Date of Report: ${new Date().toLocaleDateString()}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center', wrapText: true };

    // Employee details
    worksheet.getCell('A4').value = 'First Name';
    worksheet.getCell('A4').font = { bold: true };
    worksheet.getCell('B4').value = employee.firstname;

    worksheet.getCell('A5').value = 'Last Name';
    worksheet.getCell('A5').font = { bold: true };
    worksheet.getCell('B5').value = employee.lastname;

    worksheet.getCell('A6').value = 'Username';
    worksheet.getCell('A6').font = { bold: true };
    worksheet.getCell('B6').value = employee.username;

    worksheet.getCell('A7').value = 'Employee ID';
    worksheet.getCell('A7').font = { bold: true };
    worksheet.getCell('B7').value = employee.employeeID;

    worksheet.getCell('A8').value = 'Department';
    worksheet.getCell('A8').font = { bold: true };
    worksheet.getCell('B8').value = employee.department;

    worksheet.getCell('A9').value = 'Role';
    worksheet.getCell('A9').font = { bold: true };
    worksheet.getCell('B9').value = employee.role;

    worksheet.getCell('A10').value = 'Email ID';
    worksheet.getCell('A10').font = { bold: true };
    worksheet.getCell('B10').value = employee.emailID;

    worksheet.getCell('A11').value = 'Phone';
    worksheet.getCell('A11').font = { bold: true };
    worksheet.getCell('B11').value = employee.phone;

    worksheet.getCell('A12').value = 'Date of Birth';
    worksheet.getCell('A12').font = { bold: true };
    worksheet.getCell('B12').value = employee.dob;

    worksheet.getCell('A13').value = 'Gender';
    worksheet.getCell('A13').font = { bold: true };
    worksheet.getCell('B13').value = employee.gender;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `${employee.firstname} ${employee.lastname}.xlsx`);
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
async function exportAllEmployeesToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('All Employees');

    // Title and date header
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = 'All Employees Data Report';
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { bold: true, size: 20 };

    worksheet.mergeCells('A2:E2');
    worksheet.getCell('A2').value = `Date of Report: ${new Date().toLocaleDateString()}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    // Header row
    const headers = [
        'First Name', 'Last Name', 'Username', 'Employee ID',
        'Department', 'Role', 'Email ID', 'Phone', 'Date of Birth', 'Gender'
    ];
    worksheet.addRow(headers).font = { bold: true };

    // Add employee data with spacing
    employees.forEach((employee, index) => {
        worksheet.addRow([
            employee.firstname,
            employee.lastname,
            employee.username,
            employee.employeeID,
            employee.department,
            employee.role,
            employee.emailID,
            employee.phone,
            employee.dob,
            employee.gender
        ]);

        // Add two empty rows between employees
        if (index < employees.length - 1) {
            worksheet.addRow([]);
            worksheet.addRow([]);
        }
    });

    // Adjust column widths
    worksheet.columns = [
        { width: 20 }, // First Name
        { width: 20 }, // Last Name
        { width: 20 }, // Username
        { width: 15 }, // Employee ID
        { width: 15 }, // Department
        { width: 15 }, // Role
        { width: 30 }, // Email ID
        { width: 20 }, // Phone
        { width: 15 }, // Date of Birth
        { width: 15 }  // Gender
    ];

    // Save the workbook
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `All-Employees-Data-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// Initialize tab buttons
btnsupplier.addEventListener('click', () => {
    showTab('supplier')
})

btnemployee.addEventListener('click', () => {
    showTab('employee')

})

// Button event to edit the selected supplier
btnEditSupplier.addEventListener('click', ()=>{
    EditSupplier(supplierName.textContent)
})

function EditSupplier(name){
    window.location.href=`Add_supplier.html?SupplierName=${name}`
}

btnEditEmployee.addEventListener('click', ()=>{
    EditEmployee(employeeUsername.textContent)
})

function EditEmployee(name){
    window.location.href=`add_employee.html?EmployeeuserName=${name}`
}

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
function openTools() {
    document.querySelector(".tools-container").classList.toggle("show-tools")

}

function logout() {
    localStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('breadcrumbTrail')
    location.replace('index.html')
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