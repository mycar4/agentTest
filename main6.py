import streamlit as st
import random
import pandas as pd

# 1. 페이지 설정
st.set_page_config(page_title="UP & DOWN 게임", page_icon="🎯")
st.title("🎯 UP & DOWN 숫자 맞추기 게임")
st.caption("1부터 100 사이의 숨겨진 숫자를 10번 안에 맞춰보세요! 빨리 맞출수록 점수가 높습니다.")

# 2. 세션 상태(Session State) 초기화
if 'target_number' not in st.session_state:
    st.session_state.target_number = random.randint(1, 100)
    st.session_state.attempts = 0
    st.session_state.max_attempts = 10
    st.session_state.game_over = False
    st.session_state.is_win = False
    st.session_state.message = "숫자를 입력하고 확인 버튼을 누르세요."
    st.session_state.score = 0
    # 리더보드 초기 데이터 (데모용)
    st.session_state.leaderboard = [
        {"이름": "AI 봇", "점수": 50, "시도횟수": 6}
    ]

# 게임 리셋 함수
def reset_game():
    st.session_state.target_number = random.randint(1, 100)
    st.session_state.attempts = 0
    st.session_state.game_over = False
    st.session_state.is_win = False
    st.session_state.score = 0
    st.session_state.message = "새 게임이 시작되었습니다! 숫자를 맞춰보세요."

# 점수 계산 로직 (기본 100점에서 시도당 10점씩 차감)
def calculate_score(attempts):
    return max(10, 110 - (attempts * 10))

# 3. 사이드바 - 리더보드(명예의 전당)
with st.sidebar:
    st.header("🏆 명예의 전당")
    if st.session_state.leaderboard:
        # 점수 기준 내림차순 정렬
        df = pd.DataFrame(st.session_state.leaderboard)
        df = df.sort_values(by="점수", ascending=False).reset_index(drop=True)
        # 1등 강조
        st.success(f"🥇 1등: {df.iloc[0]['이름']} ({df.iloc[0]['점수']}점)")
        st.dataframe(df, use_container_width=True, hide_index=True)
    else:
        st.info("아직 등록된 랭커가 없습니다.")
    
    st.divider()
    if st.button("🔄 새 게임 시작"):
        reset_game()
        st.rerun()

# 4. 메인 게임 영역
col1, col2 = st.columns(2)
with col1:
    st.metric("남은 기회", f"{st.session_state.max_attempts - st.session_state.attempts} 번")
with col2:
    current_score_estimate = calculate_score(st.session_state.attempts + 1)
    st.metric("현재 획득 가능 점수", f"{current_score_estimate} 점")

st.markdown("---")

# 상태 메시지 출력
if not st.session_state.game_over:
    st.info(st.session_state.message)

    # 사용자 입력 폼
    with st.form("guess_form"):
        guess = st.number_input("숫자 입력 (1~100)", min_value=1, max_value=100, step=1)
        submit = st.form_submit_button("확인")

        if submit:
            st.session_state.attempts += 1
            
            if guess == st.session_state.target_number:
                # 정답 처리
                st.session_state.game_over = True
                st.session_state.is_win = True
                st.session_state.score = calculate_score(st.session_state.attempts)
                st.session_state.message = f"🎉 정답입니다! {st.session_state.attempts}번 만에 맞추셨습니다."
                st.rerun()
                
            elif st.session_state.attempts >= st.session_state.max_attempts:
                # 실패 처리 (횟수 초과)
                st.session_state.game_over = True
                st.session_state.message = f"💀 게임 오버! 정답은 {st.session_state.target_number} 였습니다."
                st.rerun()
                
            elif guess < st.session_state.target_number:
                # UP 힌트
                st.session_state.message = f"🔺 **UP!** {guess}보다 큰 숫자입니다."
                st.rerun()
                
            elif guess > st.session_state.target_number:
                # DOWN 힌트
                st.session_state.message = f"🔻 **DOWN!** {guess}보다 작은 숫자입니다."
                st.rerun()

# 5. 게임 종료 후 처리 (승리 시 점수 등록)
if st.session_state.game_over:
    if st.session_state.is_win:
        st.success(st.session_state.message)
        st.header(f"당신의 점수는 **{st.session_state.score}점** 입니다!")
        
        # 랭킹 등록 폼
        player_name = st.text_input("🏆 랭킹에 등록할 이름을 입력하세요!", max_chars=10)
        if st.button("점수 등록하기"):
            if player_name.strip() == "":
                st.warning("이름을 입력해주세요.")
            else:
                # 리더보드에 추가
                st.session_state.leaderboard.append({
                    "이름": player_name,
                    "점수": st.session_state.score,
                    "시도횟수": st.session_state.attempts
                })
                
                # 1등 확인 로직
                df = pd.DataFrame(st.session_state.leaderboard)
                top_score = df['점수'].max()
                
                if st.session_state.score >= top_score:
                    st.balloons()  # 🎈 1등 축하 애니메이션
                    st.success(f"축하합니다! {player_name}님이 1등을 차지했습니다! 🎉")
                else:
                    st.snow()      # 일반 랭킹 등록 애니메이션
                    st.info("점수가 등록되었습니다. 사이드바를 확인하세요!")
                
                st.session_state.game_over = True # 상태 유지
                
    else:
        st.error(st.session_state.message)
        if st.button("다시 도전하기"):
            reset_game()
            st.rerun()