document.addEventListener("DOMContentLoaded", () => {
    const infoIcons = document.querySelectorAll(".info-icon");
  
    infoIcons.forEach(icon => {
      icon.addEventListener("click", () => {
        const description = icon.parentElement.nextElementSibling;
        const text = icon.dataset.description;
  
        // Toggle the description visibility and set text
        if (description.style.display === "none" || !description.style.display) {
          description.style.display = "block";
          description.textContent = text;
        } else {
          description.style.display = "none";
        }
      });
    });
  });