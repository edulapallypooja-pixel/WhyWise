from agent.retriever import WhyWiseRetriever
from agent.reasoning import WhyWiseReasoner
from agent.assumption_detector import AssumptionDetector


class WhyWiseAgent:

    def __init__(self):
        self.retriever = WhyWiseRetriever()
        self.reasoner = WhyWiseReasoner()
        self.assumption_detector = AssumptionDetector()

    def analyze_incident(self, incident):

        # 1. Retrieve similar historical incidents
        query = (
            f"{incident['type']} "
            f"{incident['service']} "
            f"{incident['description']} "
            f"{incident.get('symptoms', '')}"
        )

        memories = self.retriever.search_memory(query)

        # 2. Reason over historical memory
        analysis = self.reasoner.analyze(
            current_incident=incident,
            memories=memories
        )

        # 3. Detect changed assumptions
        assumption_analysis = self.assumption_detector.detect(
            current_incident=incident,
            memories=memories
        )

        # 4. Return complete WhyWise intelligence
        return {
            "incident": incident,
            "memories": memories,
            "analysis": analysis,
            "assumptions": assumption_analysis
        }

    def close(self):
        self.retriever.close()