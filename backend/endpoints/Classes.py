from http.client import HTTPException
from uuid import uuid4

from fastapi import Depends
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.conn import get_db
from dbmodels.Classes import Classes

from fastapi import APIRouter

from dbmodels.Students import Students
from dbmodels.Transactions import Transactions

router = APIRouter(prefix="/classes", tags=["Users"])


class ClassesCreate(BaseModel):
    name: str
    teacherName: str


class ClassesRead(ClassesCreate):
    id: str

    class Config:
        from_attributes = True


@router.post("/add", response_model=ClassesRead)
def create_classes(classes: ClassesCreate, db: Session = Depends(get_db)):
    """Create a new class in the database."""
    db_classes = Classes(id=str(uuid4()), name=classes.name, teacherName=classes.teacherName)
    db.add(db_classes)
    db.commit()
    db.refresh(db_classes)
    return db_classes


@router.get("/", response_class=JSONResponse)
async def read_classes_page(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Retrieve a list of all classes."""
    stmt = select(Classes).offset(skip).limit(limit)
    classes = db.scalars(stmt).all()
    classes_json = [
        {"id": class_item.id, "name": class_item.name, "teacherName": class_item.teacherName}
        for class_item in classes
    ]
    return classes_json


@router.get("/all", response_class=JSONResponse)
async def read_classes_page(db: Session = Depends(get_db)):
    """Retrieve a list of all classes."""
    stmt = select(Classes)
    classes = db.scalars(stmt).all()
    classes_json = [
        {"id": class_item.id, "name": class_item.name, "teacherName": class_item.teacherName}
        for class_item in classes
    ]
    return classes_json


@router.delete("/{class_id}", response_class=JSONResponse)
async def delete_class(class_id: str, db: Session = Depends(get_db)):
    """Retrieve a list of all classes."""
    classes = db.query(Classes).filter(Classes.id == class_id).first()
    if not classes:
        raise HTTPException(status_code=404, detail="Classes not found")

    db.delete(classes)
    db.commit()
    return {"message": f"Class {class_id} deleted"}


@router.get("/{class_id}/students", response_class=JSONResponse)
async def read_classes_page(class_id: str, db: Session = Depends(get_db)):
    """Retrieve a list of all classes."""
    stmt = select(Students).filter(Students.classId == class_id)
    students = db.scalars(stmt).all()
    students_json = [
        {"id": student.id, "name": student.name, "classId": student.classId}
        for student in students
    ]
    return students_json


@router.get("/{class_id}/students/transactions", response_class=JSONResponse)
async def read_classes_page(class_id: str, db: Session = Depends(get_db)):
    """Retrieve a list of all classes."""
    stmt = select(Students).filter(Students.classId == class_id)
    students = db.scalars(stmt).all()
    for student in students:
        student_stmt = select(Transactions).filter(Transactions.studentId == student.id,
                                                   Transactions.status == "Borrowed")
        transactions = db.scalars(student_stmt).all()

    transactions_json = [
        {"id": transaction.id, "bookId": transaction.bookId, "studentId": transaction.studentId,
         "borrowDate": transaction.borrowDate, "returnDate": transaction.returnDate,
         "status": transaction.status}
        for transaction in transactions
    ]
    return transactions_json
