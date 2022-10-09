from flask import request
from app.auth_register import bp
from app.utils.config import ROLES, send_response, database_path
import bcrypt
import json


@bp.route('/user/register', methods=['POST'])
def register_user():
    # Request body
    payload = request.json

    # Validate name, username, password
    if not ('name' in payload and 'username' in payload and 'password' in payload):
        return send_response({'message': 'Invalid payload'}, 400)

    # Open database file
    with open(database_path) as file:
        database = json.load(file)

    # Verify username duplicates
    for user in database['users']:
        if user['username'] == payload['username']:
            return send_response({'message': 'User already exists'}, 409)

    # Bcrypt password
    byte_pwd = payload['password'].encode('utf-8')
    payload['password'] = bcrypt.hashpw(byte_pwd, bcrypt.gensalt()).decode()

    # Check if database is empty
    users = database.get('users')
    if len(users):
        user_id = max(database['users'], key=lambda x:x['userId'])['userId'] + 1
    else:
        user_id = 1

    # Append username
    database['users'].append({
        'userId': user_id,
        'name': payload['name'],
        'username': payload['username'],
        'password': payload['password'],
        'role': [ROLES['Reader']]
    })

    # Write database file
    with open(database_path, 'w') as file:
        json.dump(database, file, indent=4)

    # Return successfull response
    return send_response({'message': 'User successfully created'}, 201)

