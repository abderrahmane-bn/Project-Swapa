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
        transformOrigin: "top right",
      });

      icon.addEventListener("click", function (e) {
        e.stopPropagation();

        // Close all other open dropdowns
        containers.forEach((otherContainer) => {
          if (
            otherContainer !== container &&
            otherContainer.classList.contains("active")
          ) {
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
              },
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
            ease: "back.out(1.2)",
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
            },
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
            },
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
            },
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
          },
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
              ease: "power1.in",
            });
            searchInput.value = tag.textContent;
            searchInput.focus();
          },
        });
      });

      // Add hover animations
      tag.addEventListener("mouseenter", () => {
        gsap.to(tag, {
          y: -3,
          duration: 0.2,
          ease: "power1.out",
        });
      });

      tag.addEventListener("mouseleave", () => {
        gsap.to(tag, {
          y: 0,
          duration: 0.2,
          ease: "power1.in",
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
      y: 30,
    });

    // Open modal with animation
    settingBtn.addEventListener("click", function () {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";

      gsap.to(settingsSidebar, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
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
        },
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", function (e) {
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

// Search functionality
document.addEventListener("DOMContentLoaded", function () {
  // Search functionality
  const searchContainer = document.querySelector(".search-container");
  const searchInput = document.querySelector('input[type="search"]');
  const searchSuggestions = document.querySelector(".search-suggestions");
  const head2 = document.querySelector(".secondhdr");
  const suggestions = document.querySelectorAll(".suggestion-tag");
  const mainContent = document.querySelector("main");
  const rightelement = document.querySelectorAll(".right-ele");
  const leftelement = document.querySelectorAll(".left-ele");

  // Create a container for search results with proper positioning
  const searchResultsContainer = document.createElement("div");
  searchResultsContainer.className = "search-results";
  searchResultsContainer.style.display = "none";
  mainContent.appendChild(searchResultsContainer);

  // Create a back button for returning to home
  const backButton = document.createElement("button");
  backButton.className = "back-button";
  backButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i> <span class="back-text">Back</span>';
  backButton.style.display = "none";
  document.body.appendChild(backButton);

  // Sample profile data
  const profileData = [
    {
      name: "Python Expert",
      skills: ["Python", "Django", "Flask", "Machine Learning"],
      experience: "5 years",
      rating: 4.8,
      image: "icons/profile.png",
      tags: ["python", "machine learning", "web development", "data science"],
    },
    {
      name: "JavaScript Developer",
      skills: ["JavaScript", "React", "Node.js", "Vue"],
      experience: "4 years",
      rating: 4.7,
      image: "icons/profile.png",
      tags: ["javascript", "web development", "react", "node.js"],
    },
    {
      name: "Data Scientist",
      skills: ["Python", "R", "TensorFlow", "Data Visualization"],
      experience: "6 years",
      rating: 4.9,
      image: "icons/profile.png",
      tags: ["python", "machine learning", "data science", "r"],
    },
    {
      name: "Web Developer",
      skills: ["HTML", "CSS", "JavaScript", "PHP"],
      experience: "3 years",
      rating: 4.5,
      image: "icons/profile.png",
      tags: ["web development", "javascript", "php", "html", "css"],
    },
  ];

  // Variable to store original search container position
  let originalSearchPosition = {};
  let originalSearchStyles = {};
  
  // Add a flag to track if search animation has already played
  let searchAnimationPlayed = false;
  
  // Add a variable to track animation duration
  const animationDuration = 0.7; // in seconds

  // Function to perform search animation
  function performSearchAnimation(callback) {
    // If animation has already played, skip it and call callback immediately
    if (searchAnimationPlayed) {
      if (callback) callback();
      return;
    }
    
    // Get current position and dimensions of search container
    const searchContainerRect = searchContainer.getBoundingClientRect();
    const isMobile = window.innerWidth <= 768;
  
    // Store original position and styles for later use
    originalSearchPosition = {
      top: searchContainerRect.top,
      left: searchContainerRect.left,
      width: searchContainerRect.width
    };
  
    // Store original styles
    originalSearchStyles = {
      position: searchContainer.style.position,
      top: searchContainer.style.top,
      left: searchContainer.style.left,
      width: searchContainer.style.width,
      transform: searchContainer.style.transform
    };
  
    // Fix search container position to current location before animating
    searchContainer.style.position = "fixed";
    searchContainer.style.top = originalSearchPosition.top + "px";
    searchContainer.style.left = originalSearchPosition.left + "px";
    searchContainer.style.width = originalSearchPosition.width + "px";
    searchContainer.style.zIndex = "1000";
  
    // Critical: Ensure any existing transforms are cleared
    searchContainer.style.transform = "none";
  
    // Create a timeline for search animation
    const tl = gsap.timeline({
      onComplete: function() {
        // Call the callback function when animation completes
        if (callback) callback();
        
        // Set flag to indicate animation has played
        searchAnimationPlayed = true;
      }
    });
  
    // Add animations to the timeline
    tl.to(rightelement, {
      x: 100,
      opacity: 0,
      ease: "power2.inOut",
      duration: 0.5,
      stagger: 0.2
    })
    .to(leftelement, {
      x: -100,
      opacity: 0,
      ease: "power2.inOut",
      duration: 0.5,
      stagger: 0.2
    }, "<")
    
    .to(suggestions, {
      opacity: 0,
      
      scale: 0.8,
      stagger: 0.1,
      duration: 0.2,
      ease: "power2.inOut",
      onComplete: () => {
        
        suggestions.style.opacity = "1";
        suggestions.style.scale = "1"; // Reset scale
        suggestions.style.display = "none"; // Hide after animation
      }
    }, "<")
    
    
    // Add search container animation based on device type
if (isMobile) {
  tl.to(searchContainer, {
    top: "15px",
    left: "70px",
    width: "calc(100% - 85px)",
    duration: 0.5,
    ease: "power2.inOut"
  }, "-=0.5");
} else {
  tl.to(searchContainer, {
    top: "15px",
    left: "50%",
    xPercent: -50,
    duration: 0.5,
    ease: "power2.inOut"
  }, "-=0.5");
}
    tl.to(mainContent, {
      zIndex: 2000,
      y: 0,
      ease: "power2.inOut",
      duration: 0.3,
      delay: 0.
    }, "-=0.6");
    // Show back button
    backButton.style.display = "flex";
    tl.fromTo(backButton, 
      { opacity: 0, x: -20, scale: 0.8 },
      { opacity: 1, x: 0, scale: 1, duration: 0.2, ease: "power2.inOut" },
      0.3
    );
  }

  // Function to create profile cards
  function createProfileCard(profile) {
    const card = document.createElement("div");
    card.className = "profile-card";

    // Create rating stars
    const stars = Array(5)
      .fill()
      .map((_, i) => {
        return i < Math.floor(profile.rating)
          ? '<i class="fa-solid fa-star"></i>'
          : i === Math.floor(profile.rating) && profile.rating % 1 >= 0.5
          ? '<i class="fa-solid fa-star-half-stroke"></i>'
          : '<i class="fa-regular fa-star"></i>';
      })
      .join("");

    // Create skill tags
    const skillTags = profile.skills
      .map((skill) => `<span class="skill-tag">${skill}</span>`)
      .join("");

    card.innerHTML = `
      <div class="profile-card-header">
        <img src="${profile.image}" alt="${profile.name}" class="profile-image">
        <div class="profile-info">
          <h3>${profile.name}</h3>
          <div class="profile-rating">
            ${stars}
            <span class="rating-value">${profile.rating}</span>
          </div>
          <div class="profile-experience">${profile.experience} experience</div>
        </div>
      </div>
      <div class="profile-skills">
        ${skillTags}
      </div>
      <div class="buttons-container">
        <button class="contact-button">Contact</button>
        <button class="contact-button">View Profile</button>
      </div>
    `;

    return card;
  }

  // Function to filter profiles based on search query
  function filterProfiles(query) {
    if (!query) return [];

    query = query.toLowerCase();
    return profileData.filter((profile) => {
      // Check if query matches name, skills or tags
      const nameMatch = profile.name.toLowerCase().includes(query);
      const skillMatch = profile.skills.some((skill) =>
        skill.toLowerCase().includes(query)
      );
      const tagMatch = profile.tags.some((tag) => tag.includes(query));

      return nameMatch || skillMatch || tagMatch;
    });
  }

  // Function to render search results
  function renderSearchResults(query) {
    // Clear previous results
    searchResultsContainer.innerHTML = "";
  
    // Filter profiles
    const matchedProfiles = filterProfiles(query);
    
    // Show message if no results
    if (matchedProfiles.length === 0) {
      const noResults = document.createElement("div");
      noResults.className = "no-results";
      noResults.innerHTML = `
        <i class="fa-solid fa-search"></i>
        <h3>No profiles found for "${query}"</h3>
        <p>Try different keywords or browse all profiles</p>
      `;
      searchResultsContainer.appendChild(noResults);
    } else {
      // Create and append profile cards
      matchedProfiles.forEach((profile) => {
        const card = createProfileCard(profile);
        searchResultsContainer.appendChild(card);
      });
    }
  
    // Show results container with improved animation
    searchResultsContainer.style.display = "flex";
    gsap.fromTo(
      searchResultsContainer,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
    
    // Ensure the page doesn't scroll when showing results
    document.body.style.overflow = "hidden";
  }

  // Function to display search results
  function displaySearchResults(query) {
    // First perform the animation, then render results after animation completes
    performSearchAnimation(() => {
      renderSearchResults(query);
    });
  }

  // Function to revert to home view
  function revertToHomeView() {
    const tl = gsap.timeline();
    // Hide back button first
    tl
    .to(backButton, {
      opacity: 0,
      x: -20,
      scale: 0.8,
      duration: 0.3,
      onComplete: () => {
        backButton.style.display = "none";
        backButton.style.x = 0;
        backButton.style.scale = 1;
      }
    })

    // Hide search results with animation
    .to(searchResultsContainer, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => {
        searchResultsContainer.style.display = "none";
        searchResultsContainer.style.marginTop = "0"; // Reset margin
      }
    }, "-=0.3");

    // Animate search container back to original position
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      gsap.to(searchContainer, {
        top: originalSearchPosition.top + "px",
        left: originalSearchPosition.left + "px",
        width: originalSearchPosition.width + "px",
        duration: 0.5,
        ease: "power2.inOut",
        clearProps: "all", // Clear all properties after animation
        onComplete: completeReturn
      });
    } else {
      gsap.to(searchContainer, {
        top: originalSearchPosition.top + "px",
        left: originalSearchPosition.left + "px",
        width: originalSearchPosition.width + "px",
        xPercent: 0, // Remove any percentage-based transforms
        duration: 0.5,
        ease: "power2.inOut",
        clearProps: "all", // Clear all properties after animation
        onComplete: completeReturn
      });
    }

    function completeReturn() {
      // Restore original styles completely
      for (const prop in originalSearchStyles) {
        searchContainer.style[prop] = originalSearchStyles[prop];
      }
    
      // Create a GSAP timeline
      const tl = gsap.timeline();
    
      // Add animations to the timeline
      tl.to(rightelement, {
        x: 0,
        opacity: 1,
        ease: "power2.inOut",
        duration: 0.5,
        stagger: 0.2
      })
      .to(leftelement, {
        x: 0,
        opacity: 1,
        ease: "power2.inOut",
        duration: 0.5,
        stagger: 0.2
      }, "<") // Use "<" to start this animation at the same time as the previous one
      .to(mainContent, {
        zIndex: 1,
        ease: "power2.inOut",
        duration: 0.5,
      }, "<") // Start this animation at the same time as the previous one
      .to(suggestions, {
        display: "flex",
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.inOut"
      }, "-=0.5"); 
    }

    // Clear search input
    searchInput.value = "";
    
    // Reset the animation played flag when returning to home
    searchAnimationPlayed = false;
  }

  // Handle search input keypress - animation only starts on Enter
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && searchInput.value.trim() !== "") {
      displaySearchResults(searchInput.value.trim());
    }
  });

  // Handle back button click
  backButton.addEventListener("click", revertToHomeView);

  // Handle suggestion tag clicks
  const suggestionTags = document.querySelectorAll(".suggestion-tag");
  suggestionTags.forEach((tag) => {
    tag.addEventListener("click", function () {
      // Add bounce animation
      gsap.to(tag, {
        scale: 1.1,
        duration: 0.2,
        ease: "power1.out",
        onComplete: () => {
          gsap.to(tag, {
            scale: 1,
            duration: 0.2,
            ease: "power1.in",
            onComplete: () => {
              // Set search input value
              searchInput.value = tag.textContent;
              // Display search results 
              displaySearchResults(tag.textContent);
            }
          });
        }
      });
    });
  });
});