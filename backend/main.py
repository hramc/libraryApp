from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import JSONResponse

from database.conn import Base, engine
from endpoints import Books, Classes, Students, Transactions
from fastapi.middleware.cors import CORSMiddleware



# Create tables in the database
def create_tables():
    Base.metadata.create_all(bind=engine)


app = FastAPI(on_startup=[create_tables])


@app.get("/", response_class=JSONResponse)
async def read_root(request: Request):
    return {
        "message": "Welcome to the Library FAST API"
    }


app.include_router(Books.router)
app.include_router(Classes.router)
app.include_router(Students.router)
app.include_router(Transactions.router)

# -----------------------------
# Add CORS middleware here
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
