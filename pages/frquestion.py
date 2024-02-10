import streamlit as st

st.setpage_config(
    page_title="Quizmify",
    page_icon="favicon.png",
    layout="centered",
    initial_sidebar_state="collapsed",
    menu_items={

    }
)

st.header("FRQuestion", help=None, divider=False)

num_questions = st.session_state.get('num_questions')

option = st.session_state.get('option')


if option == "Free Response Questions":
    for i in range(int(num_questions)):
        st.text_area(f"Question {i+1}: Please elaborate on your answer.", key=f"frq{i}")

0

st.markdown("""
 <style>
    [data-testid="collapsedControl"] {
        display: none
    }
    </style>
""", unsafe_allow_html=True)