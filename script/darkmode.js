let currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
let themes = JSON.parse(localStorage.getItem("themes"));  // Retrieve themes from localStorage
let Userthemes = [
    { username: "jsmith", theme: "cold" },
    { username: "dhenry", theme: "cold" },
    { username: "bmiller", theme: "cold" },
    { username: "gwhite", theme: "cold" },
];

// Initialize themes in localStorage if not set
if (!themes) {
    localStorage.setItem('themes', JSON.stringify(Userthemes));
    themes = Userthemes;  // Set themes to default if not found
}

// Function to apply the theme for the current user
function applyUserTheme(themes) {
    const userTheme = themes.find(user => user.username === currentUser.username);
    if (userTheme) {
        if (userTheme.theme === "dark") {
            document.body.classList.add("dark-mode");
            document.body.classList.remove("cold-mode");
        } else if (userTheme.theme === "cold") {
            document.body.classList.add("cold-mode");
            document.body.classList.remove("dark-mode");
        } else {
            document.body.classList.remove("dark-mode", "cold-mode");
        }
    } else {
        console.log("User not found.");
    }
}

// Function to toggle the theme for the current user
document.getElementById('darkModeToggle').addEventListener("click", () => {
    const currentUserTheme = themes.find(u => u.username === currentUser.username);
    if (currentUserTheme) {
        const newTheme = currentUserTheme.theme === "dark" ? "cold" : "dark";
        currentUserTheme.theme = newTheme;  // Update user's theme
        localStorage.setItem("themes", JSON.stringify(themes));  // Save updated themes in localStorage
        applyUserTheme(themes);  // Apply the new theme
    }
});

// Initialize the theme when the page loads
if (currentUser) {
    applyUserTheme(themes);  // Apply the stored theme on page load
} else {
    console.log("No user is logged in.");
}
