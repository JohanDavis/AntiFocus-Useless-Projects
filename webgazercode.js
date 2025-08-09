if (typeof window.webgazer !== "undefined") {
    console.log("Welcome to AntiFocus");
    console.log("AntiFocus functions: AFpause(), AFresume(), AFend()");

    // Adjust these to adjust the blur (now dynamic)
    let MAX_BLUR_AMOUNT = 20;
    let BLUR_DISTANCE = 40;

    // Eye tracking blur effect class
    class EyeTrackingBlurEffect {
        constructor() {
            this.isActive = false;
            this.blurOverlay = null;
            this.eyeX = 0;
            this.eyeY = 0;
        }

        enable() {
            this.isActive = true;
            this.createBlurOverlay();
            document.body.classList.add("antifocus-blur-active");
        }

        disable() {
            this.isActive = false;
            this.removeBlurOverlay();
            document.body.classList.remove("antifocus-blur-active");
        }

        createBlurOverlay() {
            this.removeBlurOverlay();
            this.blurOverlay = document.createElement("div");
            this.blurOverlay.id = "antifocus-blur-overlay";
            this.updateBlurOverlayStyle();
            document.body.appendChild(this.blurOverlay);
        }

        updateBlurOverlayStyle() {
            if (!this.blurOverlay) return;
            this.blurOverlay.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                backdrop-filter: blur(${MAX_BLUR_AMOUNT}px) !important;
                -webkit-backdrop-filter: blur(${MAX_BLUR_AMOUNT}px) !important;
                pointer-events: none !important;
                z-index: 999998 !important;
                opacity: 0 !important;
                transition: opacity 0.1s ease !important;
            `;
        }

        removeBlurOverlay() {
            if (this.blurOverlay && this.blurOverlay.parentNode) {
                this.blurOverlay.parentNode.removeChild(this.blurOverlay);
                this.blurOverlay = null;
            }
        }

        updateGazePosition(x, y) {
            if (!this.isActive || !this.blurOverlay) return;
            this.eyeX = (x / window.innerWidth) * 100;
            this.eyeY = (y / window.innerHeight) * 100;
            this.updateBlurMask();
        }

        updateBlurMask() {
            if (!this.blurOverlay) return;
            const maskImage = `radial-gradient(circle at ${this.eyeX}% ${this.eyeY}%, black 0%, black 15%, transparent ${BLUR_DISTANCE}%)`;
            this.blurOverlay.style.maskImage = maskImage;
            this.blurOverlay.style.webkitMaskImage = maskImage;
            this.blurOverlay.style.opacity = "1";
        }

        // New method to update blur intensity
        updateBlurIntensity(newIntensity) {
            MAX_BLUR_AMOUNT = newIntensity;
            this.updateBlurOverlayStyle();
            console.log(`Blur intensity updated to: ${MAX_BLUR_AMOUNT}px`);
        }

        // New method to update blur radius
        updateBlurRadius(newRadius) {
            BLUR_DISTANCE = newRadius;
            this.updateBlurMask(); // Refresh the mask with new radius
            console.log(`Blur radius updated to: ${BLUR_DISTANCE}%`);
        }
    }

    // Create the blurring overlay
    const eyeBlurEffect = new EyeTrackingBlurEffect();

    // Listen for blur control events from content script
    window.addEventListener("updateBlurIntensity", (event) => {
        eyeBlurEffect.updateBlurIntensity(event.detail.value);
    });

    window.addEventListener("updateBlurRadius", (event) => {
        eyeBlurEffect.updateBlurRadius(event.detail.value);
    });

    // Rest of your existing WebGazer initialization code...
    if (
        !window.isSecureContext &&
        location.protocol !== "https:" &&
        location.hostname !== "localhost"
    ) {
        console.error("AntiFocus requires HTTPS or localhost to access camera");
        alert(
            "AntiFocus requires HTTPS to access your camera for eye tracking. Please use HTTPS websites."
        );
    } else if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {
        console.error("Camera access is not available in this browser/context");
        alert(
            "Camera access is not available. Please ensure you're using a modern browser with camera support."
        );
    } else {
        window.saveDataAcrossSessions = true;
        console.log("Initializing WebGazer...");

        try {
            webgazer
                .setGazeListener(function (data, timeStamp) {
                    if (data == null) return;
                    eyeBlurEffect.updateGazePosition(data.x, data.y);
                })
                .begin()
                .then(() => {
                    console.log("WebGazer initialized successfully");
                    eyeBlurEffect.enable();
                })
                .catch((error) => {
                    console.error("Failed to initialize WebGazer:", error);
                    let errorMsg = "Failed to access camera. ";
                    if (error.message && error.message.includes("Permission")) {
                        errorMsg +=
                            "Please allow camera access when prompted by your browser.";
                    } else if (
                        error.message &&
                        error.message.includes("NotFound")
                    ) {
                        errorMsg +=
                            "No camera was found. Please connect a camera and reload.";
                    } else if (
                        error.message &&
                        error.message.includes("NotAllowed")
                    ) {
                        errorMsg +=
                            "Camera access was denied. Click the camera icon in your address bar to allow access.";
                    } else {
                        errorMsg +=
                            "Please check your camera settings and try again.";
                    }
                    alert(errorMsg);
                });
        } catch (error) {
            console.error("Error initializing WebGazer:", error);
            alert("Error starting eye tracking: " + error.message);
        }
    }
} else {
    console.error("WebGazer is not defined");
}

// Add this after your existing EyeTrackingBlurEffect class
class GazeDotController {
    constructor() {
        this.isVisible = false;
    }

    setVisibility(visible) {
        this.isVisible = visible;
        this.updateDotVisibility();
    }

    updateDotVisibility() {
        const gazeDot = document.getElementById("webgazerGazeDot");
        if (gazeDot) {
            if (this.isVisible) {
                gazeDot.classList.add("visible");
            } else {
                gazeDot.classList.remove("visible");
            }
        }
    }

    // Call this method periodically to ensure the dot styling persists
    ensureStyles() {
        const gazeDot = document.getElementById("webgazerGazeDot");
        if (gazeDot) {
            gazeDot.style.zIndex = "999999";
            this.updateDotVisibility();
        }
    }
}

// Create the gaze dot controller
const gazeDotController = new GazeDotController();

// Listen for gaze dot toggle events from content script
window.addEventListener("toggleGazeDot", (event) => {
    gazeDotController.setVisibility(event.detail.visible);
});

// Existing blur effect code...
const eyeBlurEffect = new EyeTrackingBlurEffect();

// Add this to your WebGazer initialization
webgazer
    .setGazeListener(function (data, timeStamp) {
        if (data == null) return;
        eyeBlurEffect.updateGazePosition(data.x, data.y);

        // Ensure gaze dot styles are maintained
        gazeDotController.ensureStyles();
    })
    .begin()
    .then(() => {
        console.log("WebGazer initialized successfully");
        eyeBlurEffect.enable();

        // Set up a periodic check to ensure dot styling
        setInterval(() => {
            gazeDotController.ensureStyles();
        }, 1000);
    })
    .catch((error) => {
        // Your existing error handling
    });

// Functions to be used in the terminal
function AFpause() {
    if (typeof webgazer !== "undefined") {
        webgazer.pause();
    }
}

function AFresume() {
    if (typeof webgazer !== "undefined") {
        webgazer.resume();
    }
}

function AFend() {
    if (typeof webgazer !== "undefined") {
        webgazer.end();
    }
}
