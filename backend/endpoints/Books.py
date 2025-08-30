from http.client import HTTPException
from uuid import uuid4

from fastapi import Depends
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.conn import get_db
from dbmodels.Books import Books

from fastapi import APIRouter

router = APIRouter(prefix="/books", tags=["Users"])


class BookCreate(BaseModel):
    name: str
    author: str
    available: bool


class BookRead(BookCreate):
    id: str

    class Config:
        from_attributes = True


@router.post("/add", response_model=BookRead)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    """Create a new book in the database."""
    db_book = Books(id=str(uuid4()), name=book.name, author=book.author, available=book.available)
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


@router.get("/", response_class=JSONResponse)
async def read_books(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Retrieve a list of all books."""
    stmt = select(Books).offset(skip).limit(limit)
    books = db.scalars(stmt).all()
    books_json = [
        {"id": book.id, "name": book.name, "author": book.author, "available": book.available}
        for book in books
    ]
    return books_json

@router.get("/all", response_class=JSONResponse)
async def read_books(db: Session = Depends(get_db)):
    """Retrieve a list of all books."""
    stmt = select(Books)
    books = db.scalars(stmt).all()
    books_json = [
        {"id": book.id, "name": book.name, "author": book.author, "available": book.available}
        for book in books
    ]
    return books_json


@router.get("/availableBooks", response_class=JSONResponse)
async def read_available_books(db: Session = Depends(get_db)):
    """Retrieve a list of all books."""
    stmt = select(Books).filter(Books.available == True)
    books = db.scalars(stmt).all()
    books_json = [
        {"id": book.id, "name": book.name, "author": book.author, "available": book.available}
        for book in books
    ]
    return books_json


@router.post("/{book_id}/borrow", response_model=BookRead)
def borrow_book(book_id: int, db: Session = Depends(get_db)):
    """Retrieve a single item by its ID."""
    book = db.query(Books).filter(Books.id == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    book.available = False
    db.commit()
    db.refresh(book)
    return book


@router.post("/{book_id}/return", response_model=BookRead)
def return_book(book_id: int, db: Session = Depends(get_db)):
    """Retrieve a single item by its ID."""
    book = db.query(Books).filter(Books.id == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    book.available = True
    db.commit()
    db.refresh(book)
    return book


@router.get("/{book_id}", response_model=BookRead)
def read_book(book_id: int, db: Session = Depends(get_db)):
    """Retrieve a single item by its ID."""
    item = db.query(Books).filter(Books.id == book_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return item


@router.delete("/{book_id}", response_class=JSONResponse)
async def delete_book(book_id: str, db: Session = Depends(get_db)):
    """Retrieve a list of all classes."""
    book = db.query(Books).filter(Books.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    db.delete(book)
    db.commit()
    return {"message": f"Book {book_id} deleted"}
