class AssumptionDetector:

    def detect(self, current_incident, memories):

        alerts = []

        if not memories:
            return {
                "changed": False,
                "alerts": []
            }

        current_text = (
            f"{current_incident.get('description', '')} "
            f"{current_incident.get('symptoms', '')} "
            f"{current_incident.get('tried', '')}"
        ).lower()

        for memory in memories:
            memory_text = memory.get("text", "").lower()

            # Detect sustained/increased traffic in the current incident
            sustained_traffic = (
                "sustained" in current_text
                or "240%" in current_text
                or "increased traffic" in current_text
                or "traffic increase" in current_text
            )

            # Historical memory indicates that the previous recovery
            # was temporary.
            temporary_recovery = (
                "recovered temporarily" in memory_text
                or "temporary mitigation" in memory_text
                or "temporary" in memory_text
            )

            if sustained_traffic and temporary_recovery:
                alerts.append({
                    "type": "Changed Assumption",
                    "message": (
                        "The current incident shows sustained or significantly "
                        "increased traffic, while the historical incident "
                        "only achieved temporary recovery."
                    ),
                    "impact": (
                        "The previous mitigation may not be sufficient under "
                        "the current conditions. The underlying database "
                        "connection pool issue should be investigated."
                    )
                })

        return {
            "changed": len(alerts) > 0,
            "alerts": alerts
        }