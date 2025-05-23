document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const timerText = document.querySelector(".timer-text");
  const pointsText = document.querySelector(".points-text");
  const user1Button = document.getElementById("user1-button");
  const user2Button = document.getElementById("user2-button");
  const user1ReadyIndicator = document.getElementById("user1-ready");
  const user2ReadyIndicator = document.getElementById("user2-ready");
  const startButton = document.getElementById("start-button");
  const pauseButton = document.getElementById("pause-button");
  const resumeButton = document.getElementById("resume-button");
  const endButton = document.getElementById("end-button");

  // Modal elements
  const windowModal = document.querySelector(".window");
  const closeButton = document.querySelector(".x");
  const cancelButton = document.querySelector(".btn:nth-child(1)");
  const confirmEndButton = document.querySelector(".btn:nth-child(2)");
  const reasonCards = document.querySelectorAll(".card");
  const sessionDurationText = document.querySelector(
    ".window p:nth-of-type(2)"
  );
  const othericon = document.querySelector(".fa-ellipsis");

  // Create overlay element if it doesn't exist
  let overlay = document.querySelector(".overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);
  }

  // Timer state
  let seconds = 0;
  let isRunning = false;
  let isPaused = false;
  let intervalId = null;
  let user1Ready = false;
  let user2Ready = false;

  // User data - in a real app, this would come from authentication
  const users = {
    user1: {
      id: "user1",
      name: "Bensalah Abderrahmane",
      role: "teacher",
      element: user1Button,
      indicator: user1ReadyIndicator,
      isReady: false,
    },
    user2: {
      id: "user2",
      name: "Abderrahmane Bn",
      role: "learner",
      element: user2Button,
      indicator: user2ReadyIndicator,
      isReady: false,
    },
  };

  // Current user simulation (in a real app this would be determined by auth)
  const currentUser = users.user1; // For demo purposes, assume we're user1
  const otherUser = users.user2; // The other user

  // Format time to display as mm:ss
  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  // Format session duration for display in the modal
  function formatSessionDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}hr ${minutes}min ${seconds}sec`;
    } else if (minutes > 0) {
      return `${minutes}min ${seconds}sec`;
    } else {
      return `${seconds}sec`;
    }
  }

  // Update the timer display
  function updateTimerDisplay() {
    timerText.textContent = formatTime(seconds);
    const points = Math.floor(seconds / 2);
    pointsText.textContent = `${points} points earned`;
  }

  // Start the timer
  function startTimer() {
    if (!isRunning) {
      isRunning = true;
      isPaused = false;
      showToast("Timer started!", "success");

      // Update UI
      startButton.style.display = "none";
      pauseButton.style.display = "inline-flex";
      endButton.style.display = "inline-flex";
      user1Button.style.display = "none";
      user2Button.style.display = "none";

      // Start the interval
      intervalId = setInterval(() => {
        seconds++;
        updateTimerDisplay();
      }, 1000);
    }
  }

  // Pause the timer
  function pauseTimer(initiatingUser) {
    if (isRunning && !isPaused) {
      isPaused = true;
      users.user1.isReady = false;
      users.user2.isReady = false;

      // Show different toast messages based on who initiated the pause
      if (initiatingUser) {
        showToast(
          `${initiatingUser.name} paused the timer. Both users need to resume.`,
          "info"
        );

        // Notify other user
        notifyOtherUser(
          `${initiatingUser.name} has paused the session`,
          "warning"
        );
      } else {
        showToast("Timer paused! Both users need to resume.", "info");
      }

      // Update UI
      pauseButton.style.display = "none";
      resumeButton.style.display = "inline-flex";
      user1Button.style.display = "inline-flex";
      user2Button.style.display = "inline-flex";
      user1Button.textContent = "Ready to Resume";
      user2Button.textContent = "Ready to Resume";
      user1Button.dataset.action = "resume";
      user2Button.dataset.action = "resume";
      user1ReadyIndicator.textContent = "Not Ready";
      user2ReadyIndicator.textContent = "Not Ready";
      user1ReadyIndicator.classList.remove("is-ready");
      user2ReadyIndicator.classList.remove("is-ready");

      // Enable both buttons for the resume state
      user1Button.disabled = false;
      user2Button.disabled = false;

      // Clear the interval
      clearInterval(intervalId);
    }
  }

  // Resume the timer
  function resumeTimer() {
    if (isRunning && isPaused && users.user1.isReady && users.user2.isReady) {
      isPaused = false;
      showToast("Timer resumed!", "success");

      // Update UI
      resumeButton.style.display = "none";
      pauseButton.style.display = "inline-flex";
      user1Button.style.display = "none";
      user2Button.style.display = "none";

      // Start the interval
      intervalId = setInterval(() => {
        seconds++;
        updateTimerDisplay();
      }, 1000);
    }
  }

  // End the timer - THIS FUNCTION SHOULD ONLY BE CALLED AFTER CONFIRMATION
  function endTimer(initiatingUser) {
    if (isRunning) {
      isRunning = false;
      isPaused = false;
      users.user1.isReady = false;
      users.user2.isReady = false;
      const points = Math.floor(seconds / 2);

      if (initiatingUser) {
        showToast(
          `${initiatingUser.name} ended the session! Both users earned ${points} points.`,
          "success"
        );

        // Notify other user
        notifyOtherUser(
          `${initiatingUser.name} has ended the session. You earned ${points} points.`,
          "info"
        );
      } else {
        showToast(
          `Session ended! Both users earned ${points} points.`,
          "success"
        );
      }

      // Reset UI to initial state
      startButton.style.display = "inline-flex";
      pauseButton.style.display = "none";
      resumeButton.style.display = "none";
      endButton.style.display = "none";
      user1Button.style.display = "inline-flex";
      user2Button.style.display = "inline-flex";
      user1Button.textContent = "Ready to Start";
      user2Button.textContent = "Ready to Start";
      user1Button.dataset.action = "start";
      user2Button.dataset.action = "start";
      user1ReadyIndicator.textContent = "Not Ready";
      user2ReadyIndicator.textContent = "Not Ready";
      user1ReadyIndicator.classList.remove("is-ready");
      user2ReadyIndicator.classList.remove("is-ready");

      // Enable both buttons for the next session
      user1Button.disabled = false;
      user2Button.disabled = false;

      // Reset timer
      seconds = 0;
      updateTimerDisplay();

      // Clear the interval
      clearInterval(intervalId);
    }
  }

  // Handle user ready states
  function setUserReady(user) {
    const userId = user.id;

    // Update ready state
    users[userId].isReady = true;
    users[userId].indicator.textContent = "Ready!";
    users[userId].indicator.classList.add("is-ready");
    users[userId].element.disabled = true;

    // Show different toasts based on the current state
    if (!isRunning) {
      showToast(`${users[userId].name} is ready to start!`, "info");

      // If this is the current user, notify the other user
      if (users[userId] === currentUser) {
        notifyOtherUser(
          `${currentUser.name} is ready to start the session`,
          "info"
        );
      }
    } else if (isPaused) {
      showToast(`${users[userId].name} is ready to resume!`, "info");

      // If this is the current user, notify the other user
      if (users[userId] === currentUser) {
        notifyOtherUser(
          `${currentUser.name} is ready to resume the session`,
          "info"
        );
      }
    }

    // Check if both users are ready
    if (users.user1.isReady && users.user2.isReady) {
      if (!isRunning) {
        startTimer();
      } else if (isPaused) {
        resumeTimer();
      }
    }
  }

  // Toast notification system
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    const container = document.getElementById("toast-container");
    container.appendChild(toast);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      toast.style.animation = "toast-slide-out 0.3s ease-out forwards";
      setTimeout(() => {
        container.removeChild(toast);
      }, 300);
    }, 3000);
  }

  // Simulate notifications to other user
  // In a real app, this would send a message through your backend
  function notifyOtherUser(message, type = "info") {
    console.log(`[NOTIFICATION TO OTHER USER]: ${message}`);

    // Create a special notification toast to simulate the notification
    // that would be received by the other user
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<strong>📨 Notification sent:</strong><br>${message}`;

    const container = document.getElementById("toast-container");
    container.appendChild(toast);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      toast.style.animation = "toast-slide-out 0.3s ease-out forwards";
      setTimeout(() => {
        container.removeChild(toast);
      }, 300);
    }, 4000);

    // In a real system, this is where you would call an API to send
    // the notification to the other user via WebSockets, push notifications, etc.
  }

  // MODAL FUNCTIONS

  // Show modal function
  function showModal() {
    // Update session duration text
    sessionDurationText.textContent = `Session duration: ${formatSessionDuration(
      seconds
    )}`;

    windowModal.style.display = "flex";
    overlay.style.display = "block";

    // Add entrance animation for modal if GSAP is available
    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        windowModal,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    } else {
      windowModal.style.opacity = 1;
    }

    // Reset selected reason
    selectedReason = null;
    resetCardSelection();
  }

  // Hide modal function
  function hideModal() {
    if (typeof gsap !== "undefined") {
      gsap.to(windowModal, {
        y: -30,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          windowModal.style.display = "none";
          overlay.style.display = "none";
        },
      });
    } else {
      windowModal.style.opacity = 0;
      windowModal.style.display = "none";
      overlay.style.display = "none";
    }
  }

  // Reset card selection
  function resetCardSelection() {
    reasonCards.forEach((card) => {
      if (typeof gsap !== "undefined") {
        gsap.to(card, {
          backgroundColor: "var(--border)",
          color: "var(--text-secondary)",
          duration: 0.3,
          y: 0,
        });
      } else {
        card.style.backgroundColor = "var(--border)";
        card.style.color = "var(--text-secondary)";
        card.style.transform = "translateY(0)";
      }
    });
  }

  // Initialize GSAP hover animations for cards if GSAP is available
  function initCardAnimations() {
    if (typeof gsap === "undefined") return;

    reasonCards.forEach((card) => {
      // Create hover animations
      card.addEventListener("mouseenter", () => {
        if (card.dataset.value !== selectedReason) {
          gsap.to(card, {
            y: -5,
            duration: 0.2,
            ease: "power1.out",
            boxShadow: "0 8px 15px var(--shadow)",
          });
        }
      });

      card.addEventListener("mouseleave", () => {
        if (card.dataset.value !== selectedReason) {
          gsap.to(card, {
            y: 0,
            duration: 0.2,
            ease: "power1.in",
            boxShadow: "2px 5px 10px var(--shadow)",
          });
        }
      });
    });
  }

  // Event Listeners for user ready buttons
  user1Button.addEventListener("click", function () {
    const action = this.dataset.action;
    if (action === "start" || action === "resume") {
      setUserReady(users.user1);
    }
  });

  user2Button.addEventListener("click", function () {
    const action = this.dataset.action;
    if (action === "start" || action === "resume") {
      setUserReady(users.user2);
    }
  });

  // Start button event listener
  startButton.addEventListener("click", function () {
    if (users.user1.isReady && users.user2.isReady && !isRunning) {
      startTimer();
    } else {
      showToast("Both users must be ready to start the timer!", "warning");
    }
  });

  // Pause button event listener
  pauseButton.addEventListener("click", function () {
    pauseTimer(currentUser);
  });

  // Resume button event listener
  resumeButton.addEventListener("click", function () {
    if (users.user1.isReady && users.user2.isReady && isPaused) {
      resumeTimer();
    } else {
      showToast("Both users must be ready to resume the timer!", "warning");
    }
  });

  // End button event listener - MODIFIED TO ONLY SHOW MODAL
  endButton.addEventListener("click", function () {
    // Instead of ending right away, show the modal for confirmation
    showModal();
  });

  // Close modal when X is clicked
  closeButton.addEventListener("click", hideModal);

  // Close modal when cancel button is clicked
  cancelButton.addEventListener("click", hideModal);

  // Handle end session confirmation - THIS IS WHAT ACTUALLY ENDS THE SESSION
  confirmEndButton.addEventListener("click", function () {
    endTimer(currentUser);
    hideModal();
  });

  // Close modal if clicked outside
  overlay.addEventListener("click", hideModal);

  // Selected reason
  let selectedReason = null;

  // Reason card selection with enhanced animations
  reasonCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Reset all cards first
      resetCardSelection();

      // Store selected reason
      selectedReason = this.dataset.value;

      if (typeof gsap !== "undefined") {
        // Highlight selected card with animation
        gsap.to(this, {
          backgroundColor: "var(--primary)",
          color: "white",
          y: -3,
          scale: 1.03,
          duration: 0.3,
          ease: "back.out(1.2)",
          boxShadow: "0 8px 20px var(--shadow)",
        });
        othericon.style.color = "var(--text-primary)";
        if (this.id === "card4" && othericon) {
          othericon.style.color = "white";
        }

        // Add a small pulse animation to indicate selection
        gsap.fromTo(
          this,
          { boxShadow: "0 0 0 4px rgba(124, 58, 237, 0.5)" },
          {
            boxShadow: "0 8px 20px var(--shadow)",
            duration: 0.6,
            ease: "power1.out",
          }
        );
      } else {
        // Fallback for when GSAP is not available
        this.style.backgroundColor = "var(--primary-dark)";
        this.style.color = "white";
        this.style.transform = "translateY(-3px) scale(1.03)";
        this.style.boxShadow = "0 8px 20px var(--shadow)";
      }
    });
  });

  // Initialize
  updateTimerDisplay();
  startButton.disabled = true;

  // Helper function to update start button state
  function updateStartButtonState() {
    startButton.disabled = !(users.user1.isReady && users.user2.isReady);
  }

  // Update start button when user ready state changes
  const startUserReadyObserver = new MutationObserver(updateStartButtonState);
  startUserReadyObserver.observe(user1ReadyIndicator, {
    attributes: true,
    childList: true,
  });
  startUserReadyObserver.observe(user2ReadyIndicator, {
    attributes: true,
    childList: true,
  });

  // Initialize card animations if GSAP is available
  if (typeof gsap !== "undefined") {
    initCardAnimations();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Find existing elements
  const confirmEndButton = document.querySelector(".window .btn:nth-child(2)"); // The "End Session" button in modal
  const feedbackContainer = document.querySelector(".feedback-container");
  const sessionDurationText = document.querySelector(
    ".session-details .session-item:first-child span:last-child"
  );
  const pointsEarnedText = document.querySelector(
    ".session-details .session-item:last-child span:last-child"
  );

  // Add these lines to your existing code to handle showing the feedback form

  // Create overlay for feedback container if it doesn't exist
  let feedbackOverlay = document.querySelector(".feedback-overlay");
  if (!feedbackOverlay) {
    feedbackOverlay = document.createElement("div");
    feedbackOverlay.className = "overlay feedback-overlay";
    document.body.appendChild(feedbackOverlay);
  }

  // Hide feedback container initially
  if (feedbackContainer) {
    feedbackContainer.style.display = "none";
  }

  // Function to show feedback container
  function showFeedbackContainer() {
    if (feedbackContainer) {
      // Update session details
      // Get the current timer value and points
      const timerText = document.querySelector(".timer-text").textContent;
      const pointsText = document
        .querySelector(".points-text")
        .textContent.split(" ")[0];

      // Update the feedback container with current values
      sessionDurationText.textContent = timerText;
      pointsEarnedText.textContent = pointsText;

      // Show the feedback container and overlay
      feedbackContainer.style.display = "block";
      feedbackOverlay.style.display = "block";

      // Add animation if GSAP is available
      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          feedbackContainer,
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
        );
      }
    }
  }

  // Function to hide feedback container
  function hideFeedbackContainer() {
    if (feedbackContainer) {
      if (typeof gsap !== "undefined") {
        gsap.to(feedbackContainer, {
          y: -30,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            feedbackContainer.style.display = "none";
            feedbackOverlay.style.display = "none";
          },
        });
      } else {
        feedbackContainer.style.display = "none";
        feedbackOverlay.style.display = "none";
      }
    }
  }

  // Modify the confirmEndButton click event to show feedback after ending the session
  if (confirmEndButton) {
    // Store the original click event handler
    const originalClickHandler = confirmEndButton.onclick;

    // Replace with new handler that shows feedback
    confirmEndButton.onclick = function (event) {
      // Hide the end session modal first
      const windowModal = document.querySelector(".window");
      const overlay = document.querySelector(".overlay:not(.feedback-overlay)");

      if (windowModal) {
        windowModal.style.display = "none";
      }
      if (overlay) {
        overlay.style.display = "none";
      }

      // Then show feedback
      showFeedbackContainer();

      // End the timer in background
      const currentUser = users ? users.user1 : null;
      endTimer(currentUser);
    };
  }

  // Add click event to the "Submit Feedback" and "Close Session" buttons
  const submitButton = document.getElementById("submit");
  const closeButton = document.getElementById("close");

  if (submitButton) {
    submitButton.addEventListener("click", function () {
      // Here you would handle submitting the feedback to your backend
      showToast("Feedback submitted successfully!", "success");
      hideFeedbackContainer();
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", function () {
      hideFeedbackContainer();
    });
  }
});

// Enhanced dark mode functionality - works with external toggle
document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;

  // Apply the theme from localStorage
  function applyTheme() {
    // Load saved theme from localStorage or default to light
    const savedTheme = localStorage.getItem("theme") || "light";

    // Set theme on root element
    root.setAttribute("data-theme", savedTheme);

    // Update checkbox if it exists on this page
    const toggleCheckbox = document.getElementById("checkbox");
    if (toggleCheckbox) {
      toggleCheckbox.checked = savedTheme === "dark";
    }
  }

  // Apply theme immediately on page load
  applyTheme();

  // Listen for checkbox changes if it exists on this page
  const toggleCheckbox = document.getElementById("checkbox");
  if (toggleCheckbox) {
    toggleCheckbox.addEventListener("change", function () {
      const newTheme = toggleCheckbox.checked ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      applyTheme();
    });
  }

  // Listen for storage changes (when theme is changed on another page)
  window.addEventListener("storage", function (event) {
    if (event.key === "theme") {
      applyTheme();
    }
  });
});

document.getElementById("backButton").addEventListener("click", function () {
  history.back();
});

document.addEventListener("DOMContentLoaded", function () {
  const filesButton = document.getElementById("files-button");
  const filesModal = document.getElementById("filesModal");
  const closeFilesModal = document.getElementById("closeFilesModal");
  const fileInput = document.getElementById("fileInput");
  const uploadButton = document.getElementById("upload-button");
  const fileList = document.getElementById("fileList");

  // Store uploaded files
  let uploadedFiles = [];

  // Create modal overlay
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  document.body.appendChild(modalOverlay);

  // Show files modal
  function showFilesModal() {
    filesModal.style.display = "flex";
    modalOverlay.classList.add("active");
    setTimeout(() => {
      filesModal.classList.add("active");
    }, 10);
    updateFileList();
  }

  // Hide files modal
  function hideFilesModal() {
    filesModal.classList.remove("active");
    modalOverlay.classList.remove("active");
    setTimeout(() => {
      filesModal.style.display = "none";
    }, 300);
  }

  // Get file icon based on file type
  function getFileIcon(fileName) {
    const extension = fileName.split(".").pop().toLowerCase();
    const iconMap = {
      pdf: { icon: "📄", class: "pdf" },
      doc: { icon: "📝", class: "doc" },
      docx: { icon: "📝", class: "doc" },
      txt: { icon: "📄", class: "text" },
      jpg: { icon: "🖼️", class: "image" },
      jpeg: { icon: "🖼️", class: "image" },
      png: { icon: "🖼️", class: "image" },
      gif: { icon: "🖼️", class: "image" },
      mp4: { icon: "🎥", class: "video" },
      mp3: { icon: "🎵", class: "audio" },
      wav: { icon: "🎵", class: "audio" },
      zip: { icon: "📦", class: "archive" },
      rar: { icon: "📦", class: "archive" },
    };

    return iconMap[extension] || { icon: "📄", class: "default" };
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Update file list display
  function updateFileList() {
    if (uploadedFiles.length === 0) {
      fileList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📁</div>
                    <div class="empty-title">No files uploaded</div>
                    <div class="empty-description">Upload files using the "Upload Files" button to see them here.</div>
                </div>
            `;
      return;
    }

    fileList.innerHTML = uploadedFiles
      .map((file, index) => {
        const fileIcon = getFileIcon(file.name);
        const uploadDate = new Date(file.uploadDate).toLocaleDateString();

        return `
                <li class="file-item" data-index="${index}">
                    <div class="file-info">
                        <div class="file-icon ${fileIcon.class}">
                            ${fileIcon.icon}
                        </div>
                        <div class="file-details">
                            <div class="file-name" title="${file.name}">${
          file.name
        }</div>
                            <div class="file-meta">
                                <span>${formatFileSize(file.size)}</span>
                                <span>Uploaded ${uploadDate}</span>
                            </div>
                        </div>
                    </div>
                    <div class="file-actions">
                        <button class="file-action-btn download" title="Download" onclick="downloadFile(${index})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7,10 12,15 17,10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                        </button>
                        <button class="file-action-btn delete" title="Remove" onclick="removeFile(${index})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3,6 5,6 21,6"/>
                                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                            </svg>
                        </button>
                    </div>
                </li>
            `;
      })
      .join("");
  }

  // Add file to uploaded files list
  function addFiles(files) {
    Array.from(files).forEach((file) => {
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: Date.now(),
        file: file, // Store the actual file object
      };
      uploadedFiles.push(fileData);
    });

    // Show success toast
    showToast(`${files.length} file(s) uploaded successfully!`, "success");
    updateFileList();
  }

  // Remove file
  window.removeFile = function (index) {
    const fileName = uploadedFiles[index].name;
    uploadedFiles.splice(index, 1);
    updateFileList();
    showToast(`${fileName} removed`, "info");
  };

  // Download file
  window.downloadFile = function (index) {
    const fileData = uploadedFiles[index];
    const url = URL.createObjectURL(fileData.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileData.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloading ${fileData.name}`, "info");
  };

  // Toast notification function (if not already defined)
  function showToast(message, type = "info") {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.style.animation = "toast-slide-out 0.3s ease-in forwards";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // Event listeners
  filesButton.addEventListener("click", showFilesModal);
  closeFilesModal.addEventListener("click", hideFilesModal);
  modalOverlay.addEventListener("click", hideFilesModal);

  // Upload button functionality
  uploadButton.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = ""; // Reset input
    }
  });

  // Prevent modal from closing when clicking inside it
  filesModal.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && filesModal.classList.contains("active")) {
      hideFilesModal();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
        const tl = gsap.timeline({
          defaults: {
            duration: 0.6,
            ease: "power3.out",
          },
        });

        // Animate main card first
        tl.from(".big-card", {
          opacity: 0,
          scale: 0.95,
          duration: 0.2,
          ease: "back.out(1.2)"
        })
        
        // Animate card header
        .from(".card-header", {
          opacity: 0,
          y: -20,
          stagger: 0.1,
          ease: "power2.out",
        }, "-=0.6")
        
        // Animate timer display
        .from(".timer-display", {
          opacity: 0,
          y: -30,
          scale: 0.9,
          duration: 0.7,
          ease: "back.out(1.3)",
        }, "-=0.5")
        
        // Animate user profiles from opposite sides
        .from(".user-profile:nth-child(1)", {
          opacity: 0,
          x: -80,
          duration: 0.8,
          ease: "power3.out",
        }, "-=0.4")
        .from(".user-profile:nth-child(2)", {
          opacity: 0,
          x: 80,
          duration: 0.8,
          ease: "power3.out",
        }, "-=0.8")
        
        // Animate timer controls
        .from(".timer-controls", {
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out(1.5)",
        }, "-=0.5");
    });