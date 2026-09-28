// ==========================================
// WHYWISE - GLOBAL APP JAVASCRIPT
// ==========================================

console.log("WhyWise application started");

// ------------------------------------------
// Navigation
// ------------------------------------------

function navigateTo(page) {
    window.location.href = page;
}


// ------------------------------------------
// Hindsight Memory Status
// ------------------------------------------

function showMemoryStatus() {

    console.log("Hindsight Memory: ACTIVE");

}


// ------------------------------------------
// Analyze Button
// ------------------------------------------

function startAnalysis() {

    const button = document.querySelector(".new-btn");

    if (!button) return;

    button.innerHTML = "Analyzing...";

    button.disabled = true;

    setTimeout(() => {

        button.innerHTML = "+ Analyze Incident";

        button.disabled = false;

        window.location.href = "new-incident.html";

    }, 700);

}


// ------------------------------------------
// Initialize
// ------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    showMemoryStatus();

});