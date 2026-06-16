# 파이썬으로 AI 에이전트 만들기



## 사전 준비
1. [OpenAI 키 발급받기](https://github.com/ai-edu-pro/guides/blob/main/python-set-venv.md)
2. [파이썬 가상환경 설정](https://github.com/ai-edu-pro/guides/blob/main/python-set-venv.md)
   * `uv`를 활용한 가상환경 생성 및 활성화 (Python 3.12 기준)
   ```bash
   uv venv .venv --python 3.12
   # Windows 환경: .venv\Scripts\activate
   # Mac/Linux 환경: source .venv/bin/activate
   ```
3. 패키지 설치


```bash
# AI 에이전트 구현 및 UI(Streamlit) 실행에 필요한 필수 패키지 설치
uv pip install openai langchain-openai langchain-google-genai streamlit python-dotenv langgraph
```
