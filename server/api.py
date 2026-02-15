from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from nova_act import NovaAct

# Import route modules
from routes import browser, interactions, files
from models.schemas import ActResponse

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
app.include_router(browser.router)
app.include_router(interactions.router)
app.include_router(files.router)


@app.get("/health", response_model=dict)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Nova Flow API",
        "version": "1.0.0"
    }


@app.get("/", response_model=dict)
async def root():
    """API root endpoint with information"""
    return {
        "name": "Nova Flow API",
        "description": "Browser automation powered by Amazon Nova Act",
        "docs": "/docs",
        "endpoints": {
            "browser": "/api/browser",
            "interactions": "/api/interact",
            "files": "/api/files",
            "health": "/health"
        }
    }


def start_server():
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
