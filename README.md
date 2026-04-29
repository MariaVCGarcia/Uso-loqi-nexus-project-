# Uso-loqi-nexus-project-

This is the git repository for uso loqi

Install Node Modules
`npm init -y`

How to run backend

- Change your directory to backend

- In terminal type in python -m venv venv

- Then, venv\Scripts\activate

- Then install this inside of venv. In your terminal it should say (venv) before your folder. If it does you're in the right place
  `pip install fastapi uvicorn openai python-dotenv`

- Create an .env folder inside of the backend. ADD:

OPENAI_API_KEY=your_api_key_here

- Then run the server while frontend is running by typing

uvicorn main:app --reload
