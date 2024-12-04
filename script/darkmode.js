// Select the dark mode toggle button
const darkModeToggle = document.getElementById("darkModeToggle");

// Check for saved user preference
const userPrefersDark = window.localStorage.getItem("darkMode") === "enabled";

// Enable dark mode if the user had previously set it
if (userPrefersDark) {
    document.body.classList.add("dark-mode");
    darkModeToggle.innerHTML = '<span class="icon-text">Light Mode</span><i class="fa fa-sun-o"></i>';
}

// Toggle dark mode on click
darkModeToggle.addEventListener("click", () => {
    const isDarkMode = document.body.classList.toggle("dark-mode");

    // Update button text/icon
    darkModeToggle.innerHTML = isDarkMode
        ? '<span class="icon-text">Light Mode</span><i class="fa fa-sun-o"></i>'
        : '<span class="icon-text">Dark Mode</span><i class="fa fa-moon-o"></i>';

    // Save user preference
    window.localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
});
