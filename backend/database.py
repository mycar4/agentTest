from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

import os

# 현재 스크립트 파일이 있는 디렉토리를 기준으로 절대 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'travel.db')}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class TravelPlan(Base):
    __tablename__ = "travel_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_input = Column(Text, nullable=False)
    selected_city = Column(String(100), default="")
    step_1_res = Column(Text, default="")
    step_2_res = Column(Text, default="")
    step_3_res = Column(Text, default="")
    step_4_res = Column(Text, default="")
    current_step = Column(Integer, default=0) # 0~4단계 상태 저장
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# DB 테이블 생성
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()