import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from read_properties import config

# Define your PostgreSQL connection details
# Format: "postgresql://<user>:<password>@<host>/<database_name>"
# Using environment variables is a best practice for security.
# Fallback to a default for local development.
DATABASE_URL = os.environ.get(
    "DATABASE_URL", config.get('DATABASE_URL')
)

# Create a SQLAlchemy engine
# The `pool_pre_ping` option is useful for long-running processes
# to ensure the connection is still valid.
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Create a configured "Session" class
# `autocommit=False` and `autoflush=False` give more control over transactions.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our models
Base = declarative_base()


def get_db():
    """
    A dependency that provides a database session for a single request.
    It automatically closes the session after the request is finished,
    even if an error occurs.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
