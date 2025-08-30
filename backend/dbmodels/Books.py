from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship

from database.conn import Base


class Books(Base):
    __tablename__ = "books"

    id = Column(String, primary_key=True)
    name = Column(String)
    author = Column(String)
    available = Column(Boolean)

    transactions = relationship("Transactions", back_populates="books")
