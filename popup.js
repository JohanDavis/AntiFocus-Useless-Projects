document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggleWebcamVisibility");
    const blurIntensityInput = document.getElementById("blurIntensity");
    const blurRadiusInput = document.getElementById("blurRadius");
    const gazeDotSwitch = document.getElementById("gaze-dot-switch");
    const caliBtn = document.querySelector(".calibrate-btn");

    // Existing webcam visibility toggle
    toggle.addEventListener("change", async () => {
        const isChecked = toggle.checked;
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        chrome.tabs.sendMessage(tab.id, {
            action: "toggleVideoContainer",
            visible: isChecked,
        });
        console.log("done");
    });

    // New blur intensity control
    blurIntensityInput.addEventListener("input", async () => {
        const value = parseInt(blurIntensityInput.value);
        document.getElementById("blurIntensityValue").textContent = value;
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        chrome.tabs.sendMessage(tab.id, {
            action: "updateBlurIntensity",
            value: value,
        });
    });

    // New blur radius control
    blurRadiusInput.addEventListener("input", async () => {
        const value = parseInt(blurRadiusInput.value);
        document.getElementById("blurRadiusValue").textContent = value;
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        chrome.tabs.sendMessage(tab.id, {
            action: "updateBlurRadius",
            value: value,
        });
    });

    gazeDotSwitch.addEventListener("change", async () => {
        const isChecked = gazeDotSwitch.checked;
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });
        chrome.tabs.sendMessage(tab.id, {
            action: "toggleGazeDot",
            visible: isChecked,
        });
    });

    caliBtn.addEventListener("click", () => {
        alert(
            "Click on the midpoint and each of the corners of the webpage 5 times each while looking at the mouse pointer to calibrate the eye tracker. Try not to move your head, only your eyes."
        );
    });
});
