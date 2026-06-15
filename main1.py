import streamlit as st
from utils import llm_call

# 1. 페이지 레이아웃 및 제목 설정
st.set_page_config(page_title="AI 여행 플래너 에이전트", page_icon="✈️", layout="wide")



st.title("✈️ 프롬프트 체이닝 여행 플래너 에이전트")
st.caption("사용자의 취향을 분석하여 맞춤형 여행지 추천부터 하루 일정까지 단계별(Chaining)로 수립합니다.")

# 2. 사이드바 - 프롬프트 체인 구조 시각화 (사용자에게 처리 과정 인지용)
with st.sidebar:
    st.header("⚙️ 에이전트 워크플로우")
    st.info("**단계 1:** 맞춤형 여행지 3곳 추천")
    st.info("**단계 2:** 최적의 여행지 1곳 선정 및 활동 5가지 추천")
    st.info("**단계 3:** 선정된 여행지의 상세 하루 일정 계획")
    st.info("**단계 4:** 선정된 여행지의 추천 시기")


# 3. 사용자 입력 공간 (텍스트 에어리어 제공)
default_input = "나는 여름 휴가를 계획 중이야. 따뜻한 날씨를 좋아하고, 자연 경관과 역사적인 장소를 둘러보는 걸 좋아해.\n어떤 여행지가 나에게 적합할까?"
user_input = st.text_area("📋 나의 여행 취향 및 희망사항을 입력하세요:", value=default_input, height=120)

# 4. 에이전트 실행 버튼
if st.button("🚀 여행 계획 시작하기", type="primary"):
    if not user_input.strip():
        st.warning("여행 취향을 입력해 주세요!")
    else:
        # 프롬프트 체인 정의 (원본 소스 로직 그대로 유지)
        prompt_chain = [
            """사용자의 여행 취향을 바탕으로 적합한 여행지 3곳을 추천하세요. 
- 먼저 사용자가 입력한 희망사항을 요약해줘
- 사용자가 입력한 희망사항을 반영해서 왜 적합한 여행지인지 설명해주세요
- 각 여행지의 기후, 주요 관광지, 활동 등을 설명하세요.""",

            """다음 여행지 3곳 중 하나를 선택하세요. 선택한 여행지 알려주세요. 그리고 선택한 이유를 설명해주세요.
- 해당 여행지에서 즐길 수 있는 주요 활동 5가지를 나열하세요. 
- 활동은 자연 탐방, 역사 탐방, 음식 체험 등 다양한 범주에서 포함되도록 하세요.""",

            """사용자가 하루 동안 이 여행지에서 시간을 보낼 계획입니다. 
- 오전, 오후, 저녁으로 나누어 일정을 짜고, 각 시간대에 어떤 활동을 하면 좋을지 설명하세요.""",

    ## 언제 가는게 좋을지 알려주
            """해당 여행을 가는 시기에 대해서 추천해줄 예정입니다. 
- 여행은 4계절 모든 것이 다릅니다. 해당 여행지에 좋은 시기와 최악의 시기를 찾아서 설명하세요.""",

        ]

        # 워크플로우 2번 로직 구현 시작
        response = user_input
        
        # 단계별 UI 컴포넌트를 미리 생성하여 시각적 효과 부여
        for i, prompt in enumerate(prompt_chain, 1):
            # 대형 박스 형태로 각 단계 UI 생성
            with st.container(border=True):
                st.subheader(f"🔄 단계 {i} 진행 중...")
                
                # 프롬프트 디버깅용 확장 레이아웃 (접어두기 기능)
                with st.expander(f"👁️ 단계 {i} 송신 프롬프트 보기"):
                    final_prompt = f"{prompt}\n\n🔹 문맥(Context):\n{response}\n🔹 사용자 입력: {user_input}"
                    st.code(final_prompt)
                
                # 로딩 애니메이션 실행 및 LLM 호출
                with st.spinner("AI 에이전트가 생각하고 있습니다..."):
                    try:
                        final_prompt = f"{prompt}\n\n🔹 문맥(Context):\n{response}\n🔹 사용자 입력: {user_input}"
                        response = llm_call(final_prompt)
                        
                        # 화면에 최종 응답 깔끔하게 출력
                        st.markdown("### ✨ 에이전트 응답")
                        st.markdown(response)
                        
                    except Exception as e:
                        st.error(f"오류가 발생했습니다: {e}")
                        st.stop()
                        
        st.success("🎉 모든 단계의 여행 계획 수립이 성공적으로 완료되었습니다!")