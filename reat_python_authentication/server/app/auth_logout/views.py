from flask import request, current_app as app
from pprint import pprint
from app.utils.config import send_response, database_path
from app.auth_logout import bp
import jwt
import json


@bp.route('/user/logout', methods=['GET'])
def user_logout():
    # Bearer token from header
    # This is for same token cannot be used after logout
    # If there is no access token in the authorization header that's ok 
    # Because if the refresh token is expired then there wouldn't be any access token
    # In this case access token and refresh token both gets expired than there is nothing to worry about
    try:
        access_token = request.headers['Authorization'].split(maxsplit=1)[1]
    except:
        print({'error': 'Authorization token is missing'})

    # What if we do validate token here?
    # What if, the user access token is expired, 
    # He send a request to refresh token
    # And refresh token is also expired
    # In that case Validate Token Algorithm fails for infinite time

    # For extra security we need to remove the refresh token from database for this user only

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
    

    ###########################################
    # Remove refresh token
    # Refresh token is inside cookie
    # Frontend is requested to pass cookie from browser in logout request
    cookie = request.cookies.get('refresh_token')

    # Checks cookie is present in the request
    if cookie is None:
        # It means cookie is absent so don't need to clear it
        # And it doesn't matter to remove it from database because it is already expired
        return send_response({ 'message': 'User logged out successfully' }, 200)

    # Validate the refresh token
    try:
        decoded = jwt.decode(
            jwt=cookie, key=app.config['REFRESH_TOKEN_SECRET'], issuer='Asad Hussain', algorithms=['HS256']
        )
    except jwt.exceptions.ExpiredSignatureError as e:
        return send_response({'message': 'Refresh token has expired'}, 401)
    except:
        raise

    # Removes refresh token in database
    found_user = list(filter(lambda x: x['userId'] == decoded['userid'], database['users']))
    if not len(found_user):
        # This cannot be possible because refresh token is verified above
        print('Unexpected server crashes')
        raise 

    # Add refresh token in database as empty string
    # Other users
    other_users = list(filter(lambda x: x['userId'] != decoded['userid'], database['users']))

    # Append refresh token with user
    found_user[0]['refreshToken'] = ''
    database['users'] = other_users + found_user

    # Write database file
    with open(database_path, 'w') as file:
        json.dump(database, file, indent=4)

    # Set cookie and status code in response
    response = send_response({ 'message': 'User logged out successfully' }, 200)
    response.delete_cookie(key='refresh_token', httponly=True, samesite=None, secure=True)

    # Return successfull response
    return response

