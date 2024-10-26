var breadcrumb = document.getElementById("brdcrb");

// Helper function to get the current page name
function getCurrentPageName() {
    var path = window.location.pathname;
    var pageName = path.substring(path.lastIndexOf('/') + 1).split('.')[0];
    return pageName;
}

// Function to convert the page name for display
function formatPageName(pageName) {
    return pageName.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

// Function to update and save the breadcrumb trail
function updateBreadcrumb() {
    var currentPage = getCurrentPageName();
    var displayPage = formatPageName(currentPage); // Display-friendly version
    var breadcrumbTrail = JSON.parse(sessionStorage.getItem("breadcrumbTrail")) || [];

    // Check if the display version is already in the breadcrumb trail
    var pageIndex = breadcrumbTrail.findIndex(item => item.page === currentPage);
    if (pageIndex !== -1) {
        // If found, keep up to this page and discard the rest
        breadcrumbTrail = breadcrumbTrail.slice(0, pageIndex + 1);
    } else {
        // Add both actual and display names to the breadcrumb trail
        breadcrumbTrail.push({ page: currentPage, display: displayPage });
    }

    // Update session storage with the modified breadcrumb trail
    sessionStorage.setItem("breadcrumbTrail", JSON.stringify(breadcrumbTrail));
    renderBreadcrumb();
}

// Function to render the breadcrumb based on sessionStorage data
function renderBreadcrumb() {
    var breadcrumbTrail = JSON.parse(sessionStorage.getItem("breadcrumbTrail")) || [];
    
    // Clear existing breadcrumb items
    breadcrumb.innerHTML = '';

    // Loop through breadcrumbTrail and create li elements
    breadcrumbTrail.forEach((item, index) => {
        var li = document.createElement("li");
        li.setAttribute("class", "breadcrumb-item");

        // If it's the last item, make it active without a link
        if (index === breadcrumbTrail.length - 1) {
            li.classList.add("active");
            li.setAttribute("aria-current", "page");
            li.innerText = item.display;
        } else {
            // Add link for previous breadcrumb items
            li.innerHTML = `<a href="${item.page}.html">${item.display}</a>`;
            li.addEventListener("click", function() {
                breadcrumbTrail = breadcrumbTrail.slice(0, index + 1);
                sessionStorage.setItem("breadcrumbTrail", JSON.stringify(breadcrumbTrail));
                renderBreadcrumb();
            });
        }

        breadcrumb.appendChild(li);
    });
}

// Initialize breadcrumb on page load
updateBreadcrumb();
