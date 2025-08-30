from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from database.conn import Base


class Classes(Base):
    __tablename__ = "classes"

    id = Column(String, primary_key=True)
    name = Column(String)
    teacherName = Column(String)

    # One-to-many: one class has many students
    students = relationship("Students", back_populates="classes")
    transactions = relationship("Transactions", back_populates="classes")
