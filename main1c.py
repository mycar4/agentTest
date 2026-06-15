import streamlit as st
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from utils import llm_call

# ==========================================
# 1. 페이지 레이아웃 및 Streamlit 초기 세팅
# ==========================================
st.set_page_config(page_title="나만의 AI 여행 메이트", page_icon="🌤️", layout="wide")

# 세션 상태(Session State) 중앙 집중 관리
if "graph_state" not in st.session_state:
    st.session_state.graph_state = {
        "user_input": "",
        "current_context": "",
        "steps_history": {},
        "current_step": 0,
        "selected_city": "",  
        "recommended_cities": [] 
    }

g_state = st.session_state.graph_state

# 📍 좌측 사이드바에 현재 단계 실시간 매핑
with st.sidebar:
    st.header("📍 여행 계획 진행도")
    steps = ["취향 저격 여행지 찾기", "최적의 장소 선택 및 개입", "알찬 하루 일정 짜기", "꿀팁! 여행 시기 분석"]
    
    for i, step_name in enumerate(steps, 1):
        if g_state["current_step"] > i:
            st.write(f"✅ **단계 {i}: {step_name}**")
        elif g_state["current_step"] == i:
            st.write(f"🔵 **단계 {i}: {step_name}** (진행 중...)")
        else:
            st.write(f"⚪ 단계 {i}: {step_name}")
            
    st.write("---")
    if st.button(" 처음부터 다시 계획하기 ", use_container_width=True):
        st.session_state.graph_state = {
            "user_input": "", "current_context": "", "steps_history": {}, "current_step": 0, "selected_city": "", "recommended_cities": []
        }
        st.rerun()

st.title("✈️ 안녕! 어디로 떠나고 싶으신가요?")
st.caption("당신의 취향을 말해주시면, 세상에서 가장 설레는 여행 계획을 함께 만들어 드릴게요.")

# ==========================================
# 2. LangGraph 노드 정의 (구조화된 출력)
# ==========================================
def recommend_node(state: TypedDict):
    prompt = f"""사용자의 취향[{state['user_input']}]을 바탕으로 가기 좋은 추천 여행지 3곳을 선정해줘.
친구나 연인에게 말하듯 친절하고 다정한 말투로 각 지역의 특징을 설명해줘.

⚠️ [중요 요구사항 - 데이터 추출용]
답변 가장 마지막 줄에, 화면 UI 선택지에 띄울 '도시 이름' 딱 3개만 쉼표로 구분해서 정확히 적어줘. 
그리고 그 다음 줄에 AI가 생각하는 원픽 도시 하나를 적어줘.
(예시 형식):
CITIES:로마, 파리, 치앙마이
ONEPICK:치앙마이"""
    res = llm_call(prompt)
    
    cities = []
    one_pick = ""
    try:
        for line in res.split("\n"):
            if line.startswith("CITIES:"):
                cities = [c.strip() for c in line.replace("CITIES:", "").split(",")]
            if line.startswith("ONEPICK:"):
                one_pick = line.replace("ONEPICK:", "").strip()
    except:
        cities = ["로마", "파리", "치앙마이"]
        one_pick = "치앙마이"
        
    return {
        "current_context": res, 
        "steps_history": {"step_1": res},
        "recommended_cities": cities,
        "selected_city": one_pick 
    }

def select_node(state: TypedDict):
    prompt = f"우리가 최종 선택한 목적지는 바로 [{state['selected_city']}] 입니다! 이 도시가 왜 최고의 선택인지 설레는 문체로 지지해주고, 거기서 꼭 해야 할 핵심 액티비티 5가지를 골라줘."
    res = llm_call(prompt)
    return {"current_context": res, "steps_history": {"step_2": res}}

def itinerary_node(state: TypedDict):
    prompt = f"최종 목적지[{state['selected_city']}]에서의 완벽한 하루 일정을 오전/오후/저녁 동선에 맞춰 짜줘. 지치지 않게 맛집 투어와 휴식 타임도 센스 있게 넣어줘!"
    res = llm_call(prompt)
    return {"current_context": res, "steps_history": {"step_3": res}}

def season_node(state: TypedDict):
    prompt = f"이 여행 계획[{state['selected_city']}]의 날씨 꿀팁을 알려줘. 가기 가장 예쁜 골든 시즌과 피하면 좋을 날씨를 알려줘."
    res = llm_call(prompt)
    return {"current_context": res, "steps_history": {"step_4": res}}

# ⚙️ 뱅글뱅글 부드럽게 돌아가는 톱니바퀴 CSS 애니메이션 효과
st.html("""
<style>
@keyframes rotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.load-box { display: flex; align-items: center; background: #f0f7ff; padding: 15px; border-radius: 10px; color: #0056b3; font-weight: bold; margin: 10px 0; }
.gear { display: inline-block; animation: rotate 2s linear infinite; margin-right: 12px; font-size: 1.4rem; }
</style>
""")

# ==========================================
# 3. 메인 인터페이스 및 인간-AI 협업 제어 로직
# ==========================================

# --- [0단계: 취향 입력] ---
if g_state["current_step"] == 0:
    default_input = "나는 여름 휴가를 계획 중이야. 따뜻한 날씨를 좋아하고, 자연 경관과 역사적인 장소를 둘러보는 걸 좋아해.\n어떤 여행지가 나에게 적합할까?"
    user_input = st.text_area("📋 어떤 여행을 꿈꾸고 계신가요?", value=default_input, height=130)
    
    if st.button("여행 메이트와 시작하기 🚀", type="primary"):
        if user_input.strip():
            g_state["user_input"] = user_input
            g_state["current_context"] = user_input
            g_state["current_step"] = 1
            st.rerun()

# --- [1단계: 취향 저격 여행지 3곳 추천] ---
if g_state["current_step"] >= 1:
    with st.container(border=True):
        st.subheader("📍 당신의 취향에 딱 맞춘 추천 후보지 리스트")
        if "step_1" not in g_state["steps_history"]:
            with st.empty():
                st.html('<div class="load-box"><span class="gear">⚙️</span>당신의 취향을 분석해서 멋진 곳들을 찾고 있어요...</div>')
                res = recommend_node(g_state)
                g_state["steps_history"]["step_1"] = res["steps_history"]["step_1"]
                g_state["current_context"] = res["current_context"]
                g_state["recommended_cities"] = res["recommended_cities"]
                g_state["selected_city"] = res["selected_city"]
                st.rerun()
                
        display_text = g_state["steps_history"]["step_1"].split("CITIES:")[0]
        st.markdown(display_text)
        
        if g_state["current_step"] == 1:
            if st.button("음.. 다른 곳도 더 추천해줘 ♻️", type="secondary"):
                del g_state["steps_history"]["step_1"]
                st.rerun()

# --- [2단계 인터페이스: 장소 선택창] ---
if g_state["current_step"] >= 1: 
    if g_state["current_step"] == 1:
        with st.container(border=True):
            st.subheader("🎯 목적지 최종 확정하기")
            st.info("💡 아래 선택지 중 **가장 설레는 여행지**를 마우스로 콕 집어 선택해 주세요!")
            
            options = g_state["recommended_cities"] if g_state["recommended_cities"] else ["선택 안 됨"]
            default_idx = 0
            if g_state["selected_city"] in options:
                default_idx = options.index(g_state["selected_city"])
                
            click_choice = st.radio("어디로 떠나볼까요?", options, index=default_idx)
            etc_choice = st.text_input("✍️ 혹시 목록에 없는 다른 곳을 원하시면 여기에 직접 입력하셔도 돼요:")
            
            if st.button("이 장소로 최종 낙점! 다음 단계 진행 👉", type="primary"):
                final_decision = etc_choice.strip() if etc_choice.strip() else click_choice
                g_state["selected_city"] = final_decision
                g_state["current_step"] = 2
                st.rerun()

if g_state["current_step"] >= 2:
    st.success(f"✈️ 우리가 함께 고른 최종 목적지: **{g_state['selected_city']}**")

# --- [2단계 결과 출력 상태: 선정지 상세 분석] ---
if g_state["current_step"] >= 2:
    with st.container(border=True):
        st.subheader(f"🎯 [{g_state['selected_city']}] 매력 포인트와 핵심 활동")
        if "step_2" not in g_state["steps_history"]:
            with st.empty():
                st.html(f'<div class="load-box"><span class="gear">⚙️</span>AI 메이트가 {g_state["selected_city"]}의 매력 포인트를 정리 중이에요...</div>')
                res = select_node(g_state)
                g_state["steps_history"]["step_2"] = res["steps_history"]["step_2"]
                g_state["current_context"] = res["current_context"]
                st.rerun()
        st.markdown(g_state["steps_history"]["step_2"])
        
        if g_state["current_step"] == 2:
            col1, col2 = st.columns([1, 4])
            with col1:
                if st.button("좋아, 하루 일정 짜줘 📅", type="primary"):
                    g_state["current_step"] = 3
                    st.rerun()
            with col2:
                if st.button("◀ 장소 다시 고를래", type="secondary"):
                    del g_state["steps_history"]["step_2"]
                    g_state["current_step"] = 1
                    st.rerun()

# --- [3단계: 상세 일정 수립] ---
if g_state["current_step"] >= 3:
    with st.container(border=True):
        st.subheader("📅 당신만을 위한 완벽한 하루 동선")
        if "step_3" not in g_state["steps_history"]:
            with st.empty():
                st.html('<div class="load-box"><span class="gear">⚙️</span>시간대별로 알찬 동선과 꿀스팟을 그리고 있어요...</div>')
                res = itinerary_node(g_state)
                g_state["steps_history"]["step_3"] = res["steps_history"]["step_3"]
                g_state["current_context"] = res["current_context"]
                st.rerun()
        st.markdown(g_state["steps_history"]["step_3"])
        
        if g_state["current_step"] == 3:
            col1, col2 = st.columns([1, 4])
            with col1:
                if st.button("날씨나 여행 시기 팁도 알려줘 🌤️", type="primary"):
                    g_state["current_step"] = 4
                    st.rerun()
            with col2:
                if st.button("◀ 이전 안내 다시 볼래", type="secondary"):
                    del g_state["steps_history"]["step_3"]
                    g_state["current_step"] = 2
                    st.rerun()

# --- [4단계: 골든 시즌 및 다운로드/공유 활성화 공간] ---
if g_state["current_step"] >= 4:
    with st.container(border=True):
        st.subheader("🌤️ 놓치면 아쉬운 여행 시기 꿀팁")
        if "step_4" not in g_state["steps_history"]:
            with st.empty():
                st.html('<div class="load-box"><span class="gear">⚙️</span>언제 떠나야 가장 예쁜 하늘을 볼 수 있을지 분석 중이에요...</div>')
                res = season_node(g_state)
                g_state["steps_history"]["step_4"] = res["steps_history"]["step_4"]
                st.rerun()
        st.markdown(g_state["steps_history"]["step_4"])
        
        if g_state["current_step"] == 4:
            if st.button("📅 아까 짠 일정을 조금 수정할래 (이전으로)", type="secondary"):
                del g_state["steps_history"]["step_4"]
                g_state["current_step"] = 3
                st.rerun()
        
        st.balloons()
        st.success("✨ 드디어 우리만의 멋진 여행 계획이 완성되었어요! 행복하고 안전한 여행 되시길 바랄게요!")

    # ==========================================
    # 💡 [핵심 구현] 4단계 완료 시 하단에 웹 다운로드 & 공유 섹션 생성
    # ==========================================
    st.write("---")
    st.subheader("📥 작성된 여행 계획서 보관 및 공유하기")
    
    # 지금까지 축적된 모든 결과를 하나의 마크다운 텍스트로 합치기
    clean_step1 = g_state["steps_history"]["step_1"].split("CITIES:")[0]
    
    combined_plan_text = f"""# 🌤️ 나만의 맞춤형 여행 계획서 ({g_state['selected_city']})

## 📋 나의 원래 취향 및 희망사항
{g_state['user_input']}

---
## 📍 1. 추천 후보지 리스트
{clean_step1}

---
## 🎯 2. 최종 목적지 분석 및 핵심 추천 활동
{g_state['steps_history']['step_2']}

---
## 📅 3. 완벽한 하루 동선 및 일정
{g_state['steps_history']['step_3']}

---
## 🌤️ 4. 여행 추천 시기 및 현지 날씨 꿀팁
{g_state['steps_history']['step_4']}
"""

    # 가로로 두 개의 버튼 배치
    share_col1, share_col2 = st.columns(2)
    
    with share_col1:
        # 1. 사용자가 웹 브라우저에서 즉시 파일로 저장할 수 있는 다운로드 버튼 생성
        st.download_button(
            label="💾 내 컴퓨터/폰에 계획서 다운로드하기 (.md 파일)",
            data=combined_plan_text,
            file_name=f"나의여행계획서_{g_state['selected_city']}.md",
            mime="text/markdown",
            use_container_width=True,
            type="primary"
        )
        st.caption("※ 다운로드된 파일은 메모장이나 노션(Notion) 등에 복사해서 편하게 편집하실 수 있어요.")
        
    with share_col2:
        # 2. 카카오톡이나 SNS에 바로 복사해서 붙여넣을 수 있는 '전체 복사 영역' 활성화
        with st.expander("📋 클릭 한 번으로 전체 텍스트 복사 및 공유하기"):
            st.info("우측 상단의 복사(Copy) 아이콘을 누르면 전체 계획서가 복사되어 카카오톡 등에 바로 붙여넣을 수 있어요!")
            # st.code는 우측 상단에 브라우저 네이티브 'Copy' 단추를 자동으로 만들어 줍니다.
            st.code(combined_plan_text, language="markdown")