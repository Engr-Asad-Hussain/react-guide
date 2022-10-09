from flask import request, current_app as app
from pprint import pprint
from app.token_validate import bp
from app.utils.config import send_response, database_path
import jwt
import json


@bp.route('/token/validate', methods=['POST'])
def validate_token():
    # Request body
    payload = request.json

    # Validate jwt
    if not ('token' in payload):
        return send_response({'message': 'Invalid payload'}, 400)

    # Validate token
    try:
        token_validator(payload['token'])
    except jwt.exceptions.ExpiredSignatureError as e:
        return send_response({'message': str(e)}, 401)

    except jwt.exceptions.InvalidSignatureError as e:
        return send_response({'message': str(e)}, 401)

    except jwt.exceptions.InvalidTokenError:
        return send_response({'message': 'Token is not valid. You have been logout'}, 401)

    except Exception as e:
        return send_response({'message': str(e)}, 500)

    # Return successfull response
    return send_response({'message': 'Token is valid', 'data': True}, 200)


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
