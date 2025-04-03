document.addEventListener('DOMContentLoaded', function() {
    // Get all dropdown containers
    const containers = document.querySelectorAll('.container');
    
    // Add click listeners to all containers
    containers.forEach(container => {
        const icon = container.querySelector('.icon');
        
        if (icon) {
            icon.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Close all other open dropdowns
                containers.forEach(otherContainer => {
                    if (otherContainer !== container) {
                        otherContainer.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                container.classList.toggle('active');
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.container')) {
            containers.forEach(container => {
                container.classList.remove('active');
            });
        }
    });
    
    // Notification functionality
    const markAllReadBtn = document.querySelector('.mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Remove unread class and notification dots
            const unreadItems = document.querySelectorAll('.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
                const dot = item.querySelector('.notification-dot');
                if (dot) {
                    dot.style.display = 'none';
                }
            });
            
            // Update badge
            const badge = document.querySelector('.notification-icon .badge');
            if (badge) {
                badge.style.display = 'none';
            }
        });
    }
    
    // Search suggestions
    const searchInput = document.querySelector('input[type="search"]');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    
    if (searchInput && suggestionTags.length) {
        suggestionTags.forEach(tag => {
            tag.addEventListener('click', function() {
                searchInput.value = tag.textContent;
                searchInput.focus();
            });
        });
    }
    
    // Add animation classes for smoother transitions
    document.querySelectorAll('.list').forEach(list => {
        list.addEventListener('animationend', function() {
            this.classList.add('animation-done');
        });
    });
});





//dark mode button 
document.addEventListener("DOMContentLoaded", function () {
    const toggleCheckbox = document.getElementById("checkbox");
    const root = document.documentElement;
    
    // Load saved theme from localStorage or default to light
    const savedTheme = localStorage.getItem("theme") || "light";
    
    // Set initial theme
    root.setAttribute("data-theme", savedTheme);
    
    // Ensure checkbox matches the current theme (checked for dark, unchecked for light)
    toggleCheckbox.checked = savedTheme === "dark";
    
    // Toggle theme when checkbox is clicked
    toggleCheckbox.addEventListener("change", function () {
        const newTheme = toggleCheckbox.checked ? "dark" : "light";
        root.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });
});



// some loading animations cause why not ?




// Define the timeline globally but don't add animations yet
let masterTl;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the timeline
    masterTl = gsap.timeline({
        defaults: {
            duration: 0.7,
            ease: "power3.out",
            opacity: 0,
            stagger: 0.1,
        },
        paused: true // Initialize as paused
    });

    // Add animations to the timeline
    masterTl
        .from(".logo", {
            y: -50,
            opacity: 0,
            ease: "power2.inOut",
        })
        .from(".nav-right .container", {
            y: -50,
            opacity: 0,
            stagger: 0.2,
            ease: "power2.inOut",
        }, "-=0.3")
        .from(".secondhdr .container", {
            opacity: 0,
            x: -50,
            ease: "power2.inOut",
        }, "-=0.5")
        .from(".secondhdr .wallet-container", {
            opacity: 0,
            x: 50,
            ease: "power2.inOut",
        }, "-=0.3")
        .from(".search-container", {
            opacity: 0,
            y: 50,
            ease: "back.out(1.7)",
        }, "-=0.5")
        .from(".search-suggestions .suggestion-tag", {
            opacity: 0,
            y: 50,
            scale: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
        }, "-=0.4")
});

window.addEventListener("load", () => {
    if (masterTl) {
        masterTl.play();
    }
});
