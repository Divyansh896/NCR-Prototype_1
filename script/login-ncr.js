// login.js
function onLoginSuccess() {
    localStorage.setItem('isLoggedIn', 'true'); // Set the logged-in state
}
// Event listeners and functions for login page
document.getElementById("btn-login").addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Fetch user data from local JSON
    fetch('Data/user.json')
        .then(response => response.json())
        .then(users => {
            const user = users.find(user => user.username === username && user.password === password);
            if (user) {
                sessionStorage.setItem("currentUser", JSON.stringify(user)); // Store user data
                // After successful login
                onLoginSuccess()
                window.location.href = "home.html"; // Redirect to home page
            } else {
                alert("Invalid credentials");
            }
        });
});
