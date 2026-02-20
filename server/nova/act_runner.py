from nova_act import NovaAct, Workflow, ActMetadata
from nova_act.tools.human.interface.human_input_callback import (
    ApprovalResponse, HumanInputCallbacksBase, UiTakeoverResponse,
)
from dotenv import load_dotenv
from typing import AsyncGenerator, Optional
import os

ENV_INITIALIZED = False

if not ENV_INITIALIZED:
    load_dotenv()
    ENV_INITIALIZED = True
    
KEY = os.getenv("NOVA_API_KEY")

if not KEY:
    raise ValueError("NOVA_API_KEY environment variable is not set")


class ActRunner:
    """Manages Nova Act agent execution with optional WebSocket integration."""
    
    def __init__(self, run_id: Optional[str] = None):
        """
        Initialize ActRunner.
        
        Args:
            run_id: Optional run ID for WebSocket-based approval integration
        """
        self.run_id = run_id
        self.nova = None
    
    @staticmethod
    def create_agent(
        url: str,
        context: str,
        human_callback: Optional[HumanInputCallbacksBase] = None
    ) -> NovaAct:
        """Create a Nova Act agent with optional human callback for approvals."""
        return NovaAct(
            api_key=KEY,
            starting_page=url,
            human_callback=human_callback,
            tools=['']
        )
    
    async def run_act(
        self,
        url: str,
        context: str,
        *steps: str
    ) -> AsyncGenerator[ActMetadata, None, None]:
        """
        Run Nova Act workflow with optional WebSocket-based approval handling.
        
        Args:
            url: Starting URL for the browser
            context: Agent context/instructions
            *steps: Variable number of steps/actions to execute
            
        Yields:
            ActMetadata for each step executed
        """
        # Import here to avoid circular imports
        if self.run_id:
            from nova.callbacks.stream_callback import StreamInputCallback
            human_callback = StreamInputCallback(self.run_id)
        else:
            human_callback = None
        
        agent = self.create_agent(url, context, human_callback=human_callback)
        self.nova = agent
        
        try:
            with agent:
                for step in steps:
                    res = agent.act(step)
                    yield res.metadata
        finally:
            self.nova = None
            
