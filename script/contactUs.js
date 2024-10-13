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
    let isvalid = true;
    const requiredFields = [
        'name', 'email', 'message']

    
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
document.getElementById('send-msg').addEventListener('click', (e) => {
    if (!showRequiredFields()) {
        e.preventDefault(); // Prevent form submission if invalid
    }
});
