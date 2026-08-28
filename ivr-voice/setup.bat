@echo off
echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt

echo Setup complete! Run the following commands:
echo.
echo   venv\Scripts\activate
echo   python main.py
echo.
pause