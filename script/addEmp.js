// const user = JSON.parse(sessionStorage.getItem("currentUser"));

const addEmp = document.getElementById("add");
const empID = document.getElementById("empId");
const email = document.getElementById("email");
addEmp.addEventListener("click", (e) => {
    e.preventDefault();

    // Get the current value of empID inside the event listener

    if (empID.value == 0) {
        alert("Employee ID cannot be empty");
    } else if (empID.value.length > 4) {
        alert("Employee ID cannot be greater than 4 digits");
    }else if (empID.value.length < 4) {
        alert("Employee ID cannot be less than 4");
    }

    if(email.value == 0){
        alert("Email cannot be empty");
    }else if(!email.value.includes("@crossfire.ca")){
        alert("Email is not valid");
    }
});



function openTools() {
    document.querySelector(".tools-container").classList.toggle("show-tools");

}