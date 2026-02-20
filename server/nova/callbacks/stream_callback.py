import asyncio
import uuid
from fastapi import WebSocket
from nova_act import NovaAct, Workflow, ActMetadata
from nova_act.tools.human.interface.human_input_callback import (
    ApprovalResponse, HumanInputCallbacksBase, UiTakeoverResponse,
)
from websocket_manager import run_manager


class StreamInputCallback(HumanInputCallbacksBase):
    def __init__(self, run_id: str):
        self.run_id = run_id

    def approve(self, message) -> ApprovalResponse:
        """Send approval request over the run's WebSocket and block until response."""
        try:
            loop = asyncio.get_event_loop()
            response = loop.run_until_complete(
                run_manager.request(self.run_id, message)
            )

            approved = response.get("approved", False) if isinstance(response, dict) else False
            reason = response.get("reason", "") if isinstance(response, dict) else ""

            return ApprovalResponse(approved=approved, reason=reason)

        except asyncio.TimeoutError:
            return ApprovalResponse(approved=False, reason="Approval request timed out")
        except Exception as e:
            return ApprovalResponse(approved=False, reason=f"Error: {str(e)}")

    def ui_takeover(self, message) -> UiTakeoverResponse:
        return super().ui_takeover(message)
    