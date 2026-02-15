echo "Starting backend server..."
cd server
source .venv_py313/bin/activate
python3 main.py &
deactivate
cd ..
echo "Backend server deployed successfully"