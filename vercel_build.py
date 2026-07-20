"""Build hook invoked by Vercel via pyproject.toml's [tool.vercel.scripts].build.

Builds the React app; app/main.py serves frontend/dist directly (see the
comment there for why we don't rely on Vercel's own public/ static routing).
"""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FRONTEND = ROOT / "frontend"


def main() -> None:
    subprocess.run(["npm", "install"], cwd=FRONTEND, check=True)
    subprocess.run(["npm", "run", "build"], cwd=FRONTEND, check=True)


if __name__ == "__main__":
    main()
