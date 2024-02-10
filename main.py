import streamlit as st
from streamlit.components.v1 import html
import time
import requests


st.set_page_config(page_title="QuizifyAI", page_icon="favicon.png", initial_sidebar_state="collapsed",)

st.markdown(
    """
 <style>
    .stButton>button {
        border: 1px solid #4CAF50; /* Green border */
        background-color: #4CAF50; /* Green background */
        color: black; /* Black text */
        padding: 10px 24px;
        cursor: pointer;
        font-size: 16px;
    }
    .stButton>button:hover {
        background-color: #8ef08e; /* Lighter green for hover */
        color: black; /* Black text on hover */
        outline: 2px solid black; /* Black outline on hover */
        outline-offset: -2px;
    }
    .stButton>button:active {
        background-color: rgba(0, 0, 0, 0.1); /* Lighter opacity black on click */
        border: 1px solid #4CAF50; /* Same green border */
        color: black; /* Black text */
        outline: 2px solid black; /* Same black outline */
    }
    [data-testid="collapsedControl"] {
        display: none
    }
    </style>
""",
    unsafe_allow_html=True,
)


def nav_page(page_name, timeout_secs=3):
    nav_script = """
        <script type="text/javascript">
            function attempt_nav_page(page_name, start_time, timeout_secs) {
                var links = window.parent.document.getElementsByTagName("a");
                for (var i = 0; i < links.length; i++) {
                    if (links[i].href.toLowerCase().endsWith("/" + page_name.toLowerCase())) {
                        links[i].click();
                        return;
                    }
                }
                var elasped = new Date() - start_time;
                if (elasped < timeout_secs * 1000) {
                    setTimeout(attempt_nav_page, 100, page_name, start_time, timeout_secs);
                } else {
                    alert("Unable to navigate to page '" + page_name + "' after " + timeout_secs + " second(s).");
                }
            }
            window.addEventListener("load", function() {
                attempt_nav_page("%s", new Date(), %d);
            });
        </script>
    """ % (
        page_name,
        timeout_secs,
    )
    html(nav_script)


st.header("Welcome to :green[Quizmify] your AI Learning Companion!")

url = st.text_input("Enter a URL you would like to know more about!")

uploaded_file = st.file_uploader("Upload Your PDF Document Here!", type=["pdf"])


def generate_questions_from_pdf(
    pdf_path, start_page=3, end_page=5, questionCount=1, difficulty="easy"
):
    url = "http://localhost:3000/generate"  # URL to your backend's /generate endpoint
    payload = {
        "pdfPath": pdf_path,
        "startPage": start_page,
        "endPage": end_page,
        "questionCount": questionCount,
        "difficulty": difficulty,
    }
    response = requests.post(url, json=payload)

    if response.status_code == 200:
        return response.json().get("questions")
    else:
        st.error("Failed to get a response from the backend.")
        return None


option = st.selectbox(
    "Select what type of questions you would like to be asked!",
    ["Multiple Choice Questions", "Free Response Questions"],
)

num_questions = st.number_input(
    "How many questions do you want?", min_value=1, max_value=20, value=1
)

st.session_state["num_questions"] = num_questions

difficulty = st.selectbox(
    "Select the level of difficulty you want!", ["Easy", "Medium", "Hard"]
)


# def fetch_chatgpt_feedback(question, user_answer):
#     try:
#         response = requests.post("http://localhost:3000/feedback", json={"question": question, "userAnswer": user_answer})
#         response.raise_for_status()  # Raises an HTTPError if the response status code is 4XX or 5XX
#         # Check if the response header indicates JSON content
#         if 'application/json' in response.headers.get('Content-Type'):
#             return response.json().get("feedback")
#         else:
#             st.error("Response content is not in JSON format.")
#             return "No feedback available due to incorrect response format."
#     except requests.exceptions.HTTPError as http_err:
#         st.error(f"HTTP error occurred: {http_err}")  # HTTP error
#     except requests.exceptions.ConnectionError as conn_err:
#         st.error(f"Error connecting to the server: {conn_err}")  # Connection error
#     except requests.exceptions.Timeout as timeout_err:
#         st.error(f"Timeout error: {timeout_err}")  # Timeout error
#     except requests.exceptions.RequestException as req_err:
#         st.error(f"An error occurred while handling your request: {req_err}")  # Other errors
#     except ValueError as json_err:  # Includes JSONDecodeError
#         st.error(f"Error decoding JSON response: {json_err}")  # JSON decode error

#     # Return a default message if an error occurs
#     return "No feedback available due to an error."

def fetch_chatgpt_feedback(question, user_answer):
    try:
        response = requests.post("http://localhost:3000/feedback", json={"question": question, "userAnswer": user_answer})
        response.raise_for_status()
        feedback_data = response.json()
        feedback = feedback_data.get("judgement", "No judgement provided.") + "\n" + feedback_data.get("gptAnswer", "No suggested answer provided.")
        return feedback
    except Exception as e:
        st.error(f"An error occurred: {str(e)}")
        return "No feedback available due to an error."
    
if st.button("Generate Quiz") or "questions" in st.session_state:
    if (url or uploaded_file) and num_questions > 0:
        # Check if questions have already been generated
        if "questions" not in st.session_state:
            # Generate questions if not already done
            questions = generate_questions_from_pdf(
                "/Users/kevin/Documents/GitHub/Quizmify/temp_uploaded_pdf.pdf",  # This should be replaced with actual file handling
                start_page=1,
                end_page=10,
                questionCount=num_questions,
                difficulty=difficulty,
            )
            st.session_state["questions"] = questions

        if st.session_state["questions"]:
            for i, question_text in enumerate(st.session_state["questions"], start=1):
                st.write(f"Question {i}: {question_text}")
                user_answer_key = f"answer_{i}"
                if user_answer_key not in st.session_state:
                    st.session_state[user_answer_key] = ""
                st.text_input(f"Your answer for question {i}", key=user_answer_key)

                # Button to get feedback for each question
                if st.button(f"Get Feedback for Question {i}"):
                    user_answer = st.session_state[user_answer_key]
                    feedback = fetch_chatgpt_feedback(question_text, user_answer)
                    st.session_state[f"feedback_{i}"] = feedback  # Save feedback in session state

                # Display feedback inside a box with the title "QuizifyAI Answer"
                if f"feedback_{i}" in st.session_state:
                    with st.expander(f"QuizifyAI Answer for Question {i}"):
                        st.text_area("", value=st.session_state[f"feedback_{i}"], height=100, disabled=True)
        else:
            st.error("Failed to generate questions.")
    else:
        st.error(
            "Please provide a PDF document and ensure all inputs are correctly provided."
        )
