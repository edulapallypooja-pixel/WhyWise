from hindsight_client import Hindsight

client = Hindsight(
    base_url="http://localhost:8888"
)

print("Connected to Hindsight")

try:
    result = client.recall(
        bank_id="whywise",
        query="Payment API latency database connection pool problem"
    )

    print("\nRECALL RESULT:")
    print(result)

except Exception as e:
    print("\nERROR:")
    print(type(e).__name__)
    print(str(e))

finally:
    client.close()
    print("\nClient closed")