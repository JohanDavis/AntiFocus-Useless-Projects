document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggleWebcamVisibility");

    toggle.addEventListener("change", async () => {
        const isChecked = toggle.checked;

        // Send message to content script
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
});
