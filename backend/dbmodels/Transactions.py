from sqlalchemy import Column, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from database.conn import Base


class Transactions(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True)
    classId = Column(String, ForeignKey("classes.id", ondelete="RESTRICT"))     # FK → STUDENT.id
    studentId = Column(String, ForeignKey("students.id", ondelete="RESTRICT"))  # FK → STUDENT.id
    bookId = Column(String, ForeignKey("books.id", ondelete="RESTRICT"))        # FK → BOOK.id
    borrowDate = Column(Date, nullable=False)
    returnDate = Column(Date, nullable=True)
    status = Column(String)

    # Relationships
    students = relationship("Students", back_populates="transactions")
    books = relationship("Books", back_populates="transactions")
    classes = relationship("Classes", back_populates="transactions")
