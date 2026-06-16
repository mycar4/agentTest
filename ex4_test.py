import asyncio
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

async def fetch_llm_response(model, prompt):
    # ainvoke는 비동기 실행 메서드입니다.
    response = await model.ainvoke(prompt)
    return response.content

async def main():
    # 모델 초기화
    openai_model = ChatOpenAI(model="gpt-4o")
    gemini_model = ChatGoogleGenerativeAI(model="gemini-1.5-pro")
    
    prompt = "AI 에이전트의 미래에 대해 한 줄로 요약해줘."
    
    print("🚀 두 LLM에 동시에 요청을 보냅니다...")
    
    # asyncio.gather를 통해 두 API를 동시에 호출 (병렬 처리)
    results = await asyncio.gather(
        fetch_llm_response(openai_model, prompt),
        fetch_llm_response(gemini_model, prompt)
    )
    
    print(f"[OpenAI 결과]: {results[0]}")
    print(f"[Gemini 결과]: {results[1]}")

# 비동기 루프 실행
if __name__ == "__main__":
    asyncio.run(main())