"""
Drains the thinking line queue in a background thread and sends each line
to the run_manager as a JSON thinking event.
"""

import asyncio
import logging
import queue
import threading

logger = logging.getLogger(__name__)


class ThinkingStreamer:
    """
    Reads lines from `line_queue` and fires them via run_manager.send()
    as `{"type": "thinking", "message": <line>}`.
    """

    def __init__(self, run_id: str, line_queue: queue.Queue, loop: asyncio.AbstractEventLoop):
        self.run_id = run_id
        self.line_queue = line_queue
        self.loop = loop
        self._stop_event = threading.Event()
        self._thread = threading.Thread(target=self._drain, daemon=True)

    def start(self):
        self._thread.start()

    def stop(self):
        """Signal the drain loop to exit after the queue is empty."""
        self._stop_event.set()

    def join(self, timeout: float = 5.0):
        self._thread.join(timeout=timeout)

    def _drain(self):
        from websocket_manager import run_manager  # late import avoids circular deps

        while not self._stop_event.is_set() or not self.line_queue.empty():
            try:
                line = self.line_queue.get(timeout=0.1)
            except queue.Empty:
                continue

            payload = {"type": "thinking", "message": line}
            asyncio.run_coroutine_threadsafe(
                run_manager.send(self.run_id, payload),
                self.loop,
            )
