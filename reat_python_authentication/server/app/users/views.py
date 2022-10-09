from flask import request, current_app as app
from pprint import pprint
from app.users import bp
from app.utils.config import database_path, send_response
import jwt
import json


@bp.route('/users', methods=['GET'])
def get_users():
    # Bearer token from header
    try:
        access_token = request.headers['authorization'].split(maxsplit=1)[1]
    except:
        return send_response({'message': 'Authorization token is missing'}, 400)

    # Validate token
    try:
        token_validator(access_token)
    except jwt.exceptions.ExpiredSignatureError as e:
        return send_response({'message': str(e)}, 401)

    except jwt.exceptions.InvalidSignatureError as e:
        return send_response({'message': str(e)}, 401)

    except jwt.exceptions.InvalidTokenError: 
        return send_response({'message': 'Token is not valid. You have been logout'}, 401)
    
    except:
        raise

    # Open database file
    with open(database_path) as file:
        database = json.load(file)

    users = []
    for user in database['users']:
        users.append({
            "userId": user['userId'],
            "name": user['name'],
            "username": user['username'],
            "role": user['role']
        })

    # Return successfull response
    return send_response({'users': users}, 200)


def token_validator(token):
    # Open database file
    with open(database_path) as file:
        database = json.load(file)

    # Decode and validate jwt
    try:
        decoded = jwt.decode(
            jwt=token, key=app.config['ACCESS_TOKEN_SECRET'], issuer='Asad Hussain', algorithms=['HS256']
        )
    except Exception as e:
        print(e, type(e).__module__)
        raise

    # Check jwt present in the revoke list
    for item in database['revokes']:
        if item['jwt'] == token:
            raise jwt.exceptions.InvalidTokenError

    # Return decoded value
    return decoded