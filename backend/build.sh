#!/usr/bin/env bash
# exit on error
set -o errexit

uv pip install -r requirements.txt

python manage.py collectstatic --no-input