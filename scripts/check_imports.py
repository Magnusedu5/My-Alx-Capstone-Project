"""Small helper to verify imports with Django settings configured.
Run with: python scripts/check_imports.py
"""
import os
import importlib
import sys
from pathlib import Path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Alx_Capstone_project.settings')
# Ensure project root is on sys.path so imports like 'DMS_ALX' resolve
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

# Initialize Django
import django
django.setup()

modules = [
    'DMS_ALX',
    'DMS_ALX.api_views',
    'DMS_ALX.management.commands.create_demo_users',
    'Alx_Capstone_project.settings',
]

for m in modules:
    try:
        importlib.import_module(m)
        print(m, 'OK')
    except Exception as e:
        print(m, 'ERROR', repr(e))
