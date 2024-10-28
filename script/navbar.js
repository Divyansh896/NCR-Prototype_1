document.addEventListener("DOMContentLoaded", function() {
    user =JSON.parse(sessionStorage.getItem("currentUser"));
        // or "lead engineer", "standard engineer"
    

    // Update the Create NCR link based on user role
    function updateNCRLink() {
        
        var ncrLink = document.querySelector('a[aria-label="Create a new Non-Conformance Report"]');

        if (user.role === "Lead Engineer" || user.role === "Purchasing") {
            // Change to "Logged NCR" for lead engineers and purchasing roles
            ncrLink.href = "logged_NCR.html";
            ncrLink.innerHTML = '<i class="fa fa-sign-in"></i>Logged NCR';
            ncrLink.setAttribute("aria-label", "View logged Non-Conformance Reports");
        }
    }

    // Run the update on page load
    updateNCRLink();
});
