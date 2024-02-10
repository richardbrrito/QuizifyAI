# Quizmify: Streamlit-based Quiz Platform

**Quizmify** is an interactive web application designed to create, manage, and take quizzes in a user-friendly environment. Built with Streamlit, it leverages Python for backend operations and offers a seamless experience for quiz enthusiasts and educators.

## Key Features

- 📝 Easy quiz creation and management
- 🖥️ Interactive user interface with Streamlit
- 📊 Real-time results and analytics
- 📚 Support for various question types (MCQs, True/False, etc.)
- 🔒 User authentication for personalized experiences
- 🌍 Web-based platform accessible from anywhere
- 📁 PDF document handling for quiz material (evidenced by `temp_uploaded_pdf.pdf`)

## Prerequisites

- Python 3.8 or higher
- Streamlit
- Additional Python packages as specified in `requirements.txt` (this file might be located in the root or within a specific directory; please specify the location)

## Installation

1. Clone the repository or download the project files.
2. Navigate to the project directory:

```shell
cd Quizmify
```

3. Install the required Python packages:

```shell
pip install -r requirements.txt
```

## Configuration

- Set up any necessary configurations in `.streamlit/config.toml` (if applicable)
- Ensure backend services in the `backend` directory are properly configured

## Running the Application

Start the Streamlit application by running:

```shell
streamlit run main.py
```

Navigate to the displayed URL in your web browser to access Quizmify.

## Project Structure

- `main.py`: The entry point of the application.
- `pages/`: Contains individual pages for the Streamlit app.
- `backend/`: Backend logic and data handling.
- `.streamlit/`: Configuration files for Streamlit.
- `favicon.png`: The application's favicon.

## Contributing

We welcome contributions! Please read `CONTRIBUTING.md` (if available) for guidelines on how to contribute to the project.

## License

Specify the license under which the project is made available.
