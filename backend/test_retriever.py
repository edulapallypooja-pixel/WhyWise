from agent.retriever import WhyWiseRetriever

retriever = WhyWiseRetriever()

print("Searching WhyWise memory...\n")

memories = retriever.search_memory(
    "Payment API latency database connection pool"
)

print("MEMORIES FOUND:")

for memory in memories:
    print("\n---")
    print("ID:", memory["id"])
    print("Type:", memory["type"])
    print("Memory:", memory["text"])

retriever.close()