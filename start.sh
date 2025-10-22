#!/bin/bash
set -e # Exit immediately if a command fails

echo "--- Activating virtual environment ---"
source /opt/render/project/src/.venv/bin/activate

echo "--- Starting Gunicorn ---"
python -m gunicorn app:app
