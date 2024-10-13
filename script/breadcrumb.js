var breadcrumb = document.getElementById("brdcrb");

// Helper function to get the current page name
function getCurrentPageName() {
    var path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1).split('.')[0];
}

// Function to update and save the breadcrumb trail
function updateBreadcrumb() {
    var currentPage = getCurrentPageName();
    var breadcrumbTrail = JSON.parse(sessionStorage.getItem("breadcrumbTrail")) || [];
    
    // Check if current page is already in breadcrumb to avoid duplicates
    if (!breadcrumbTrail.includes(currentPage)) {
        breadcrumbTrail.push(currentPage);
        sessionStorage.setItem("breadcrumbTrail", JSON.stringify(breadcrumbTrail));
    }
    
    renderBreadcrumb();
}

// Function to render the breadcrumb based on sessionStorage data
function renderBreadcrumb() {
    var breadcrumbTrail = JSON.parse(sessionStorage.getItem("breadcrumbTrail")) || [];
    
    // Clear existing breadcrumb items
    breadcrumb.innerHTML = '';

    // Loop through breadcrumbTrail and create li elements
    breadcrumbTrail.forEach((page, index) => {
        var li = document.createElement("li");
        li.setAttribute("class", "breadcrumb-item");

        // If it's the last item, make it active without a link
        if (index === breadcrumbTrail.length - 1) {
            li.classList.add("active");
            li.setAttribute("aria-current", "page");
            li.innerText = page;
        } else {
            // Add link for previous breadcrumb items
            li.innerHTML = `<a href="${page}.html">${page}</a>`;
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
