from typing_extensions import TypedDict
from utils import llm_call

# ==========================================
# LangGraph 및 백엔드 연동을 위한 간결한 노드 정의
# ==========================================

def recommend_node(state: dict):
    """[단계 1] 사용자의 취향을 분석하여 여행지 3곳을 추천합니다."""
    prompt = f"""사용자의 취향[{state.get('user_input', '')}]을 바탕으로 가기 좋은 추천 여행지 3곳을 선정해줘.
친구나 연인에게 말하듯 친절하고 다정한 말투로 각 지역의 특징을 설명해줘.

⚠️ [중요 요구사항 - 데이터 추출용]
답변 가장 마지막 줄에, 화면 UI 선택지에 띄울 '도시 이름' 딱 3개만 쉼표로 구분해서 정확히 적어줘. 
그리고 그 다음 줄에 AI가 생각하는 원픽 도시 하나를 적어줘.
(예시 형식):
CITIES:로마, 파리, 치앙마이
ONEPICK:치앙마이"""
    
    res = llm_call(prompt)
    return {"current_context": res}

def select_node(state: dict):
    """[단계 2] 확정된 도시의 매력 포인트와 핵심 활동을 도출합니다."""
    prompt = f"우리가 최종 선택한 목적지는 바로 [{state.get('selected_city', '')}] 입니다! 이 도시가 왜 최고의 선택인지 설레는 문체로 지지해주고, 거기서 꼭 해야 할 핵심 액티비티 5가지를 골라줘."
    res = llm_call(prompt)
    return {"current_context": res}

def itinerary_node(state: dict):
    """[단계 3] 완벽한 하루 일정을 수립합니다."""
    prompt = f"최종 목적지[{state.get('selected_city', '')}]에서의 완벽한 하루 일정을 오전/오후/저녁 동선에 맞춰 짜줘. 지치지 않게 맛집 투어와 휴식 타임도 센스 있게 넣어줘!"
    res = llm_call(prompt)
    return {"current_context": res}

def season_node(state: dict):
    """[단계 4] 추천 여행 시기 및 날씨 꿀팁을 분석합니다."""
    prompt = f"이 여행 계획[{state.get('selected_city', '')}]의 날씨 꿀팁을 알려줘. 가기 가장 예쁜 골든 시즌과 피하면 좋을 날씨를 알려줘."
    res = llm_call(prompt)
    return {"current_context": res}