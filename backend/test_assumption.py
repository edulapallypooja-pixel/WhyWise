from agent.assumption_detector import AssumptionDetector


detector = AssumptionDetector()


current_incident = {
    "type": "Performance",
    "service": "Payment API",
    "description": "Payment API traffic has increased by 240% and remains sustained.",
    "severity": "High",
    "symptoms": "Requests are slow and database connections are near the configured limit.",
    "tried": "Engineers restarted the application servers."
}


memories = [
    {
        "text": (
            "Payment API latency increased during peak traffic. "
            "Engineers restarted the application servers. "
            "The service recovered temporarily. "
            "Root cause was database connection pool exhaustion. "
            "The traffic spike was temporary. "
            "Lesson: restarting servers is only a temporary mitigation."
        )
    }
]


result = detector.detect(
    current_incident=current_incident,
    memories=memories
)


print("ASSUMPTION ANALYSIS")
print("=" * 50)

print("Changed:", result["changed"])

for alert in result["alerts"]:
    print("\nType:", alert["type"])
    print("Message:", alert["message"])
    print("Impact:", alert["impact"])