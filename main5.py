import streamlit as st
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. 페이지 설정 및 제목
st.set_page_config(page_title="AI 요약 에이전트 (Evaluator-Optimizer)", layout="wide")
st.title("🤖 루프형 AI 요약 에이전트")
st.caption("Evaluator-Optimizer 패턴을 활용하여 피드백을 반영하며 최적의 요약을 생성합니다.")

# 2. 사이드바 - API 키 및 설정
with st.sidebar:
    st.header("⚙️ 설정")
    openai_api_key = st.text_input("OpenAI API Key", type="password")
    max_retries = st.slider("최대 재시도 횟수 (Max Retries)", min_value=1, max_value=5, value=3)
    
    st.markdown("---")
    st.markdown("### 💡 작동 원리 (Anthropic 가이드)")
    st.markdown("""
    1. **Generator(gpt-4o-mini)**가 요약본 생성
    2. **Evaluator(gpt-4o)**가 기준에 따라 평가
    3. **PASS**면 즉시 종료 및 최종 출력
    4. **FAIL**이면 피드백을 기억하여 재도전
    """)

# 3. LLM 호출 헬퍼 함수
def llm_call(prompt: str, model_name: str, api_key: str) -> str:
    """LangChain을 이용한 LLM 호출 함수"""
    try:
        llm = ChatOpenAI(model=model_name, openai_api_key=api_key, temperature=0.3)
        chain = ChatPromptTemplate.from_template("{input}") | llm | StrOutputParser()
        return chain.invoke({"input": prompt})
    except Exception as e:
        return f"Error: API 호출 중 오류가 발생했습니다. ({str(e)})"

# 4. 메인 화면 - 입력 UI
col1, col2 = st.columns([1, 1])

with col1:
    st.subheader("📰 기사 원문 입력")
    default_article = """오픈AI가 몇 주 안에 새로운 모델인 'GPT-4.5'를 출시하며 분산돼 있던 생성형 인공지능(AI) 모델을 통합키로 했다. 추론용 모델인 'o' 시리즈를 정리하고 비(非)추론 모델인 'GPT' 시리즈로 합칠 예정이다.
13일 업계에 따르면 샘 알트먼 오픈AI 최고경영자(CEO)는 지난 12일 자신의 X(옛 트위터)에 'GPT-4.5'를 조만간 출시할 것이라고 밝혔다. 현 세대인 'GPT-4o'의 뒤를 잇는 마지막 '비추론 AI'로, 내부적으로는 '오라이언(Orion)'이라고 불렸다.
현재 챗GPT 이용자를 비롯한 오픈AI의 고객들은 'GPT-4o', 'o1', 'o3-미니', 'GPT-4' 등 모델들을 각자 선택해 활용하고 있다. 최신 모델은 'GPT-4'를 개선한 'GPT-4o'로, 'GPT-4'는 2023년 하반기, 'GPT-4o'는 2024년 상반기 출시됐다.
오픈AI는 'GPT-5'도 지난해 공개하려고 했으나, 예상보다 저조한 성과를 거둬 출시가 연기된 상태다. 이에 그간 연산 시간을 늘려 성능을 높인 'o'시리즈 추론 모델을 새롭게 내세웠다.
샘 알트먼 CEO는 "이후 공개될 'GPT-5'부터는 추론 모델인 'o'시리즈와 'GPT'를 통합하겠다"며 "모델과 제품라인이 복잡해졌음을 잘 알고 있고, 앞으로는 각 모델을 선택해 사용하기보다 그저 잘 작동하길 원한다"고 말했다."""
    
    input_article = st.text_area("요약할 기사 내용을 입력하세요.", value=default_article, height=350)

with col2:
    st.subheader("📋 평가 기준 (Prompt)")
    evaluator_prompt = st.text_area(
        "평가자 프롬프트 (수정 가능)", 
        value="""다음 요약을 평가하십시오:

## 평가기준
1. 핵심 내용 포함 여부 
   - 원문의 핵심 개념과 논리적 흐름이 유지되어야 합니다.  
   - 원문의 중요 개념 15% 이상이 빠졌다면 FAIL입니다.  

2. 정확성 & 의미 전달  
   - 숫자, 인명, 날짜 등 객관적 정보가 틀리면 FAIL입니다.  

3. 간결성 및 가독성  
   - 문장이 과하게 길거나 반복적이면 감점 요인입니다.  

4. 문법 및 표현  
   - 맞춤법, 띄어쓰기 오류가 5개 이상이면 FAIL입니다.  

## 평가결과 응답예시  
- 모든 기준이 충족되었으면 "평가결과 = PASS"를 출력하세요.
- 수정이 필요한 경우, 구체적인 문제점을 지적하고 반드시 개선 방향을 제시하세요.    
- 중대한 오류가 있다면 "평가결과 = FAIL"을 출력하고, 반드시 주요 문제점을 설명하세요.  
요약 결과 :
""", height=350)

# 5. 실행 버튼 및 워크플로우 진행
if st.button("🚀 에이전트 루프 시작", type="primary"):
    if not openai_api_key:
        st.error("🔑 사이드바에 OpenAI API Key를 입력해주세요!")
    elif not input_article.strip():
        st.error("📝 기사 내용을 입력해주세요!")
    else:
        st.subheader("🔄 에이전트 실행 과정 (소스 단위 및 로그)")
        
        # 초기 쿼리 세팅
        user_query = f"당신의 목표는 주어진 기사를 요약하는 것입니다.\n아래 주어진 기사 내용을 요약해주세요.\n이전 시도의 요약과 피드백이 있다면, 이를 반영하여 개선된 요약을 작성하세요.\n\n기사 내용: \n{input_article}"
        
        retries = 0
        final_summary = ""
        success = False
        
        # 루프 시각화 플래그 및 컨테이너
        while retries < max_retries:
            retries += 1
            
            # Streamlit Expander를 활용해 차수별 진행상황을 접고 펼칠 수 있게 구성
            with st.expander(f"⏳ [시도 {retries}/{max_retries}] 에이전트 최적화 진행 단계", expanded=True):
                
                # ----------------------------------------
                # [단계 1] 요약 생성 프롬프트 송신
                st.markdown("#### 📥 [단계 1] 요약기(Generator) 입력 프롬프트")
                st.code(user_query, language="text")
                
                # 요약 호출 (gpt-4o-mini)
                with st.spinner("요약 생성 중... (gpt-4o-mini)"):
                    summary = llm_call(user_query, model_name="gpt-4o-mini", api_key=openai_api_key)
                
                st.markdown("#### 📤 [단계 2] 생성된 요약 결과")
                st.info(summary)
                
                # ----------------------------------------
                # [단계 3] 평가 프롬프트 조립 및 송신
                final_evaluator_prompt = evaluator_prompt + "\n" + summary
                st.markdown("#### 🔍 [단계 3] 평가기(Evaluator) 입력 프롬프트")
                st.code(final_evaluator_prompt, language="text")
                
                # 평가 호출 (gpt-4o)
                with st.spinner("평가 및 검증 중... (gpt-4o)"):
                    evaluation_result = llm_call(final_evaluator_prompt, model_name="gpt-4o", api_key=openai_api_key)
                
                st.markdown("#### 📊 [단계 4] 평가 결과 및 피드백")
                
                # 결과에 따른 시각적 분기
                if "평가결과 = PASS" in evaluation_result:
                    st.success(evaluation_result)
                    st.toast(f"{retries}차 시도 만에 승인 완료!", icon="✅")
                    final_summary = summary
                    success = True
                    break
                else:
                    st.warning(evaluation_result)
                    st.error(f"🔄 기준 미달로 인해 재시도를 준비합니다. ({retries}/{max_retries})")
                
                # 다음 루프를 위한 피드백 축적 (컨텍스트 업데이트)
                user_query += f"\n\n[{retries}차 요약 결과]\n{summary}"
                user_query += f"\n\n[{retries}차 요약 피드백]\n{evaluation_result}\n"
                
        # 6. 최종 결과 출력
        st.markdown("---")
        if success:
            st.balloons()
            st.subheader("🏆 최종 승인된 요약 결과")
            st.success(final_summary)
        else:
            st.subheader("❌ 최대 재시도 횟수 도달 (최종 요약본)")
            st.warning(summary)