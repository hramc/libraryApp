
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


## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/library-app.git
cd library-app
```
### 2. Setup Backend (FastAPI + PostgreSQL)

1. Create and activate a virtual environment:
```
cd backend
python -m venv venv
source venv/bin/activate   # on macOS/Linux
venv\Scripts\activate      # on Windows
```
2. Install dependencies:
```
pip install fastapi uvicorn psycopg2 sqlalchemy alembic pydantic
```

3. Setup PostgreSQL and update your database.py with DB connection in the app.properties file
```
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost:5432/library"
```

4. Run Alembic migrations:
```
alembic upgrade head
```

5. Start FastAPI server:
```
uvicorn main:app --reload
```

Backend runs at: http://127.0.0.1:8000

### 3. Setup Frontend (React)

1. Install dependencies:
```
cd frontend
npm install
```

2. Start development server:
```
npm start
```

Frontend runs at: http://localhost:3000


