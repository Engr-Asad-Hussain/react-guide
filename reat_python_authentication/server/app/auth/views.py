from array import array
from flask import request, make_response, jsonify, current_app as app
from pprint import pprint
from app.auth import bp
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import json
import os

# Generate Secrets
# import secrets
# secrets.token_urlsafe(128)

database_path = os.path.dirname(os.path.realpath(__file__)) + '\database.json'


@bp.route('/health_check', methods=['GET'])
def health_check():
    return make_response(jsonify({'message': 'Application is running...'}), 200)


@bp.route('/user/register', methods=['POST'])
def register_user():
    # Request body
    payload = request.json

    # Validate name, username, password
    if not ('name' in payload and 'username' in payload and 'password' in payload):
        return make_response(jsonify({'message': 'Invalid payload'}), 406)

    # Open database file
    with open(database_path) as file:
        database = json.load(file)

    # Verify username
    for user in database['users']:
        if user['username'] == payload['username']:
            return make_response(jsonify({'message': 'User already exists'}), 409)

    # Bcrypt password
    byte_pwd = payload['password'].encode('utf-8')
    payload['password'] = bcrypt.hashpw(byte_pwd, bcrypt.gensalt()).decode()

    # Append username
    database['users'].append({
        'userId': max(database['users'], key=lambda x:x['userId'])['userId'] + 1,
        'name': payload['name'],
        'username': payload['username'],
        'password': payload['password']
    })

    # Write database file
    with open(database_path, 'w') as file:
        json.dump(database, file, indent=4)

    # Return successfull response
    return make_response(jsonify({'message': 'User successfully created'}), 201)


@bp.route('/user/auth', methods=['POST'])
def user_login():
    # Request body
    payload = request.json

    # Validate name, username, password
    if not ('username' in payload and 'password' in payload):
        return make_response(jsonify({'message': 'Invalid payload'}), 406)

    # Open database file
    with open(database_path) as file:
        database = json.load(file)

    # Verify username duplicates
    found_user = list(filter(lambda x: x['username'] ==
                payload['username'], database['users']))
    if not len(found_user):
        return make_response(jsonify({'message': 'User does not exists'}), 409)

    # Validate password
    pwd_bytes = payload['password'].encode('utf-8')
    hash_bytes = found_user[0]['password'].encode('utf-8')
    if not bcrypt.checkpw(pwd_bytes, hash_bytes):
        return make_response(jsonify({'message': 'Incorrect password'}), 404)

    # Generate jwt
    try:
        # Access token
        iat = datetime.now(tz=timezone.utc)
        exp = iat + timedelta(seconds=1*60) # 1 minutes
        jwt_data = {
            "userid": found_user[0]['userId'],
            "iat": int(iat.timestamp()),
            "nbf": int(iat.timestamp()),
            "exp": int(exp.timestamp()),
            "iss": "Asad Hussain"
        }
        access_token = jwt.encode(
            payload=jwt_data, key=app.config['ACCESS_TOKEN_SECRET'], algorithm='HS256')

        # Refresh token
        iat = datetime.now(tz=timezone.utc)
        exp = iat + timedelta(seconds=5*60) # 5 minutes
        jwt_data = {
            "userid": found_user[0]['userId'],
            "iat": int(iat.timestamp()),
            "nbf": int(iat.timestamp()),
            "exp": int(exp.timestamp()),
            "iss": "Asad Hussain"
        }
        refresh_token = jwt.encode(
            payload=jwt_data, key=app.config['REFRESH_TOKEN_SECRET'], algorithm='HS256')

    except:
        return make_response(jsonify({'message': 'Service not available'}), 502)


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
    response = make_response(jsonify({ 'accessToken': access_token }))
    response.status_code = 200
    response.set_cookie(key='refresh_token', value=refresh_token, httponly=True, max_age=5*60)  # 5 minutes

    # Return successfull response
    return response


@bp.route('/user/logout', methods=['GET'])
def user_logout():
    # Bearer token from header
    try:
        access_token = request.headers['authorization'].split(maxsplit=1)[1]
    except:
        return make_response(jsonify({'error': 'Authorization token is missing'}), 200)

    # Open database file
    with open(database_path) as file:
        database = json.load(file)

    # Add jwt in revoke list
    database['revokes'].append({
        'jwt': access_token
    })

    # Write database file
    with open(database_path, 'w') as file:
        json.dump(database, file, indent=4)

    # Return successfull response
    return make_response(jsonify({'message': 'User logged out successfully'}), 200)


@bp.route('/token/validate', methods=['POST'])
def validate_token():
    # Request body
    payload = request.json

    # Validate jwt
    if not ('token' in payload):
        return make_response(jsonify({'message': 'Invalid payload'}), 406)

    # Validate token
    try:
        token_validator(payload['token'])
    except jwt.exceptions.InvalidSignatureError as e:
        return make_response(jsonify({'message': str(e)}), 406)
    except Exception as e:
        return make_response(jsonify({'message': str(e)}), 406)

    # Return successfull response
    return make_response(jsonify({'message': 'Token is valid', 'data': True}), 200)


@bp.route('/token/refresh', methods=['GET'])
def refresh_token():
    # Get the cookie from the request
    # Refresh token is inside cookie
    cookie = request.cookies.get('refresh_token')
    print('cookie', cookie)

    # Checks cookie is present in the request
    if cookie is None:
        return make_response(jsonify({'error': 'Cookie is missing'}), 401)

    # Validate the refresh token
    try:
        decoded = jwt.decode(
            jwt=cookie, key=app.config['REFRESH_TOKEN_SECRET'], issuer='Asad Hussain', algorithms=['HS256']
        )
        pprint(decoded)
    except jwt.exceptions.ExpiredSignatureError as e:
        print(e)
        return make_response(jsonify({'message': 'Refresh token has expired'}), 401)
    except:
        raise

    # Now token is valid and not expired
    # Open database file
    with open(database_path) as file:
        database = json.load(file)

    # Filter refresh token relative to userid
    found_user = list(filter(lambda x: x['userId'] == decoded['userid'], database['users']))
    print('found_user')
    pprint(found_user)
    
    # Refresh token userId not matches database userId
    if not len(found_user):
        return make_response(jsonify({'message': 'Token is not valid'}), 403)

    # Checks found user's refresh token matches with refresh token of cookie
    if found_user[0].get('refreshToken') != cookie:
        return make_response(jsonify({'message': 'Refresh token is invalid'}), 406)

    # Now refresh token is 99% valid and not expired
    # Generate new access token for this user
    try:
        # Access token
        iat = datetime.now(tz=timezone.utc)
        exp = iat + timedelta(seconds=1*60) # 1 minutes
        jwt_data = {
            "userid": decoded['userid'],
            "iat": int(iat.timestamp()),
            "nbf": int(iat.timestamp()),
            "exp": int(exp.timestamp()),
            "iss": "Asad Hussain"
        }
        access_token = jwt.encode(
            payload=jwt_data, key=app.config['ACCESS_TOKEN_SECRET'], algorithm='HS256')

    except:
        return make_response(jsonify({'message': 'Service not available'}), 502)


    return make_response(jsonify({'accessToken': access_token}), 200)


    



@bp.route('/users', methods=['GET'])
def get_users():
    # Bearer token from header
    try:
        access_token = request.headers['authorization'].split(maxsplit=1)[1]
    except:
        return make_response(jsonify({'error': 'Authorization token is missing'}), 406)

    # Validate token
    try:
        token_validator(access_token)
    except jwt.exceptions.InvalidSignatureError as e:
        return make_response(jsonify({'message': str(e)}), 406)
    except Exception as e:
        return make_response(jsonify({'message': str(e)}), 406)

    # Open database file
    with open(database_path) as file:
        database = json.load(file)

    users = []
    for user in database['users']:
        users.append({
            "userId": user['userId'],
            "name": user['name'],
            "username": user['username']
        })

    # Return successfull response
    return make_response(jsonify({'users': users}), 200)


def token_validator(token):
    # Open database file
    with open(database_path) as file:
        database = json.load(file)

    # Decode and validate jwt
    try:
        jwt.decode(
            jwt=token, key=app.config['ACCESS_TOKEN_SECRET'], issuer='Asad Hussain', algorithms=['HS256']
        )
    except:
        raise

    # Check jwt present in the revoke list
    for item in database['revokes']:
        if item['jwt'] == token:
            raise Exception(json.dumps(
                {'message': 'Token is not valid', 'code': 406}))
