import streamlit as st
from utils import llm_call

# --- 1. 백엔드 로직 (라우터 워크플로우) ---
def run_router_workflow(user_prompt: str):
    router_prompt = f"""
    사용자의 프롬프트/질문: {user_prompt}

    각 모델은 서로 다른 기능을 가지고 있습니다. 사용자의 질문에 가장 적합한 모델을 선택하세요:
    - gpt-4o: 일반적인 작업에 가장 적합한 모델 (기본값)
    - gpt-3.5-turbo: 코딩 및 복잡한 문제 해결에 적합한 모델
    - gpt-4o-mini: 간단한 사칙연산 등의 작업에 적합한 모델
    
    모델명만 단답형으로 응답하세요 (예: gpt-4o)
    """
    
    selected_model = llm_call(router_prompt).strip()
    response = llm_call(user_prompt, model=selected_model)
    return selected_model, response

# --- 2. Streamlit 프론트엔드 (UI) ---
st.set_page_config(page_title="라우터 에이전트", page_icon="🔀", layout="wide")

st.title("🔀 지능형 라우터(Router) 에이전트")
st.caption("질문의 난이도와 유형을 스스로 분석하여, 가장 적합한 AI 모델에게 작업을 할당합니다.")

with st.sidebar:
    st.header("🤖 전문가 모델 라인업")
    st.info("**gpt-4o**\n\n일반적이고 포괄적인 작업 (기본 라우팅)")
    st.success("**gpt-3.5-turbo**\n\n코딩 및 복잡한 논리적 문제 해결")
    st.warning("**gpt-4o-mini**\n\n간단한 사칙연산 등 가벼운 작업")

user_input = st.text_area(
    "💬 질문을 입력하세요:", 
    placeholder="예) 1더하기 2는 뭐야? / 리스본 여행일정 짜줘 / 파이썬 API 서버 만들어줘",
    height=100
)

# 실행 버튼 및 결과 출력
if st.button("🚀 질문 전송", type="primary"):
    if not user_input.strip():
        st.warning("질문을 먼저 입력해 주세요.")
    else:
        # 로딩 스피너 사용: 작업이 끝나면 스피너는 사라지고 결과만 남습니다.
        with st.spinner("AI가 질문을 분석하고 답변을 생성 중입니다..."):
            try:
                selected_model, final_response = run_router_workflow(user_input)
                
                # 결과 즉시 표시
                st.success(f"🎯 **라우팅 완료:** `{selected_model}` 모델이 최적의 전문가로 선택되었습니다!")
                
                with st.container(border=True):
                    st.subheader(f"💡 답변 결과")
                    st.markdown(final_response)
                    
            except Exception as e:
                st.error(f"실행 중 문제가 발생했습니다: {e}")