import sys
from pathlib import Path

# Vercel imports this file via the dotted path "backend.api.index" from the
# repo root, so "backend/" itself isn't on sys.path the way it is locally
# (cwd=backend/ via `uvicorn app.main:app`). Add it here so every internal
# `from app.x import y` import elsewhere in the codebase keeps working
# unchanged.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import app  # noqa: E402

# Vercel's Python runtime discovers this module-level `app` object and serves
# it directly as an ASGI application; nothing else needs to happen here.
