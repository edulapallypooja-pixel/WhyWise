document.addEventListener("DOMContentLoaded", () => {

    const storedAnalysis = localStorage.getItem("whywiseAnalysis");
    const storedIncident = localStorage.getItem("currentIncident");

    if (!storedAnalysis) {
        console.warn("No WhyWise analysis found.");
        return;
    }

    const result = JSON.parse(storedAnalysis);
    const incident = storedIncident
        ? JSON.parse(storedIncident)
        : result.incident;

    /* ==========================================
       CURRENT INCIDENT
    ========================================== */

    const serviceElement = document.getElementById("currentService");
    const severityElement = document.getElementById("currentSeverity");
    const descriptionElement = document.getElementById("currentDescription");
    const typeElement = document.getElementById("currentType");
    const symptomsElement = document.getElementById("currentSymptoms");

    if (serviceElement) {
        serviceElement.textContent = incident.service;
    }

    if (severityElement) {
        severityElement.textContent = incident.severity.toUpperCase();

        severityElement.className =
            "severity " + incident.severity.toLowerCase();
    }

    if (descriptionElement) {
        descriptionElement.textContent = incident.description;
    }

    if (typeElement) {
        typeElement.textContent = incident.type;
    }

    if (symptomsElement) {
        symptomsElement.textContent =
            incident.symptoms || "No symptoms provided";
    }


    /* ==========================================
       HINDSIGHT MEMORY
    ========================================== */

    const memoryFound = document.querySelector(".memory-found");

    if (memoryFound) {

        const memories = result.memories || [];

        memoryFound.innerHTML = `
            <div class="memory-found-header">
                <div>
                    <p class="eyebrow">HINDSIGHT MEMORY</p>
                    <h2>
                        ${memories.length}
                        Similar ${memories.length === 1 ? "Incident" : "Incidents"} Found
                    </h2>
                </div>

                <span class="memory-live">
                    ● MEMORY ACTIVE
                </span>
            </div>
        `;

        if (memories.length === 0) {

            memoryFound.innerHTML += `
                <div class="memory-card">
                    <div class="memory-top">
                        <div>
                            <span class="memory-number">
                                HINDSIGHT SEARCH
                            </span>

                            <h3>
                                No similar incidents found
                            </h3>
                        </div>
                    </div>

                    <p style="color:#9aa7ba; line-height:1.6;">
                        WhyWise could not find a closely related
                        historical incident in organizational memory.
                    </p>
                </div>
            `;

        } else {

            memories.forEach((memory, index) => {

                memoryFound.innerHTML += `
                    <div class="memory-card">

                        <div class="memory-top">

                            <div>
                                <span class="memory-number">
                                    PAST INCIDENT #${index + 1}
                                </span>

                                <h3>
                                    Historical Incident
                                </h3>
                            </div>

                            <span class="similarity">
                                Hindsight Memory
                            </span>

                        </div>

                        <div class="memory-content">

                            <p class="memory-text">
                                ${escapeHTML(memory.text)}
                            </p>

                        </div>

                    </div>
                `;
            });
        }
    }


    /* ==========================================
       CHANGED ASSUMPTION
    ========================================== */

    const assumptionAlert =
        document.querySelector(".assumption-alert");

    const assumptions = result.assumptions;

    if (assumptionAlert && assumptions) {

        if (assumptions.changed && assumptions.alerts.length > 0) {

            const alert = assumptions.alerts[0];

            assumptionAlert.innerHTML = `
                <div class="alert-icon">
                    ⚠
                </div>

                <div>

                    <p class="eyebrow">
                        WHYNOT — CHANGED ASSUMPTION
                    </p>

                    <h2>
                        Previous reasoning may no longer apply
                    </h2>

                    <p>
                        ${escapeHTML(alert.message)}
                    </p>

                    <div class="assumption-grid">

                        <div>
                            <small>
                                DETECTION
                            </small>

                            <strong>
                                Changed condition detected
                            </strong>
                        </div>

                        <div>
                            <small>
                                IMPACT
                            </small>

                            <strong>
                                ${escapeHTML(alert.impact)}
                            </strong>
                        </div>

                    </div>

                </div>
            `;

        } else {

            assumptionAlert.style.display = "none";

        }
    }


    /* ==========================================
       WHYWISE RECOMMENDATION
    ========================================== */

    const recommendationCard =
        document.querySelector(".recommendation-card");

    if (recommendationCard && result.analysis) {

        recommendationCard.innerHTML = `
            <div>

                <p class="eyebrow">
                    WHYWISE REASONING
                </p>

                <h2>
                    Recommended next step
                </h2>

                <p>
                    ${escapeHTML(result.analysis.recommendation)}
                </p>

            </div>

            <div class="confidence">

                <span>
                    Historical evidence
                </span>

                <strong>
                    ${result.memories && result.memories.length > 0
                        ? "Available"
                        : "None"}
                </strong>

            </div>
        `;
    }


    /* ==========================================
       MEMORY SEARCH STATUS
    ========================================== */

    const status = document.querySelector(".analysis-status");

    if (status) {

        status.innerHTML =
            result.memories && result.memories.length > 0
                ? "● Memory Search Complete"
                : "● Memory Search Complete — No Match";
    }

});


/* ==========================================
   HTML SAFETY
========================================== */

function escapeHTML(value) {

    if (value === undefined || value === null) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
async function submitOutcome(decision) {

    const incident = JSON.parse(
        localStorage.getItem("currentIncident")
    );

    if (!incident) {
        alert("No current incident found.");
        return;
    }

    const outcome = prompt(
        "What was the actual outcome?\n\n" +
        "Example: Database connection pool increased and latency returned to normal."
    );

    if (!outcome) {
        return;
    }

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/outcome",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    incident: incident.description,
                    decision: decision,
                    outcome: outcome
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        alert(
            "✓ Outcome recorded!\n\n" +
            "WhyWise has learned from this decision."
        );

        console.log("WhyWise outcome:", result);

    } catch (error) {
        console.error("Outcome error:", error);

        alert(
            "Could not record the outcome.\n\n" +
            "Make sure the WhyWise backend is running."
        );
    }
}