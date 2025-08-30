
# 📚 Library Management App

This is a simple **Library Management Application** built using:

- **FastAPI** (backend API)
- **React.js** (frontend UI)
- **PostgreSQL** (database)
- **SQLAlchemy + Alembic** (ORM + migrations)

The app allows you to:
- Store and manage books in a PostgreSQL database
- Fetch and display books in a React frontend
- Extend functionality with transactions (borrow/return with `returnDate`)

---

## 🚀 Features
- Backend REST API with **FastAPI**
- Database models & migrations with **SQLAlchemy + Alembic**
- PostgreSQL integration
- React frontend to **fetch & display books**
- Error handling and validations

## Prerequisites

### 1. Install Docker Desktop

- Windows: Download here https://www.docker.com/products/docker-desktop  and install.
- Make sure WSL2 integration is enabled.
- macOS: Download here https://www.docker.com/products/docker-desktop and install.

After installation, verify with:
    ``` bash
    docker --version
    docker compose version
    ```
Both should return a version number.

## Running the App with Docker

### 1. Clone the Repository
```bash
git clone https://github.com/hramc/libraryApp.git
cd libraryApp
```

### 2. Build and start containers

#### 1. Create and activate a virtual environment:
```
docker compose up --build
```

This will start:

- postgres_db → Postgres database 
- fastapi_backend → FastAPI backend (http://localhost:8000)
- react_frontend → React frontend served by Nginx (http://localhost:3000)

#### 2. Access the services
   - Frontend → http://localhost:3000
   - Backend API docs (Swagger UI) → http://localhost:8000/docs
   - Database (optional) → Connect using any client at:
   
#### 3. Access the services
- Frontend → http://localhost:3000
- Backend API docs (Swagger UI) → http://localhost:8000/docs
- Database (optional) → Connect using any client at:

```
Host: localhost
Port: 5432
User: admin
Password: admin
Database: librarydb
```

### Stopping the App
To stop containers but keep data:
```
docker compose down
```
To stop and remove all data (fresh start):
```
docker compose down -v
```
### Useful Commands

Rebuild containers after code changes:
```
docker compose up --build
```

Check container logs:
```
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

Access DB inside container:
```
docker exec -it postgres_db psql -U admin -d librarydb
```

Setup PostgreSQL and update your database.py with DB connection in the app.properties file
```
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost:5432/library"
```

Run Alembic migrations:
```
alembic upgrade head
```
