

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const signupLinks = document.querySelectorAll('.signup-link, .register-link');
    const loginLinks = document.querySelectorAll('.login-link, .signin-link');
    
    // Animate initial form elements
    animateElements(loginForm);
    
    // Function to animate form elements sequentially
    function animateElements(form) {
        const elements = form.querySelectorAll('.form-element');
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate-element');
            }, 100 * index);
        });
    }
    
    // Function to reset animations
    function resetAnimations(form) {
        const elements = form.querySelectorAll('.form-element');
        elements.forEach(element => {
            element.classList.remove('animate-element');
        });
    }
    
    // Function to switch from login to signup
    function showSignup() {
        // First slide out the login form
        loginForm.classList.add('slide-out-up');
        
        setTimeout(() => {
            // Hide login form
            loginForm.classList.remove('active');
            loginForm.classList.add('inactive');
            
            // Reset animations for signup form elements
            resetAnimations(signupForm);
            
            // Show signup form (slides from top)
            signupForm.classList.remove('inactive');
            signupForm.classList.add('active', 'slide-in-down');
            
            // Animate form elements sequentially
            setTimeout(() => {
                animateElements(signupForm);
            }, 400);
            
            // Remove animation classes after animation completes
            setTimeout(() => {
                loginForm.classList.remove('slide-out-up');
                signupForm.classList.remove('slide-in-down');
            }, 600);
        }, 300);
    }
    
    // Function to switch from signup to login
    function showLogin() {
        // First slide out the signup form
        signupForm.classList.add('slide-out-up');
        
        setTimeout(() => {
            // Hide signup form
            signupForm.classList.remove('active');
            signupForm.classList.add('inactive');
            
            // Reset animations for login form elements
            resetAnimations(loginForm);
            
            // Show login form (slides from top)
            loginForm.classList.remove('inactive');
            loginForm.classList.add('active', 'slide-in-down');
            
            // Animate form elements sequentially
            setTimeout(() => {
                animateElements(loginForm);
            }, 400);
            
            // Remove animation classes after animation completes
            setTimeout(() => {
                signupForm.classList.remove('slide-out-up');
                loginForm.classList.remove('slide-in-down');
            }, 600);
        }, 300);
    }
    
    // Add event listeners to all signup links
    signupLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showSignup();
        });
    });
    
    // Add event listeners to all login links
    loginLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showLogin();
        });
    });
});






  document.addEventListener("DOMContentLoaded", function () {
    const toggleCheckbox = document.getElementById("checkbox"); // Ensure correct ID
    const root = document.documentElement; // Target <html> for CSS variables
  
    // Load saved theme from localStorage or default to light
    const savedTheme = localStorage.getItem("theme") || "light";
    
    // Set initial theme
    root.setAttribute("data-theme", savedTheme);
    
    // Ensure checkbox matches the correct state
    toggleCheckbox.checked = savedTheme === "light"; // This fixes the inversion
  
    // Toggle theme when checkbox is clicked
    toggleCheckbox.addEventListener("change", function () {
        const newTheme = toggleCheckbox.checked ? "light" : "dark"; // Fix inversion
        root.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });
  });






masterTl = gsap.timeline({
    defaults: {
        duration: 0.7,
        ease: "power3.out",
        opacity: 0,
        stagger: 0.1,
    },
});

// First animate the logo and robot
masterTl
.from(".login-image", {
    y: -50,
    opacity: 0,
    ease: "power2.inOut",
})
.from(".robot", {
    y: -50,
    opacity: 0,
    delay: 0.2,
    ease: "power2.inOut",
    onComplete: function() { 
        // Start the floating animation AFTER the loading animation
        gsap.to(".robot", {
            y: 30, // Moves up & down by 30px
            duration: 1.5, // Time for one complete motion
            repeat: -1, // Infinite loop
            yoyo: true,
            ease: "power2.inOut",
        });
    }
});

window.addEventListener("load", () => {
    masterTl.play();
});
