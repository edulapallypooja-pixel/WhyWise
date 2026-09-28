class WhyWiseReasoner:

    def analyze(self, current_incident, memories):

        if not memories:
            return {
                "summary": "No similar incidents were found in organizational memory.",
                "recommendation": "Investigate the incident using the current symptoms and available runbooks.",
                "evidence": []
            }

        evidence = []

        for memory in memories:
            evidence.append({
                "memory": memory["text"],
                "relevance": "Similar historical incident"
            })

        recommendation = (
            "Review the historical incident before taking action. "
            "A previous payment API latency incident was temporarily resolved "
            "by restarting application servers, but the root cause was database "
            "connection pool exhaustion. Consider checking database connection "
            "pool usage before relying on a server restart."
        )

        return {
            "summary": (
                "A similar incident exists in organizational memory. "
                "The previous incident involved payment API latency and "
                "database connection pool exhaustion."
            ),
            "recommendation": recommendation,
            "evidence": evidence
        }