// const user = JSON.parse(sessionStorage.getItem("currentUser"));

const addEmp = document.getElementById("add");
const empID = document.getElementById("empId");
const email = document.getElementById("email");
const fName = document.getElementById("firstName");
const lName = document.getElementById("lastName");
const dob = document.getElementById("dob");
const pass = document.getElementById("password");
const dept = document.getElementById("department");
document.getElementById("clear").addEventListener("click", function () {
    document.querySelector("form").reset();
});

function showPopup(title, message, icon, callback) {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.querySelector('h2').innerText = title; // Set the title
    modalContent.querySelector('p').innerText = message; // Set the message

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
addEmp.addEventListener("click", (e) => {
    e.preventDefault();

    // Get the current value of empID inside the event listener

    if (empID.value == "" || email.value == "" || fName.value == "" || lName.value == "" || dob.value == "" || pass.value =="" || dept.value == ""  ) {
        showPopup('Required field missing','All the fields are required and can not be empty', 'images/1382678.webp');
    } else if (empID.value.length > 4) {
        showPopup('Required field missing','Employee ID cannot be greater than 4 digits', 'images/1382678.webp');
    }else if (empID.value.length < 4) {
        showPopup('Required field missing','Employee ID cannot be less than 4', 'images/1382678.webp');
    }
    else if(email.value == ""){
        showPopup('Required field missing','Email cannot be empty','images/1382678.webp');
    }else if(!email.value.includes("@crossfire.ca" )){
        showPopup('Required field missing','Email is not valid','images/1382678.webp');
    }
});



function openTools() {
    document.querySelector(".tools-container").classList.toggle("show-tools");

}