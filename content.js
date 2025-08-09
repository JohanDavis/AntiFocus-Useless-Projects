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
    script.src = chrome.runtime.getURL("webgazerCode.js");
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
