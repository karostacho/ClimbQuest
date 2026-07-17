import logging

from fastapi import FastAPI

from app.routers import auth, routes

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="ClimbQuest API")

app.include_router(auth.router)
app.include_router(routes.router)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
