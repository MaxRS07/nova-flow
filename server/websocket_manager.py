# websocket_manager.py

from fastapi import WebSocket, WebSocketDisconnect, APIRouter
import asyncio
import uuid
from typing import Dict, Any

router = APIRouter()


class RunManager:
    """Manages per-run WebSocket connections and message routing."""

    def __init__(self):
        self.connections: Dict[str, WebSocket] = {}       # run_id -> WebSocket
        self.pending_requests: Dict[str, asyncio.Future] = {}  # request_id -> Future
        self.tasks: Dict[str, asyncio.Task] = {}          # run_id -> background Task

    # -----------------------------
    # Connection handling
    # -----------------------------

    async def connect(self, run_id: str, websocket: WebSocket):
        await websocket.accept()
        self.connections[run_id] = websocket

    def disconnect(self, run_id: str):
        self.connections.pop(run_id, None)

        # Cancel pending requests for this run
        for req_id, future in list(self.pending_requests.items()):
            if req_id.startswith(run_id) and not future.done():
                future.set_exception(Exception("Client disconnected"))
                self.pending_requests.pop(req_id, None)

    # -----------------------------
    # Process / task management
    # -----------------------------

    def create_run(self) -> str:
        """Create a new run ID."""
        return str(uuid.uuid4())

    def register_task(self, run_id: str, task: asyncio.Task):
        self.tasks[run_id] = task

    def cancel_task(self, run_id: str):
        task = self.tasks.pop(run_id, None)
        if task and not task.done():
            task.cancel()

    def is_running(self, run_id: str) -> bool:
        task = self.tasks.get(run_id)
        return task is not None and not task.done()

    # -----------------------------
    # Sending messages
    # -----------------------------

    async def send(self, run_id: str, message: dict):
        ws = self.connections.get(run_id)
        if ws:
            await ws.send_json(message)

    async def emit(self, run_id: str, event: str, data: Any = None):
        """Send a typed event to the client."""
        await self.send(run_id, {"type": event, "data": data})

    # -----------------------------
    # Request → Wait → Response
    # -----------------------------

    async def request(
        self,
        run_id: str,
        payload: dict,
        timeout: int = 300,
    ) -> Any:
        request_id = f"{run_id}:{uuid.uuid4()}"
        loop = asyncio.get_running_loop()
        future = loop.create_future()
        self.pending_requests[request_id] = future

        await self.send(
            run_id,
            {
                "type": "request",
                "request_id": request_id,
                "payload": payload,
            },
        )

        try:
            result = await asyncio.wait_for(future, timeout)
            return result
        finally:
            self.pending_requests.pop(request_id, None)

    # -----------------------------
    # Incoming messages
    # -----------------------------

    async def handle_message(self, run_id: str, data: dict):
        msg_type = data.get("type")

        if msg_type == "response":
            request_id = data.get("request_id")
            future = self.pending_requests.get(request_id)
            if future and not future.done():
                future.set_result(data.get("payload"))

        elif msg_type == "cancel":
            self.cancel_task(run_id)
            await self.emit(run_id, "cancelled")


run_manager = RunManager()


# ---------------------------------
# WebSocket endpoint  ws/run/{run_id}
# ---------------------------------

@router.websocket("/ws/run/{run_id}")
async def websocket_run_endpoint(websocket: WebSocket, run_id: str):
    """
    Per-run WebSocket. The frontend connects here after calling /start-act
    to stream events and handle approval requests for that run.
    """
    await run_manager.connect(run_id, websocket)

    try:
        while True:
            data = await websocket.receive_json()
            await run_manager.handle_message(run_id, data)

    except WebSocketDisconnect:
        run_manager.disconnect(run_id)
