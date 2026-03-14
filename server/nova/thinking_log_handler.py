"""
Captures thinking log lines emitted by nova_act and puts them in a queue.

nova_act logs agent trace lines (e.g. `24df> think("...")`) via the
`nova_act.trace` logger using trace_log_lines(). This handler intercepts
them line-by-line.
"""

import logging
import queue


class ThinkingLogHandler(logging.Handler):
    """
    Attaches to the `nova_act.trace` logger and enqueues each message line.
    """

    LOGGER_NAME = "nova_act.trace"

    def __init__(self, line_queue: queue.Queue):
        super().__init__(level=logging.DEBUG)
        self.line_queue = line_queue

    def emit(self, record: logging.LogRecord):
        try:
            msg = record.getMessage()
            for line in msg.splitlines():
                line = line.strip()
                if line:
                    self.line_queue.put(line)
        except Exception:
            self.handleError(record)
