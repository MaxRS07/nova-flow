from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import os
from websocket_manager import router as ws_router, run_manager
from nova.process_manager import process_manager
from nova.act_runner import ActRunner


# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Nova Flow API starting up...")
    print("📚 Routes available at /docs")
    yield
    # Shutdown
    print("🛑 Nova Flow API shutting down...")

app = FastAPI(
    title="Nova Flow API",
    description="Browser automation API powered by Amazon Nova Act",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route modules
app.include_router(ws_router)

@app.get("/", response_model=dict)
async def root():
    """API root endpoint with information"""
    return {
        "name": "Nova Flow API",
        "description": "Browser automation powered by Amazon Nova Act",
        "docs": "/docs",
        "websocket": "ws://localhost:8000/ws/{client_id}",
        "endpoints": {
            "websocket": "ws://{host}:{port}/ws/{client_id} - Bidirectional streaming for approvals and task updates"
        }
    }

@app.post("/start-act", response_model=dict)
async def start_act(data: dict):
    """
    Start a new Nova Act run.
    Returns a run_id — connect to ws/run/{run_id} to stream events.
    """
    url = data.get("url", "")
    context = data.get("context", "")
    steps = data.get("steps", [])

    run_id = run_manager.create_run()

    async def _run():
        try:
            await run_manager.emit(run_id, "status", {"status": "started"})
            runner = ActRunner(run_id=run_id)
            async for metadata in runner.run_act(url, context, *steps):
                await run_manager.emit(run_id, "step_complete", {
                    "prompt": metadata.prompt,
                    "num_steps": metadata.num_steps_executed,
                })
            await run_manager.emit(run_id, "status", {"status": "completed"})
            process_manager.mark_done(run_id, "completed")
        except asyncio.CancelledError:
            await run_manager.emit(run_id, "status", {"status": "cancelled"})
            process_manager.mark_done(run_id, "cancelled")
        except Exception as e:
            await run_manager.emit(run_id, "status", {"status": "error", "error": str(e)})
            process_manager.mark_done(run_id, "error")

    task = asyncio.create_task(_run())
    process_manager.register(run_id, task, {"url": url, "steps": steps})
    run_manager.register_task(run_id, task)

    return {"run_id": run_id }


def start_server():
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
