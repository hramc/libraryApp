from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from database.conn import Base


class Students(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True)
    name = Column(String)
    classId = Column(String, ForeignKey("classes.id", ondelete="RESTRICT"))  # FK → CLASSES.id

    # Relationship back
    classes = relationship("Classes", back_populates="students")
    transactions = relationship("Transactions", back_populates="students")
