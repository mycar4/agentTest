from utils import llm_call

def run_router_workflow(user_prompt : str):
    
    name = '차성종'

    # 사용 가능한 모델 목록을 정의하여 안정성을 높입니다.
    VALID_MODELS = ["gpt-4o", "gpt-3.5-turbo", "gpt-4o-mini"]

    router_prompt = f"""
    사용자의 프롬프트/질문: {user_prompt}

    각 모델은 서로 다른 기능을 가지고 있습니다. 사용자의 질문에 가장 적합한 모델을 선택하세요:
    - gpt-4o: 일반적인 작업에 가장 적합한 모델 (기본값)
    - gpt-3.5-turbo: 코딩 및 복잡한 문제 해결에 적합한 모델
    - gpt-4o-mini: 간단한 사칙연산 등의 작업에 적합한 모델
    - {VALID_MODELS[0]}: 일반적인 작업에 가장 적합한 모델 (기본값)
    - {VALID_MODELS[1]}: 코딩 및 복잡한 문제 해결에 적합한 모델
    - {VALID_MODELS[2]}: 간단한 사칙연산 등의 작업에 적합한 모델
    
    모델명만 단답형으로 응답하세요
    """
    print(router_prompt)
    selected_model = llm_call(router_prompt)
    selected_model = llm_call(router_prompt).strip().replace("\"", "").replace("'", "")

    # LLM이 반환한 모델명이 유효한지 확인하고, 유효하지 않으면 기본값으로 대체합니다.
    if selected_model not in VALID_MODELS:
        print(f"경고: 라우터가 유효하지 않은 모델 '{selected_model}'을 반환했습니다. 기본 모델 '{VALID_MODELS[0]}'로 대체합니다.")
        selected_model = VALID_MODELS[0]

    print("선택한 모델", selected_model)
    response = llm_call(user_prompt, model = selected_model)
    print(response)
    print()
    return response

query1 = "1더하기 2는 뭐지?"
print(query1)
response = run_router_workflow(query1)


query2 = "리스본 여행일정을 짜줘"
print(query2)
response = run_router_workflow(query2)


query3 = "파이썬으로 API 웹서버를 만들어줘"
print(query3)
response = run_router_workflow(query3)




