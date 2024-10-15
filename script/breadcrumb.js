var breadcrumb = document.getElementById("brdcrb");

// Helper function to get the current page name
function getCurrentPageName() {
    var path = window.location.pathname;
    var pageName = path.substring(path.lastIndexOf('/') + 1).split('.')[0];

    
            // General case: replace underscores with spaces and capitalize words
            return pageName.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    
}

// Function to update and save the breadcrumb trail
function updateBreadcrumb() {
    var currentPage = getCurrentPageName();
    var breadcrumbTrail = JSON.parse(sessionStorage.getItem("breadcrumbTrail")) || [];

    // Check if the current page is already in the breadcrumb trail
    var pageIndex = breadcrumbTrail.indexOf(currentPage);
    if (pageIndex !== -1) {
        // If the page is found, keep all elements up to this page and discard the rest
        breadcrumbTrail = breadcrumbTrail.slice(0, pageIndex + 1);
    } else {
        // If the page is not in the breadcrumb, add it to the trail
        breadcrumbTrail.push(currentPage);
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
