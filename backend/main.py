from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db, TravelPlan
from graph import recommend_node, select_node, itinerary_node, season_node

app = FastAPI(title="Travel Agent API")

# 💡 중요: 리액트(Port 5173 등)에서 오는 요청을 허용하기 위한 CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # 실무에서는 특정 도메인만 지정
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/test")
def read_root():
    return {"message": "백엔드 연결 성공!"}

# --- Pydantic 요청 스키마 ---
class PlanStartRequest(BaseModel):
    user_input: str

class CitySelectionRequest(BaseModel):
    selected_city: str

# --- API 엔드포인트 ---

@app.post("/api/plans/start")
def start_plan(req: PlanStartRequest, db: Session = Depends(get_db)):
    """[0단계 -> 1단계] 취향 입력 후 3곳 추천 받기"""
    # 1. DB에 새로운 여행 기록 생성
    new_plan = TravelPlan(user_input=req.user_input, current_step=1)
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    
    # 2. 랭그래프 Node 1 실행
    state = {"user_input": new_plan.user_input, "current_context": new_plan.user_input}
    res = recommend_node(state)
    
    # 3. 결과 DB 저장
    new_plan.step_1_res = res["current_context"]
    db.commit()
    
    return {
        "plan_id": new_plan.id,
        "current_step": 1,
        "step_1_res": new_plan.step_1_res
    }

@app.post("/api/plans/{plan_id}/select-city")
def select_city(plan_id: int, req: CitySelectionRequest, db: Session = Depends(get_db)):
    """[1단계 -> 2단계] 사용자가 장소 픽(Pick)한 후 핵심 활동 추천 받기"""
    plan = db.query(TravelPlan).filter(TravelPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
        
    plan.selected_city = req.selected_city
    plan.current_step = 2
    
    # 랭그래프 Node 2 실행
    state = {"selected_city": plan.selected_city}
    res = select_node(state)
    
    plan.step_2_res = res["current_context"]
    db.commit()
    return {"current_step": 2, "step_2_res": plan.step_2_res, "selected_city": plan.selected_city}

@app.post("/api/plans/{plan_id}/itinerary")
def get_itinerary(plan_id: int, db: Session = Depends(get_db)):
    """[2단계 -> 3단계] 일정 짜기"""
    plan = db.query(TravelPlan).filter(TravelPlan.id == plan_id).first()
    plan.current_step = 3
    
    # 랭그래프 Node 3 실행
    state = {"selected_city": plan.selected_city, "current_context": plan.step_2_res}
    res = itinerary_node(state)
    
    plan.step_3_res = res["current_context"]
    db.commit()
    return {"current_step": 3, "step_3_res": plan.step_3_res}

@app.post("/api/plans/{plan_id}/season")
def get_season(plan_id: int, db: Session = Depends(get_db)):
    """[3단계 -> 4단계] 날씨 분석 및 최종 완료"""
    plan = db.query(TravelPlan).filter(TravelPlan.id == plan_id).first()
    plan.current_step = 4
    
    # 랭그래프 Node 4 실행
    state = {"selected_city": plan.selected_city, "current_context": plan.step_3_res}
    res = season_node(state)
    
    plan.step_4_res = res["current_context"]
    db.commit()
    return {"current_step": 4, "step_4_res": plan.step_4_res}

@app.get("/api/plans/history")
def get_history(db: Session = Depends(get_db)):
    """[대시보드용] 사용자가 과거에 짰던 모든 여행 리스트 가져오기"""
    plans = db.query(TravelPlan).order_by(TravelPlan.created_at.desc()).all()
    return plans