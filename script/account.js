document.addEventListener('DOMContentLoaded', () => {
    const starElements = document.querySelectorAll('.required');
    const user = JSON.parse(sessionStorage.getItem("currentUser"));

    
    starElements.forEach(star => {
        star.style.display = 'none'; // Hide each star element
    });

    populateUserData(user)

});
const footer = document.getElementById('footer-scroll') 
footer.addEventListener('click', ()=>{
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})
// Function to populate input fields with user data
function populateUserData(data) {
    document.getElementById('fname').value = data.firstname || '';
    document.getElementById('lname').value = data.lastname || '';
    document.getElementById('Uname').value = data.username || '';
    document.getElementById('employeeId').value = data.employeeID || '';
    document.getElementById('emailId').value = data.emailID || '';
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('bday').value = data.dob || '';
    document.getElementById('password').value = data.password || '';
    const genderSelect = document.getElementById('gender');
    genderSelect.value = data.gender; // Set the selected value
    console.log(data.gender)
    
}

// Function to update required fields dynamically
function showRequiredFields() {
    let isvalid = true;
    const requiredFields = [
        'fname', 'lname', 'Uname', 'UserId',
        'emailId', 'phone', 'bday', 'gender'
    ];

    
    requiredFields.forEach(field => {
        const inputElement = document.getElementById(field);
        const labelElement = document.querySelector(`label[for="${field}"]`);
        const starElement = labelElement.querySelector('.required');

        // Check if the input is empty
        if (inputElement.value.trim() === '') {
            starElement.style.display = 'inline'; // Show star if empty
            isvalid = false;
        } else {
            starElement.style.display = 'none'; // Hide star if filled
        }
    });

    return isvalid; // Return the final validation result
}

// Submit button event listener
document.getElementById('submit-btn').addEventListener('click', (e) => {
    if (!showRequiredFields()) {
        e.preventDefault(); // Prevent form submission if invalid
    }
});
