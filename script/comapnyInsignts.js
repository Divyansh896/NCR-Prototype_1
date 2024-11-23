const supplierSelect = document.getElementById("supplier-select");
const supplierInfo = document.getElementById("supplier-info");
const supplierDetails = document.getElementById("supplier-details");
const supplierName = document.getElementById("supplier-name");
const supplierAddress = document.getElementById("supplier-address");
const supplierCity = document.getElementById("supplier-city");
const supplierCountry = document.getElementById("supplier-country");
const supplierPostalCode = document.getElementById("supplier-postalCode");
const supplierContact = document.getElementById("supplier-contact");
const supplierShippingMethod = document.getElementById("supplier-shippingMethod");
const supplierDataContainer = document.getElementById("supplier-data-container");
let suppliers = JSON.parse(localStorage.getItem('suppliers'))

populateSuppliers()

function populateSuppliers() {

    // Clear all existing dynamically added options
    supplierSelect.innerHTML = ""; // Clear all options
    const option = document.createElement("option");
    option.value = "All";
    option.textContent = "All Suppliers";   
    supplierSelect.appendChild(option)
    suppliers.forEach(optionText => {
        const option = document.createElement("option");
        option.value = optionText;
        option.textContent = optionText;
        supplierSelect.appendChild(option); // Insert before "Add a Supplier"
    })
}

supplierSelect.addEventListener('change', ()=>{
    if(supplierSelect.value == "All"){
        supplierDetails.style.display = 'none'
        supplierDataContainer.style.display = 'block'
        // add a function to add supplier data dynamically
    }
    else{
        supplierDetails.style.display = 'block'
        supplierDataContainer.style.display = 'none'
        // add function to add only one supplier data dynamically
    }
})