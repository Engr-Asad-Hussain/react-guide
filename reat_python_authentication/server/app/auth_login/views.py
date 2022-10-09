from flask import request, make_response, jsonify, current_app as app
from datetime import datetime, timezone, timedelta
from pprint import pprint
from app.auth_login import bp
from app.utils.config import send_response, database_path
import bcrypt
import jwt
import json


@bp.route('/user/auth', methods=['POST'])
def user_login():
    # Request body
    payload = request.json

    # Validate name, username, password
    if not ('username' in payload and 'password' in payload):
        return make_response(jsonify({'message': 'Invalid payload'}), 400)

    # Open database file
    with open(database_path) as file:
        database = json.load(file)

    # Verify username found in database?
    found_user = list(filter(lambda x: x['username'] ==
                             payload['username'], database['users']))
    if not len(found_user):
        return send_response({'message': 'User does not exists'}, 400)

    # Validate password
    pwd_bytes = payload['password'].encode('utf-8')
    hash_bytes = found_user[0]['password'].encode('utf-8')
    if not bcrypt.checkpw(pwd_bytes, hash_bytes):
        return send_response({'message': 'Incorrect password'}, 400)

    # Generate jwt
    try:
        # Access token
        iat = datetime.now(tz=timezone.utc)
        # 1 minutes
        exp = iat + timedelta(minutes=app.config['ACCESS_TOKEN_EXPIRY'])
        jwt_data = {
            "userid": found_user[0]['userId'],
            "roles": found_user[0]['role'],
            "iat": int(iat.timestamp()),
            "nbf": int(iat.timestamp()),
            "exp": int(exp.timestamp()),
            "iss": "Asad Hussain"
        }
        access_token = jwt.encode(
            payload=jwt_data, key=app.config['ACCESS_TOKEN_SECRET'], algorithm='HS256')

        # Refresh token
        iat = datetime.now(tz=timezone.utc)
        # 5 minutes
        exp = iat + timedelta(minutes=app.config['REFRESH_TOKEN_EXPIRY'])
        jwt_data = {
            "userid": found_user[0]['userId'],
            "roles": found_user[0]['role'],
            "iat": int(iat.timestamp()),
            "nbf": int(iat.timestamp()),
            "exp": int(exp.timestamp()),
            "iss": "Asad Hussain"
        }
        refresh_token = jwt.encode(
            payload=jwt_data, key=app.config['REFRESH_TOKEN_SECRET'], algorithm='HS256')

    except:
        raise

    # Add refresh token in database
    # Other users
    other_users = list(filter(lambda x: x['username'] !=
                              payload['username'], database['users']))

    # Append refresh token with user
    found_user[0]['refreshToken'] = refresh_token
    database['users'] = other_users + found_user

    # Write database file
    with open(database_path, 'w') as file:
        json.dump(database, file, indent=4)

    # Set cookie and status code in response
    response = send_response({'accessToken': access_token}, 200)
    response.set_cookie(
        key='refresh_token',
        value=refresh_token,
        httponly=True,
        max_age=app.config['REFRESH_TOKEN_EXPIRY']*60,
        samesite=None,
        secure=True
    )  # 5 minutes

    # Return successfull response
    return response
