from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import NullPool

from app.config import settings

# NullPool: each Vercel function instance would otherwise hold a persistent
# QueuePool (5 + 10 overflow) of connections; with serverless scaling that
# quickly exhausts Postgres's connection limit. NullPool opens one connection
# per request and closes it immediately after, which is the standard
# approach for serverless without a separate connection pooler (e.g.
# PgBouncer / Neon's own pooled endpoint) in front of the database.
engine = create_engine(settings.database_url, poolclass=NullPool)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass
