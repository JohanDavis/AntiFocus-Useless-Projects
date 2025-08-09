// Check if we're in a secure context before loading WebGazer
if (
    !window.isSecureContext &&
    location.protocol !== "https:" &&
    location.hostname !== "localhost"
) {
    console.warn("AntiFocus: Camera access requires HTTPS or localhost");
} else {
    addWebgazerScriptTag();
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "toggleVideoContainer") {
        const container = document.getElementById("webgazerVideoContainer");
        if (!container) return;
        if (request.visible) {
            container.style.display = "block";
        } else {
            container.style.display = "none";
        }
    }
});

// Functions ---------

function addWebgazerScriptTag() {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("webgazer.js");
    script.type = "text/javascript";
    // script.defer = true;

    // When script loads, add next script
    script.onload = function () {
        addWebgazerCodeScriptTag();
    };

    script.onerror = function () {
        console.error("Failed to load WebGazer script");
    };

    document.head.appendChild(script);
}

function addWebgazerCodeScriptTag() {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("webgazercode.js");
    script.type = "text/javascript";
    // script.defer = true;

    script.onload = function () {
        console.log("WebGazer loaded successfully");
    };

    script.onerror = function () {
        console.error("Failed to load WebGazer code script");
    };

    document.head.appendChild(script);
}
