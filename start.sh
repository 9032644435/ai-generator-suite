#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Explicitly set the python path
export PYTHONPATH=/opt/render/project/src/.venv/lib/python3.11/site-packages

# Run the server using the venv's python
/opt/render/project/src/.venv/bin/python -m gunicorn app:app
