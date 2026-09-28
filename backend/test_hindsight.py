from hindsight_client import Hindsight

client = Hindsight(
    base_url="http://localhost:8888"
)

print("Connected to Hindsight")

try:
    result = client.retain(
        bank_id="whywise",
        content="Payment API latency increased during peak traffic. Engineers restarted the application servers. The service recovered temporarily. Root cause was database connection pool exhaustion. Lesson: restarting servers is only a temporary mitigation."
    )

    print("RETAIN RESULT:")
    print(result)

except Exception as e:
    print("ERROR:")
    print(type(e).__name__)
    print(str(e))

finally:
    client.close()
    print("Client closed")