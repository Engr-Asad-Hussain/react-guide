from flask import request, current_app as app
from pprint import pprint
from datetime import datetime, timezone, timedelta
from app.token_refresh import bp
from app.utils.config import database_path, send_response
import jwt
import json


@bp.route('/token/refresh', methods=['GET'])
def refresh_token():
    # Get the cookie from the request
    # Refresh token is inside cookie
    cookie = request.cookies.get('refresh_token')

    # Checks cookie is present in the request
    if cookie is None:
        return send_response({'message': 'Cookie is missing'}, 400)

    # Validate the refresh token
    try:
        decoded = jwt.decode(
            jwt=cookie, key=app.config['REFRESH_TOKEN_SECRET'], issuer='Asad Hussain', algorithms=['HS256']
        )
    except jwt.exceptions.ExpiredSignatureError as e:
        print(e)
        return send_response({'message': 'Refresh token has expired'}, 401)
    except:
        raise

    # Now token is valid and not expired
    # Open database file
    with open(database_path) as file:
        database = json.load(file)

    # Filter refresh token relative to userid
    found_user = list(filter(lambda x: x['userId'] == decoded['userid'], database['users']))
    
    # Refresh token userId not matches database userId
    if not len(found_user):
        return send_response({'message': 'Token is not valid'}, 401)

    # Checks found user's refresh token matches with refresh token of cookie
    if found_user[0].get('refreshToken') != cookie:
        return send_response({'message': 'Refresh token is invalid'}, 401)

    # Now refresh token is 99% valid and not expired
    # Generate new access token for this user
    try:
        # Access token
        iat = datetime.now(tz=timezone.utc)
        exp = iat + timedelta(minutes=app.config['ACCESS_TOKEN_EXPIRY']) # 1 minutes
        jwt_data = {
            "userid": decoded['userid'],
            "roles": decoded['roles'],
            "iat": int(iat.timestamp()),
            "nbf": int(iat.timestamp()),
            "exp": int(exp.timestamp()),
            "iss": "Asad Hussain"
        }
        access_token = jwt.encode(
            payload=jwt_data, key=app.config['ACCESS_TOKEN_SECRET'], algorithm='HS256')
    except:
        raise

    # Return successfull response
    return send_response({'accessToken': access_token}, 200)


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