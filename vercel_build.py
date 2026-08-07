"""Build hook invoked by Vercel via pyproject.toml's [tool.vercel.scripts].build.

Builds the React app; app/main.py serves frontend/dist directly (see the
comment there for why we don't rely on Vercel's own public/ static routing).
Also runs Alembic migrations as the release step - Vercel's build environment
has the same DATABASE_URL as the deployed function, and this is the only
release-stage hook available, so it's the natural place for it. alembic
upgrade head is a no-op when already current, so this is safe on every
deploy; a bad migration fails the build rather than shipping mismatched
app/schema code.
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FRONTEND = ROOT / "frontend"
BACKEND = ROOT / "backend"


def main() -> None:
    subprocess.run(["npm", "install"], cwd=FRONTEND, check=True)
    subprocess.run(["npm", "run", "build"], cwd=FRONTEND, check=True)
    subprocess.run([sys.executable, "-m", "alembic", "upgrade", "head"], cwd=BACKEND, check=True)


if __name__ == "__main__":
    main()
