document.addEventListener('DOMContentLoaded', function() { // Run after the DOM is fully loaded
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
  
    if (hamburger && navMenu) { // Check if elements exist
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
      });
    } else {
      console.error("Hamburger menu elements not found!");
    }
  });