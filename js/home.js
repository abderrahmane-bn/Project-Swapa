// Update your document.addEventListener("DOMContentLoaded") function to include GSAP animations
document.addEventListener("DOMContentLoaded", function () {
  // Get all dropdown containers
  const containers = document.querySelectorAll(".container");

  // Add click listeners to all containers
  containers.forEach((container) => {
    const icon = container.querySelector(".icon");
    const list = container.querySelector(".list");

    if (icon && list) {
      // Set initial state for GSAP animations
      gsap.set(list, { 
        opacity: 0,
        y: -20,
        scale: 0.95,
        transformOrigin: "top right"
      });

      icon.addEventListener("click", function (e) {
        e.stopPropagation();

        // Close all other open dropdowns
        containers.forEach((otherContainer) => {
          if (otherContainer !== container && otherContainer.classList.contains("active")) {
            // Animate closing of other dropdowns
            const otherList = otherContainer.querySelector(".list");
            gsap.to(otherList, {
              opacity: 0,
              y: -20,
              scale: 0.95,
              duration: 0.25,
              ease: "power2.out",
              onComplete: () => {
                otherContainer.classList.remove("active");
              }
            });
          }
        });

        // Toggle current dropdown with animation
        if (!container.classList.contains("active")) {
          // Opening animation
          container.classList.add("active");
          gsap.to(list, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.2)"
          });
        } else {
          // Closing animation
          gsap.to(list, {
            opacity: 0,
            y: -20,
            scale: 0.95,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
              container.classList.remove("active");
            }
          });
        }
      });
    }
  });

  // Close dropdowns when clicking outside with animation
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".container")) {
      containers.forEach((container) => {
        if (container.classList.contains("active")) {
          const list = container.querySelector(".list");
          gsap.to(list, {
            opacity: 0,
            y: -20,
            scale: 0.95,
            duration: 0.25,
            ease: "power2.in",
            onComplete: () => {
              container.classList.remove("active");
            }
          });
        }
      });
    }
  });

  // Notification functionality
  const markAllReadBtn = document.querySelector(".mark-all-read");
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", function (e) {
      e.stopPropagation();

      // Remove unread class and notification dots with animation
      const unreadItems = document.querySelectorAll(".unread");
      unreadItems.forEach((item, index) => {
        const dot = item.querySelector(".notification-dot");
        if (dot) {
          // Animate the dot disappearing
          gsap.to(dot, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            delay: index * 0.05,
            ease: "power2.in",
            onComplete: () => {
              dot.style.display = "none";
              item.classList.remove("unread");
            }
          });
        } else {
          item.classList.remove("unread");
        }
      });

      // Update badge with animation
      const badge = document.querySelector(".notification-icon .badge");
      if (badge) {
        gsap.to(badge, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            badge.style.display = "none";
          }
        });
      }
    });
  }

  // Search suggestions animation
  const searchInput = document.querySelector('input[type="search"]');
  const suggestionTags = document.querySelectorAll(".suggestion-tag");

  if (searchInput && suggestionTags.length) {
    suggestionTags.forEach((tag, index) => {
      tag.addEventListener("click", function () {
        // Add a small bounce animation when clicking a tag
        gsap.to(tag, {
          scale: 1.1,
          duration: 0.2,
          ease: "power1.out",
          onComplete: () => {
            gsap.to(tag, {
              scale: 1,
              duration: 0.2,
              ease: "power1.in"
            });
            searchInput.value = tag.textContent;
            searchInput.focus();
          }
        });
      });

      // Add hover animations
      tag.addEventListener("mouseenter", () => {
        gsap.to(tag, {
          y: -3,
          duration: 0.2,
          ease: "power1.out"
        });
      });

      tag.addEventListener("mouseleave", () => {
        gsap.to(tag, {
          y: 0,
          duration: 0.2,
          ease: "power1.in"
        });
      });
    });
  }

  // Settings modal animations
  const modal = document.getElementById("modal");
  const settingBtn = document.getElementById("settingbtn");
  const closeBtn = document.getElementById("closeSettingsBtn");
  
  if (settingBtn && modal) {
    const settingsSidebar = modal.querySelector(".settings-sidebar");
    
    // Set initial state
    gsap.set(settingsSidebar, {
      opacity: 0,
      y: 30
    });
    
    // Open modal with animation
    settingBtn.addEventListener("click", function() {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
      
      gsap.to(settingsSidebar, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    });
    
    // Close modal with animation
    function closeModal() {
      gsap.to(settingsSidebar, {
        opacity: 0,
        y: 30,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          modal.classList.remove("active");
          document.body.style.overflow = "auto";
        }
      });
    }
    
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }
    
    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
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

document.addEventListener("DOMContentLoaded", function () {
  // Initialize the timeline
  masterTl = gsap.timeline({
    defaults: {
      duration: 0.7,
      ease: "power3.out",
      opacity: 0,
      stagger: 0.1,
    },
    paused: true, // Initialize as paused
  });

  // Add animations to the timeline
  masterTl
    .from(".logo", {
      y: -50,
      opacity: 0,
      ease: "power2.inOut",
    })
    .from(
      ".nav-right .container",
      {
        y: -50,
        opacity: 0,
        stagger: 0.2,
        ease: "power2.inOut",
      },
      "-=0.3"
    )
    .from(
      ".secondhdr .container",
      {
        opacity: 0,
        x: -50,
        ease: "power2.inOut",
      },
      "-=0.5"
    )
    .from(
      ".secondhdr .wallet-container",
      {
        opacity: 0,
        x: 50,
        ease: "power2.inOut",
      },
      "-=0.3"
    )
    .from(
      ".search-container",
      {
        opacity: 0,
        y: 50,
        ease: "back.out(1.7)",
      },
      "-=0.5"
    )
    .from(
      ".search-suggestions .suggestion-tag",
      {
        opacity: 0,
        y: 50,
        scale: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
      },
      "-=0.4"
    );
});

window.addEventListener("load", () => {
  if (masterTl) {
    masterTl.play();
  }
});

//settings
// Modal JavaScript
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const settingBtn = document.getElementById("settingbtn");
  const closeBtn = document.getElementById("closeSettingsBtn");
  const cancelBtn = document.querySelector(".neutral-button");
  const themeDropdown = document.querySelector(".theme-setting");
  const difficultyDropdown = document.querySelector(".difficulty-setting");

  // Open modal
  settingBtn.addEventListener("click", function () {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling
  });

  // Close modal function
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto"; // Enable scrolling
  }

  // Close modal with button
  closeBtn.addEventListener("click", closeModal);

  // Close modal with Cancel button
  cancelBtn.addEventListener("click", closeModal);

  // Close modal when clicking outside
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Prevent propagation for modal content
  const sidebar = document.querySelector(".settings-sidebar");
  sidebar.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Toggle theme options
  themeDropdown.addEventListener("click", function () {
    themeDropdown.classList.toggle("show-radio-options");

    // Close difficulty dropdown if open
    if (difficultyDropdown.classList.contains("show-radio-options")) {
      difficultyDropdown.classList.remove("show-radio-options");
    }
  });

  // Toggle difficulty options
  difficultyDropdown.addEventListener("click", function () {
    difficultyDropdown.classList.toggle("show-radio-options");

    // Close theme dropdown if open
    if (themeDropdown.classList.contains("show-radio-options")) {
      themeDropdown.classList.remove("show-radio-options");
    }
  });

  // Update theme selection
  const themeOptions = document.querySelectorAll('input[name="theme"]');
  themeOptions.forEach((option) => {
    option.addEventListener("change", function () {
      document.getElementById("themeDropdown").innerHTML =
        this.value.charAt(0).toUpperCase() +
        this.value.slice(1) +
        ' <i class="fa-solid fa-chevron-down"></i>';
    });
  });

  // Update difficulty selection
  const difficultyOptions = document.querySelectorAll(
    'input[name="difficulty"]'
  );
  difficultyOptions.forEach((option) => {
    option.addEventListener("change", function () {
      document.getElementById("difficultyDropdown").innerHTML =
        this.value.charAt(0).toUpperCase() +
        this.value.slice(1) +
        ' <i class="fa-solid fa-chevron-down"></i>';
    });
  });
});
