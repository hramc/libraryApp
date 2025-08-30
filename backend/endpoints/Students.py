from http.client import HTTPException
from uuid import uuid4

from fastapi import Depends
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.conn import get_db

from fastapi import APIRouter

from dbmodels.Students import Students

router = APIRouter(prefix="/students", tags=["Students"])


class StudentCreate(BaseModel):
    name: str
    classId: str


class StudentRead(StudentCreate):
    id: str

    class Config:
        from_attributes = True


@router.post("/add", response_model=StudentRead)
def create_classes(student: StudentCreate, db: Session = Depends(get_db)):
    """Create a new item in the database."""
    db_student = Students(id=str(uuid4()), name=student.name, classId=student.classId)
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


@router.delete("/{student_id}", response_class=JSONResponse)
async def delete_class(student_id: str, db: Session = Depends(get_db)):
    """Retrieve a list of all classes."""
    student = db.query(Students).filter(Students.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Classes not found")

    db.delete(student)
    db.commit()
    return {"message": f"Student {student_id} deleted"}


@router.get("/", response_class=JSONResponse)
async def read_classes_page(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Retrieve a list of all students."""
    stmt = select(Students).offset(skip).limit(limit)
    students = db.scalars(stmt).all()
    students_json = [
        {"id": student.id, "name": student.name, "classId": student.classId}
        for student in students
    ]
    return students_json


@router.get("/all", response_class=JSONResponse)
async def read_classes_page( db: Session = Depends(get_db)):
    """Retrieve a list of all students."""
    stmt = select(Students)
    students = db.scalars(stmt).all()
    students_json = [
        {"id": student.id, "name": student.name, "classId": student.classId}
        for student in students
    ]
    return students_json


@router.get("/{classId}/all", response_class=JSONResponse)
async def read_classes_page(classId: str, db: Session = Depends(get_db)):
    """Retrieve a list of all students."""
    stmt = select(Students).filter(Students.classId == classId)
    students = db.scalars(stmt).all()
    students_json = [
        {"id": student.id, "name": student.name, "classId": student.classId}
        for student in students
    ]
    return students_json
