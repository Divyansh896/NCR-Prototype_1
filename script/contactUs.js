// btn-contact
const footer = document.getElementById('footer-scroll') 
footer.addEventListener('click', ()=>{
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Adds a smooth scroll effect
    })
})

const starElements = document.querySelectorAll('.required');
starElements.forEach(star => {
    star.style.display = 'none'; // Hide each star element
});

function showRequiredFields() {
    let isValid = true;
    const requiredFields = ['name', 'email', 'message'];

    requiredFields.forEach(field => {
        const inputElement = document.getElementById(field);
        const labelElement = document.querySelector(`label[for="${field}"]`);
        const starElement = labelElement.querySelector('.required');

        // Check if the input is empty
        if (inputElement.value.trim() === '') {
            starElement.style.display = 'inline'; // Show star if empty
            isValid = false;
        } else if (field === 'email' && !inputElement.value.includes('@')) {
            starElement.style.display = 'inline'; // Show star if '@' is missing in email
            isValid = false;
            alert("enter correct e-mail address.")
        } else {
            starElement.style.display = 'none'; // Hide star if valid
        }
    });

    return isValid; // Return the final validation result
}

// Submit button event listener
document.getElementById('send-msg').addEventListener('click', (e) => {
    if (!showRequiredFields()) {
        e.preventDefault(); // Prevent form submission if invalid
        alert("Please fill in the required fields before submitting.")
    }else{

        alert("Mail sent to the company head.")
    }
});
