from hindsight_client import Hindsight


class WhyWiseRetriever:

    def __init__(self):
        self.client = Hindsight(
            base_url="http://localhost:8888"
        )
        self.bank_id = "whywise"

    def search_memory(self, query: str):
        try:
            result = self.client.recall(
                bank_id=self.bank_id,
                query=query
            )

            memories = []

            for item in result.results:
                memories.append({
                    "id": item.id,
                    "type": item.type,
                    "text": item.text
                })

            return memories

        except Exception as e:
            print("Memory retrieval error:", e)
            return []

    def close(self):
        self.client.close()