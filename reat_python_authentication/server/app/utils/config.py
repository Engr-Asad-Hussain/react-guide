from flask import make_response, jsonify
import os

# How to Generate Secrets?
# import secrets
# secrets.token_urlsafe(128)

ROLES = {
    'GlobalAdmin': 2001,
    'OrganizationAdmin': 1993,
    'Reader': 1834,
}


# Database path
database_path = os.getcwd() + r'\app\utils\database.json'


def send_response(body: dict, status_code: int):
    response = make_response(jsonify(body))
    response.status_code = status_code
    return response
