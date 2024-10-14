// script.js
document.addEventListener('DOMContentLoaded', () => {
    const ncrToggle = document.getElementById('ncr-toggle');
    const dropdown = ncrToggle.nextElementSibling; // Get the dropdown
    dropdown.style.display = 'none';
    // Show/hide dropdown on header click
    ncrToggle.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        const isExpanded = ncrToggle.getAttribute('aria-expanded') === 'true';
        
        // Toggle dropdown display
        dropdown.style.display = isExpanded ? 'none' : 'block';
        ncrToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!ncrToggle.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
            ncrToggle.setAttribute('aria-expanded', 'false');
        }
    });
});
