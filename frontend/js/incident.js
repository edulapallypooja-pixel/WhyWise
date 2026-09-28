document.getElementById("incidentForm").addEventListener("submit", analyzeIncident);

async function analyzeIncident(event) {
    event.preventDefault();

    const incident = {
        type: document.getElementById("incidentType").value,
        service: document.getElementById("service").value,
        description: document.getElementById("description").value,
        severity: document.getElementById("severity").value,
        symptoms: document.getElementById("symptoms").value,
        tried: document.getElementById("previousAction").value
    };

    // Save the current incident
    localStorage.setItem(
        "currentIncident",
        JSON.stringify(incident)
    );

    try {
        // Send incident to WhyWise backend
        const response = await fetch(
            "http://127.0.0.1:8000/analyze",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(incident)
            }
        );

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        // Get WhyWise response
        const result = await response.json();

        // Save real AI analysis
        localStorage.setItem(
            "whywiseAnalysis",
            JSON.stringify(result)
        );

        // Open analysis page
        window.location.href = "incident.html";

    } catch (error) {

        console.error("WhyWise API Error:", error);

        alert(
            "WhyWise could not connect to the backend.\n\n" +
            "Make sure Hindsight and FastAPI are running."
        );
    }
}