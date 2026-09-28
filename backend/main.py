from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from hindsight_client import Hindsight

from agent.whywise_agent import WhyWiseAgent


app = FastAPI(title="WhyWise API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Incident(BaseModel):
    type: str
    service: str
    description: str
    severity: str
    symptoms: str = ""
    tried: str = ""

class Outcome(BaseModel):
    incident: str
    decision: str
    outcome: str


@app.get("/")
def home():
    return {
        "message": "WhyWise API is running"
    }


@app.post("/analyze")
def analyze_incident(incident: Incident):

    agent = WhyWiseAgent()

    try:
        result = agent.analyze_incident(
            incident.model_dump()
        )

        return result

    finally:
        agent.close()
@app.post("/outcome")
def record_outcome(data: Outcome):

    client = Hindsight(
        base_url="http://localhost:8888"
    )

    try:
        memory_text = (
            f"WhyWise incident outcome. "
            f"Incident: {data.incident}. "
            f"Human decision: {data.decision}. "
            f"Actual outcome: {data.outcome}. "
            f"This outcome should be considered in future similar incidents."
        )

        result = client.retain(
            bank_id="whywise",
            content=memory_text
        )

        return {
            "success": True,
            "message": "Outcome learned by WhyWise",
            "memory": memory_text
        }

    finally:
        client.close()

@app.get("/memory")
def get_memory():
    client = Hindsight(base_url="http://localhost:8888")

    try:
        result = client.recall(
            bank_id="whywise",
            query="WhyWise incidents decisions outcomes lessons"
        )

        memories = []

        for item in result.results:
            memories.append({
                "id": item.id,
                "type": item.type,
                "text": item.text
            })

        return {
            "success": True,
            "count": len(memories),
            "memories": memories
        }

    finally:
        client.close()