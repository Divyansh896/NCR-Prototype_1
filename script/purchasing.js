//const userName = document.getElementById('userName')
const modal = document.getElementById("popup")
const span = document.getElementById("closePopup")
const decision = document.getElementById("decision")
const subOptions = document.getElementById("sub-options")

const sections = document.querySelectorAll(".form-section")

// Follow-up functionality
const followUpRadioButtons = document.querySelectorAll('input[name="follow-up"]')
const followUpDetails = document.getElementById("follow-up-details")

let currentStep = 0
function updateStatusBar() {
    const steps = document.querySelectorAll(".status-steps .status-step") // Get all status steps
    steps.forEach((step, index) => {
        // Highlight the current step
        step.classList.toggle("active", index === currentStep)

        // Optionally, you can add a class for completed steps
        step.classList.toggle("completed", index < currentStep)
    })
}
// Add keyboard navigation functionality
document.addEventListener('keydown', function (event) {
    // Check if the focused element is a radio button label
    const focusedElement = document.activeElement

    if (focusedElement && focusedElement.classList.contains('radio-button')) {
        // Check if "Enter" key is pressed
        if (event.key === 'Enter') {
            const radio = focusedElement.querySelector('input[type="radio"]')
            if (radio) {
                // Simulate a click on the radio button
                radio.click()
                toggleRadio(radio)
            }
        }
    }
})

decision.addEventListener("change", () => {
    if (decision.value === "return") {
        subOptions.style.display = "block"
    } else {
        subOptions.style.display = "none"
    }
})

const carRadioButtons = document.querySelectorAll('input[name="car"]')
const carDetails = document.getElementById("car-details")

carRadioButtons.forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.value === "yes") {
            carDetails.style.display = "block"
        } else {
            carDetails.style.display = "none"
        }
    })
})



followUpRadioButtons.forEach(radio => {
    radio.addEventListener("change", () => {
        if (radio.value === "yes") {
            followUpDetails.style.display = "block"
        } else {
            followUpDetails.style.display = "none"
        }
    })
})

function toggleCheck(radio) {
    // Remove 'checked' class from all sibling radio buttons' parent elements
    const radios = document.querySelectorAll(`input[name="${radio.name}"]`)
    radios.forEach(r => r.parentElement.classList.remove('checked'))

    // Add 'checked' class to the selected radio button's parent element
    if (radio.checked) {
        radio.parentElement.classList.add('checked')
    }
}

// Initialize form navigation and submission
sections[currentStep].classList.add("active")
updateStatusBar()

// Add event listeners for navigation buttons
document.getElementById("next-btn1").addEventListener("click", () => {


    sections[currentStep].classList.remove("active")
    currentStep++
    sections[currentStep].classList.add("active")
    updateStatusBar()

})
document.getElementById("next-btn2").addEventListener("click", () => {
    
        sections[currentStep].classList.remove("active")
        currentStep++
        sections[currentStep].classList.add("active")
        updateStatusBar()
        
})
document.getElementById("back-btn1").addEventListener("click", () => {
    sections[currentStep].classList.remove("active")
    currentStep--
    sections[currentStep].classList.add("active")
    updateStatusBar()
})

document.getElementById("back-btn2").addEventListener("click", () => {
    sections[currentStep].classList.remove("active")
    currentStep--
    sections[currentStep].classList.add("active")
    document.getElementById("confirm-media-list").textContent = null
    updateStatusBar()
})