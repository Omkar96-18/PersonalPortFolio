#!/usr/bin/env bash
# Exit immediately on any error
set -o errexit

echo "==> Installing Python dependencies..."
pip install -r requirements.txt

echo "==> Running database migrations..."
python manage.py migrate --no-input

echo "==> Collecting static files..."
python manage.py collectstatic --no-input

echo "==> Build complete."