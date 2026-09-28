from agent.retriever import WhyWiseRetriever
from agent.reasoning import WhyWiseReasoner


retriever = WhyWiseRetriever()
reasoner = WhyWiseReasoner()

print("Searching organizational memory...\n")

memories = retriever.search_memory(
    "Payment API latency database connection pool"
)

current_incident = {
    "type": "Performance",
    "service": "Payment API",
    "description": "Payment API latency has increased during peak traffic.",
    "severity": "High",
    "symptoms": "Requests are becoming slow and some are timing out."
}

analysis = reasoner.analyze(
    current_incident=current_incident,
    memories=memories
)

print("WHYWISE ANALYSIS")
print("=" * 50)

print("\nSUMMARY:")
print(analysis["summary"])

print("\nRECOMMENDATION:")
print(analysis["recommendation"])

print("\nEVIDENCE:")
for item in analysis["evidence"]:
    print("-", item["memory"])

retriever.close()