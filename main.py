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

st.header("Welcome to :green[Quizmify] your AI Learning Companion", help=None, divider=False)

st.title("Choose one of the following Option!", help=None)

st.text_input("Enter a URL you would like to know more about!", value="URL", max_chars=None, key=None, type="default", help=None, autocomplete=None, on_change=None, args=None, kwargs=None, placeholder=None, disabled=False, label_visibility="visible")

st.file_uploader("Uplaod Your PDF Documents Here!", type=None, accept_multiple_files=False, key=None, help=None, on_change=None, args=None, kwargs=None, disabled=False, label_visibility="visible")

progress_text = "Operation in progress. Please wait."
my_bar = st.progress(0, text=progress_text)

st.button("Multiple Choice Quesions", key=None, help="Choose this to get your questions in Multiple Choice Foramt ", on_click=None, args=None, kwargs=None, type="secondary", disabled=False, use_container_width=False)

# for percent_complete in range(100):
#     time.sleep(0.01)
#     my_bar.progress(percent_complete + 1, text=progress_text)
# time.sleep(1)
# my_bar.empty()


