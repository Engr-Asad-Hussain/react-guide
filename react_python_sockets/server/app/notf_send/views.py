from flask import request
from app.notf_send import bp
from app.utils import Error, Success, database_path
from app.utils.error import ClientError
import json


@bp.route('/notf/add', methods=['POST'])
def notf_add():
    # Request body
    payload = request.json

    try:
        # Validate payload
        if not ('userId' in payload and 'description' in payload):
            raise ClientError('Invalid payload')

        # Open database file
        with open(database_path) as file:
            database = json.load(file)

        # Verify user_id found in database?
        found_user = list(filter(lambda x: x['userId'] ==
                                payload['userId'], database['users']))

        if not len(found_user):
            raise ClientError('User does not exists')

        # Append notifications
        # Find the max notf_id in the database
        notf_key = max([x['notfId'] for x in database['notf_storage']])

        database['notf_storage'].append({
            'userId': payload['userId'],
            'notfId': notf_key + 1,
            'notfDescription': payload['description']
        })

        # Write database file
        with open(database_path, 'w') as file:
            json.dump(database, file, indent=4)

    except Exception as err:
        return Error(err).emit

    # Return successfull response
    return Success(message='Notification has been added', status_code=201).emit
