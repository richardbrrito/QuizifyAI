import streamlit as st

st.set_page_config(
    page_title="Quizmify",
    page_icon="favicon.png",
    layout="centered",
    initial_sidebar_state="collapsed",
    menu_items={
        
    }
)

st.header("FRQuestion", help=None, divider=False)


st.markdown("""
 <style>
    [data-testid="collapsedControl"] {
        display: none
    }
    </style>
""", unsafe_allow_html=True)