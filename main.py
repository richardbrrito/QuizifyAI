import streamlit as st
import time


st.set_page_config(
    page_title="Quizmify",
    page_icon="favicon.png",
    layout="centered",
    initial_sidebar_state="expanded",
    menu_items={
        
    }
)

st.markdown("""
    <style>
    .stButton>button {
        border: 1px solid #4CAF50;
        background-color: #4CAF50; /* Green */
        color: white;
        padding: 10px 24px;
        cursor: pointer;
        font-size: 16px;
    }
    .stButton>button:hover {
        background-color: #45a049;
    }
    </style>
""", unsafe_allow_html=True)

st.header("Welcome to :green[Quizmify] your AI Learning Companion", help=None, divider=False)

st.title("Choose one of the following Option!", help=None)

url = st.text_input("Enter a URL you would like to know more about!", value="URL", max_chars=None, key=None, type="default", help=None, autocomplete=None, on_change=None, args=None, kwargs=None, placeholder=None, disabled=False, label_visibility="visible")

uploaded_file = st.file_uploader("Uplaod Your PDF Documents Here!", type=None, accept_multiple_files=False, key=None, help=None, on_change=None, args=None, kwargs=None, disabled=False, label_visibility="visible")

num_questions = st.number_input("How man questions do you want?", min_value=1, max_value=20, value="min", step=None, format=None, key=None, help=None, on_change=None, args=None, kwargs=None, placeholder=None, disabled=False, label_visibility="visible")

MCQ, FRQ = st.columns(2)
with MCQ:
    st.button("Multiple Choice Quesions", key=None, help="Choose this to get your questions in Multiple Choice Foramt ", on_click=None, args=None, kwargs=None, type="secondary", disabled=False, use_container_width=False)

with FRQ:
    st.button("Free Response Questions", key=None, help="Choose this to get your questions in Free Response Foramt ", on_click=None, args=None, kwargs=None, type="secondary", disabled=False, use_container_width=False)

easy, medium, hard = st.columns(3)
with easy:
    st.button("Easy", key=None, help="Choose this to get your questions in Multiple Choice Foramt ", on_click=None, args=None, kwargs=None, type="secondary", disabled=False, use_container_width=False)

with medium:
    st.button("Medium", key=None, help="Choose this to get your questions in Free Response Foramt ", on_click=None, args=None, kwargs=None, type="secondary", disabled=False, use_container_width=False)

with hard:
    st.button("Hard", key=None, help="Choose this to get your questions in Free Response Foramt ", on_click=None, args=None, kwargs=None, type="secondary", disabled=False, use_container_width=False)

if st.button("Generate Quiz"):
    if url and uploaded_file and num_questions > 0:
        st.write("Processing your request...")

        progress_bar = st.progress(0)
        for percent_complete in range(100):
            time.sleep(0.1)
            progress_bar.progress(percent_complete + 1)
        progress_bar.empty()

        st.write("Quiz is ready!")
    else:
        st.error("Please make sure all inputs are provided correctly.")

