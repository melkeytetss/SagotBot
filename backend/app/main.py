"""SagotBot FastAPI Application Entry Point."""

from contextlib import asynccontextmanager
import logging
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.routers.voice import router as voice_router

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("sagotbot")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    logger.info(f"Starting SagotBot voice backend for '{settings.BUSINESS_NAME}'...")
    logger.info(f"Environment: {settings.ENVIRONMENT} | Twilio Validation: {settings.TWILIO_VALIDATE_SIGNATURE}")
    yield
    logger.info("Shutting down SagotBot voice backend.")


app = FastAPI(
    title="SagotBot AI Voice Receptionist API",
    description="Production-ready AI Phone Receptionist system for Philippine SMEs.",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(voice_router)


@app.get("/health", tags=["System Health"])
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": "SagotBot AI Voice Receptionist",
        "business_name": settings.BUSINESS_NAME,
        "business_type": settings.BUSINESS_TYPE,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
