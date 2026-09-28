document.addEventListener("DOMContentLoaded", loadMemory);

async function loadMemory() {

    const memoryList = document.getElementById("memoryList");
    const memoryCount = document.getElementById("memoryCount");

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/memory"
        );

        if (!response.ok) {
            throw new Error("Memory API failed");
        }

        const data = await response.json();

        const memories = data.memories || [];

        memoryCount.textContent = memories.length;

        memoryList.innerHTML = "";

        if (memories.length === 0) {

            memoryList.innerHTML = `
                <div class="memory-empty">
                    <h3>No memories found</h3>
                    <p>
                        WhyWise has not stored any organizational
                        memories yet.
                    </p>
                </div>
            `;

            return;
        }

        memories.forEach((memory, index) => {

            const card = document.createElement("div");

            card.className = "memory-card";

            card.innerHTML = `
                <div class="memory-top">

                    <div>
                        <span class="memory-number">
                            HINDSIGHT MEMORY #${index + 1}
                        </span>

                        <h3>
                            ${getMemoryTitle(memory.text)}
                        </h3>
                    </div>

                    <span class="similarity">
                        ${memory.type || "Memory"}
                    </span>

                </div>

                <div class="memory-content">

                    <p class="memory-text">
                        ${escapeHTML(memory.text)}
                    </p>

                </div>

                <div class="lesson">

                    <strong>
                        Remembered by WhyWise
                    </strong>

                    <p>
                        This organizational experience can be
                        recalled during future similar incidents.
                    </p>

                </div>
            `;

            memoryList.appendChild(card);

        });

    } catch (error) {

        console.error("Memory loading error:", error);

        memoryList.innerHTML = `
            <div class="memory-empty">
                <h3>Unable to load memory</h3>

                <p>
                    Make sure the WhyWise backend and Hindsight
                    are running.
                </p>
            </div>
        `;
    }
}


/* =========================================================
   MEMORY TITLE
   ========================================================= */

function getMemoryTitle(text) {

    const value = String(text).toLowerCase();

    if (value.includes("incident outcome")) {
        return "Incident Outcome Learned";
    }

    if (value.includes("root cause")) {
        return "Historical Incident & Root Cause";
    }

    return "Organizational Experience";
}


/* =========================================================
   SECURITY
   ========================================================= */

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