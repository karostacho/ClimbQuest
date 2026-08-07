from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

# DATABASE_URL already points at Neon's pooled ("-pooler") endpoint, which is
# itself a PgBouncer-style proxy absorbing the "too many total connections"
# risk - so NullPool here was solving a problem we didn't have, at the cost
# of a fresh cross-region TCP+TLS+Postgres handshake on every single request
# (measured ~1.1-1.3s of the latency on DB-touching endpoints, vs ~0.18s for
# a no-op one). A small pool lets a warm serverless instance reuse real
# connections across requests instead of reconnecting from scratch each time;
# pool_size stays small since each Vercel function instance needs its own
# slice of Neon's pooler capacity. pool_pre_ping guards against a connection
# going stale while idle between requests.
#
# Tests point DATABASE_URL at sqlite:///:memory:, whose pool doesn't accept
# these Postgres/QueuePool-specific sizing kwargs.
_engine_kwargs: dict = {"pool_pre_ping": True}
if not settings.database_url.startswith("sqlite"):
    _engine_kwargs.update(pool_size=3, max_overflow=2, pool_recycle=300)

engine = create_engine(settings.database_url, **_engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass
