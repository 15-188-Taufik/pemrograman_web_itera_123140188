from sqlalchemy import Column, Integer, String, Text
from .meta import Base

class Course(Base):
    __tablename__ = 'courses'
    
    id = Column(Integer, primary_key=True)
    kode = Column(String(50), unique=True, nullable=False)
    nama = Column(String(255), nullable=False)
    sks = Column(Integer, default=3)
    deskripsi = Column(Text, nullable=True)

    def __repr__(self):
        return f'<Course: {self.kode} - {self.nama}>'