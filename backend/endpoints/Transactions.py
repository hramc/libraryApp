from http.client import HTTPException
from typing import Optional
from uuid import uuid4

from fastapi import Depends
from fastapi.responses import JSONResponse
from datetime import date
from sqlalchemy import select
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.conn import get_db

from fastapi import APIRouter

from dbmodels.Books import Books
from dbmodels.Transactions import Transactions
from logging_config import logger

router = APIRouter(prefix="/transactions", tags=["Users"])


class TransactionResponse(BaseModel):
    id: str
    classId: str
    bookId: str
    studentId: str
    borrowDate: Optional[date] = None
    returnDate: Optional[date] = None
    status: str

    class Config:
        from_attributes = True


class TransactionBorrow(BaseModel):
    classId: str
    bookId: str
    studentId: str
    borrowDate: date

    class Config:
        from_attributes = True


class TransactionReturn(BaseModel):
    id: str
    returnDate: date
    borrowDate: Optional[date] = None  # 👈 allow None

    class Config:
        from_attributes = True


@router.post("/borrow", response_model=TransactionResponse)
def borrow_book(transaction: TransactionBorrow, db: Session = Depends(get_db)):
    """Create a new item in the database."""
    try:
        db_borrow_transaction = Transactions(id=str(uuid4()), bookId=transaction.bookId,
                                             classId=transaction.classId,
                                             studentId=transaction.studentId,
                                             borrowDate=transaction.borrowDate,
                                             status="Borrowed")
        db.add(db_borrow_transaction)
        book = db.query(Books).filter(Books.id == transaction.bookId).first()
        if book is None:
            raise HTTPException(status_code=404, detail="Book not found")
        book.available = False
        db.commit()
        db.refresh(db_borrow_transaction)
        return db_borrow_transaction
    except Exception as e:
        db.rollback()
        raise


@router.post("/return", response_model=TransactionResponse)
def return_book(transaction: TransactionReturn, db: Session = Depends(get_db)):
    """Create a new item in the database."""
    try:
        db_return_transaction = db.query(Transactions).filter(Transactions.id == transaction.id).first()
        if not db_return_transaction:
            return None
        db_return_transaction.returnDate = transaction.returnDate
        db_return_transaction.status = "Returned"  # ✅ modify attribute
        book = db.query(Books).filter(Books.id == db_return_transaction.bookId).first()
        if book is None:
            raise HTTPException(status_code=404, detail="Book not found")
        book.available = True
        db.commit()
        db.refresh(db_return_transaction)
        return db_return_transaction
    except Exception as e:
        db.rollback()
        raise


@router.delete("/{transaction_id}", response_class=JSONResponse)
async def delete_transaction(transaction_id: str, db: Session = Depends(get_db)):
    """Retrieve a list of all classes."""
    try:
        transaction = db.query(Transactions).filter(Transactions.id == transaction_id).first()
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        book = db.query(Books).filter(Books.id == transaction.bookId).first()
        if book is None:
            raise HTTPException(status_code=404, detail="Book not found")
        book.available = True

        db.delete(transaction)
        db.commit()
        return {"message": f"Student {transaction_id} deleted"}
    except Exception as e:
        db.rollback()
        raise


@router.get("/generateReports", response_class=JSONResponse)
async def generatereports(classId: Optional[str] = None,
                          bookId: Optional[str] = None,
                          studentId: Optional[str] = None,
                          skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Create a new item in the database."""
    try:
        filters = []

        if classId and classId != "":
            filters.append(Transactions.classId == classId)

        if studentId and studentId != "":
            filters.append(Transactions.studentId == studentId)

        if bookId and bookId != "":
            filters.append(Transactions.bookId == bookId)
        stmt = select(Transactions)
        if filters:
            stmt = stmt.where(*filters)
        stmt = stmt.offset(skip).limit(limit)
        db_return_transaction = db.execute(stmt).scalars().all()
        db_return_transaction_json = [
            {"id": transaction.id, "classId": transaction.classId, "bookId": transaction.bookId,
             "studentId": transaction.studentId,
             "borrowDate": transaction.borrowDate, "returnDate": transaction.returnDate,
             "status": transaction.status}
            for transaction in db_return_transaction
        ]
        return db_return_transaction_json
    except Exception as e:
        db.rollback()
        raise


@router.get("/{student_id}", response_class=JSONResponse)
async def read_by_student(student_id: str, db: Session = Depends(get_db)):
    """Retrieve a list of all transaction for an student."""
    stmt = select(Transactions).filter(Transactions.studentId == student_id)
    transactions = db.scalars(stmt).all()
    transactions_json = [
        {"id": transaction.id, "classId": transaction.classId, "bookId": transaction.bookId,
         "studentId": transaction.studentId,
         "borrowDate": transaction.borrowDate, "returnDate": transaction.returnDate,
         "status": transaction.status}
        for transaction in transactions
    ]
    return transactions_json


@router.get("/{class_id}/borrow", response_class=JSONResponse)
async def read_by_class_borrow(class_id: str, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Retrieve a list of all transaction for an student."""
    stmt = (select(Transactions).filter(Transactions.classId == class_id, Transactions.status == "Borrowed")
            .offset(skip).limit(limit))
    transactions = db.scalars(stmt).all()
    transactions_json = [
        {"id": transaction.id, "classId": transaction.classId, "bookId": transaction.bookId,
         "studentId": transaction.studentId,
         "borrowDate": transaction.borrowDate, "returnDate": transaction.returnDate,
         "status": transaction.status}
        for transaction in transactions
    ]
    return transactions_json
