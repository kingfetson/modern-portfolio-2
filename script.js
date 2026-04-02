// Select all navigation links
const navLinks = document.querySelectorAll('.nav-link');

// Select all page content sections
const pages = document.querySelectorAll('.page-content');

// Add click event to every link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Stop the link from actually jumping

        // Remove 'active' class from all links
        navLinks.forEach(nav => nav.classList.remove('active'));
        
        // Add 'active' class to the clicked link
        link.classList.add('active');

        // Get the target page ID from the data attribute
        const targetPageId = link.getAttribute('data-page');

        // Hide all pages
        pages.forEach(page => page.classList.remove('active-page'));

        // Show the target page
        const targetPage = document.getElementById(targetPageId);
        if (targetPage) {
            targetPage.classList.add('active-page');
        }
    });
});
