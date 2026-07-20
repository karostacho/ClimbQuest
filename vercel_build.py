"""Build hook invoked by Vercel via pyproject.toml's [tool.vercel.scripts].build.

Vercel's FastAPI framework detection treats this whole project as a single
Python function and serves anything under public/** as static assets, so
this builds the React app and copies its output there.
"""
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FRONTEND = ROOT / "frontend"
PUBLIC = ROOT / "public"


def main() -> None:
    subprocess.run(["npm", "install"], cwd=FRONTEND, check=True)
    subprocess.run(["npm", "run", "build"], cwd=FRONTEND, check=True)

    if PUBLIC.exists():
        shutil.rmtree(PUBLIC)
    shutil.copytree(FRONTEND / "dist", PUBLIC)


if __name__ == "__main__":
    main()
