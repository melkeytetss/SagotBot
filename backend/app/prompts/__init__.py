"""Prompts and persona presets package."""
from app.prompts.templates import get_receptionist_system_prompt
from app.prompts.personas import get_persona_config

__all__ = ["get_receptionist_system_prompt", "get_persona_config"]
