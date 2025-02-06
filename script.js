// Common animations for all pages
document.addEventListener("DOMContentLoaded", function() {
    // Initialize page-specific animations
    initializePageAnimations();
    
    // Initialize common functionality
    initializeNavigation();
    
    // Initialize page-specific functionality
    initializePageFunctionality();
});

function initializeNavigation() {
    const navToggle = document.getElementById("nav-toggle");
    const nav = document.querySelector("nav ul");
    
    if (navToggle) {
        navToggle.addEventListener("change", function() {
            if (this.checked) {
                gsap.from(nav, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3
                });
            }
        });
    }
}

function initializePageAnimations() {
    // Common header animations
    gsap.from("header", { 
        y: -50, 
        opacity: 0, 
        duration: 1 
    });

    // Page-specific animations
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case "home":
            initializeHomeAnimations();
            break;
        case "how-it-works":
            initializeHowItWorksAnimations();
            break;
        case "faq":
            initializeFaqAnimations();
            break;
        case "contact":
            initializeContactAnimations();
            break;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes("how-it-works")) return "how-it-works";
    if (path.includes("faq")) return "faq";
    if (path.includes("contact")) return "contact";
    return "home";
}

// Home page specific functions
function initializeHomeAnimations() {
    gsap.from(".hero h1", { duration: 1, y: -50, opacity: 0 });
    gsap.from(".hero p", { duration: 1, y: -30, opacity: 0, delay: 0.5 });
    gsap.from(".hero input", { duration: 1, scale: 0.8, opacity: 0, delay: 1 });
    gsap.from(".hero button", { duration: 1, scale: 0.8, opacity: 0, delay: 1.2 });
    gsap.from(".feature-card", { 
        duration: 0.5,
        opacity: 0,
        y: 50,
        stagger: 0.2
    });
}

// How It Works page specific functions
function initializeHowItWorksAnimations() {
    gsap.from(".page-content h1", { 
        duration: 1, 
        y: -30, 
        opacity: 0 
    });
    
    gsap.from(".step-card", { 
        duration: 0.5,
        opacity: 0,
        y: 50,
        stagger: 0.2
    });
    
    gsap.from(".features-highlight", { 
        duration: 1,
        opacity: 0,
        y: 30,
        delay: 1
    });
}

// FAQ page specific functions
function initializeFaqAnimations() {
    gsap.from(".page-content h1", { 
        duration: 1, 
        y: -30, 
        opacity: 0 
    });
    
    gsap.from(".faq-item", { 
        duration: 0.5,
        opacity: 0,
        x: -50,
        stagger: 0.2
    });
}

// Contact page specific functions
function initializeContactAnimations() {
    gsap.from(".page-content h1", { 
        duration: 1, 
        y: -30, 
        opacity: 0 
    });
    
    gsap.from(".contact-item", { 
        duration: 0.5,
        opacity: 0,
        y: 30,
        stagger: 0.2
    });
    
    gsap.from(".contact-form", { 
        duration: 1,
        opacity: 0,
        x: 50,
        delay: 0.5
    });
}

function initializePageFunctionality() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case "home":
            initializeDownloader();
            break;
        case "contact":
            initializeContactForm();
            break;
    }
}

// Initialize downloader functionality
function initializeDownloader() {
    // Existing downloader code...
    document.getElementById("videoUrl")?.addEventListener("input", handleUrlInput);
    document.getElementById("downloadBtn")?.addEventListener("click", handleDownload);
}

// Initialize contact form functionality
function initializeContactForm() {
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Animate button to show processing state
            const submitBtn = form.querySelector(".submit-btn");
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                submitBtn.innerHTML = 'Message Sent!';
                submitBtn.style.background = 'var(--success-color)';
                
                // Reset form
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = 'Send Message';
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
}

// Preserve existing downloader functionality...
let currentVideoInfo = null;

function showLoading(show) {
    const btn = document.getElementById("downloadBtn");
    if (show) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Processing...';
    } else {
        btn.disabled = false;
        btn.innerHTML = 'Download Now';
    }
}

function showError(message) {
    const errorDiv = document.getElementById("error-message") || createErrorDiv();
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    errorDiv.style.display = "block";
    
    // Animate error message
    gsap.from(errorDiv, { 
        duration: 0.3, 
        y: -20, 
        opacity: 0,
        onComplete: () => {
            // Auto-hide error after 5 seconds
            setTimeout(() => {
                gsap.to(errorDiv, {
                    duration: 0.3,
                    opacity: 0,
                    y: -20,
                    onComplete: () => {
                        errorDiv.style.display = "none";
                    }
                });
            }, 5000);
        }
    });
}

function createErrorDiv() {
    const errorDiv = document.createElement("div");
    errorDiv.id = "error-message";
    errorDiv.className = "error-message";
    document.querySelector(".hero").insertBefore(errorDiv, document.getElementById("downloadBtn"));
    return errorDiv;
}

function clearError() {
    const errorDiv = document.getElementById("error-message");
    if (errorDiv) {
        errorDiv.style.display = "none";
    }
}

async function handleUrlInput(e) {
    const url = e.target.value.trim();
    if (!url) {
        clearVideoInfo();
        return;
    }
    
    if (url.includes("youtube.com/") || url.includes("youtu.be/")) {
        await getVideoInfo(url);
    }
}

function clearVideoInfo() {
    const infoDiv = document.getElementById("video-info");
    if (infoDiv) {
        infoDiv.remove();
    }
    currentVideoInfo = null;
}

async function getVideoInfo(url) {
    try {
        showLoading(true);
        clearError();
        
        const response = await fetch("/get-video-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || "Failed to get video information");
        }

        currentVideoInfo = data;
        displayVideoInfo(data);
    } catch (error) {
        showError(error.message);
        clearVideoInfo();
    } finally {
        showLoading(false);
    }
}

function displayVideoInfo(info) {
    clearVideoInfo();
    
    const infoDiv = document.createElement("div");
    infoDiv.id = "video-info";
    infoDiv.className = "video-info";
    
    infoDiv.innerHTML = `
        <div class="video-preview">
            <img src="${info.thumbnail}" alt="${info.title}">
            <div class="video-details">
                <h3>${info.title}</h3>
                <p>By: ${info.author}</p>
                <p>Duration: ${formatDuration(info.duration)}</p>
            </div>
        </div>
        <div class="format-selection">
            <h4>Select Format:</h4>
            <select id="format-selector">
                ${info.formats.map(format => `
                    <option value="${format.itag}">
                        ${format.resolution} - ${format.filesize}
                    </option>
                `).join('')}
            </select>
        </div>
    `;

    document.querySelector(".hero").insertBefore(infoDiv, document.getElementById("downloadBtn"));
    gsap.from(infoDiv, { duration: 0.5, y: -20, opacity: 0 });
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function handleDownload() {
    const url = document.getElementById("videoUrl").value.trim();
    
    if (!url) {
        showError("Please enter a YouTube URL");
        return;
    }

    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/)) {
        showError("Please enter a valid YouTube URL");
        return;
    }

    try {
        showLoading(true);
        clearError();

        // First, get video info if not already fetched
        if (!currentVideoInfo) {
            await getVideoInfo(url);
            if (!currentVideoInfo) {
                throw new Error("Failed to get video information");
            }
        }

        const formatSelector = document.getElementById("format-selector");
        const itag = formatSelector ? formatSelector.value : null;

        const response = await fetch("/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, itag })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || "Download failed");
        }

        // Show success message
        const successDiv = document.createElement("div");
        successDiv.className = "success-message";
        successDiv.innerHTML = `
            <div class="download-success">
                <i class="fas fa-check-circle"></i>
                <h3>Download Ready!</h3>
                <p>Your video "${currentVideoInfo.title}" is ready to download.</p>
            </div>
        `;
        
        // Insert success message before the download button
        const downloadBtn = document.getElementById("downloadBtn");
        downloadBtn.parentNode.insertBefore(successDiv, downloadBtn);

        // Animate success message
        gsap.from(successDiv, { 
            duration: 0.5, 
            y: -20, 
            opacity: 0,
            onComplete: () => {
                // Start download after showing success message
                const link = document.createElement("a");
                link.href = data.download_url;
                link.download = data.filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Remove success message after 5 seconds
                setTimeout(() => {
                    gsap.to(successDiv, {
                        duration: 0.5,
                        opacity: 0,
                        y: -20,
                        onComplete: () => successDiv.remove()
                    });
                }, 5000);
            }
        });

    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}
