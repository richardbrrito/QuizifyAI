import streamlit as st

st.setpage_config(
    page_title="Quizmify",
    page_icon="favicon.png",
    layout="centered",
    initial_sidebar_state="collapsed",
    menu_items={

    }
)

st.header("MCQuestion", help=None, divider=False)

num_questions = st.session_state.get('num_questions')  # Default to 10 if not previously set

st.write(f"Number of questions selected: {num_questions}")

option = st.session_state.get('option')

if option == "Multiple Choice Questions":
    for i in range(int(num_questions)):
        st.radio(f"Question {i+1}:", ["Option A", "Option B", "Option C", "Option D"], key=f"mcq{i}")



st.markdown("""
 <style>
    [data-testid="collapsedControl"] {
        display: none
    }
    </style>
""", unsafe_allow_html=True)