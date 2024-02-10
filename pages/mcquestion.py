import streamlit as st
import json

st.set_page_config(page_title="Quizmify", page_icon="favicon.png")

st.header("Multiple Choice Questions")

# Retrieve stored questions from session_state
questions = st.session_state.get('questions', [])  # Default to an empty list if not set

# Display the questions
for i, question in enumerate(questions, start=1):
    question = json.loads(questions)  # Convert the string to a dictionary
    st.subheader(f"Question {i}")
    st.write(question['text'])

    # Now you can safely use .get() since 'question' is a dictionary
    options = question.get('options', [])
    st.radio(f"Choose the correct answer:", options, key=f"mcq_{i}")

st.markdown("""
 <style>
    [data-testid="collapsedControl"] {
        display: none;
    }
</style>
""", unsafe_allow_html=True)
