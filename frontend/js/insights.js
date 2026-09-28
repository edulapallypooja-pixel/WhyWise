document.addEventListener("DOMContentLoaded", async () => {

    const memoryMetric = document.getElementById("memoryMetric");

    try {
        const response = await fetch("http://127.0.0.1:8000/memory");

        if (!response.ok) {
            throw new Error("Could not load memory");
        }

        const data = await response.json();

        if (memoryMetric) {
            memoryMetric.textContent = data.count;
        }

    } catch (error) {

        console.error("Memory loading error:", error);

        if (memoryMetric) {
            memoryMetric.textContent = "0";
        }
    }

});