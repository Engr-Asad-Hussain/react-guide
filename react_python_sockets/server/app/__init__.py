from flask import Flask, request
from flask_socketio import SocketIO, ConnectionRefusedError


socket = SocketIO()


@socket.on('connect')
def connected(auth):
    """event listener when client connects to the server"""

    print("client has connected")
    print(request.sid)
    socket.emit("connect",{"data":f"id: {request.sid} is connected"})
    # if not auth:
    #     raise ConnectionRefusedError('Unauthorized User')


@socket.on('recipient')
def recipient(payload):
    """event listener when client types a message"""

    print("data from the front end: ",str(payload))
    socket.emit('provider', { 'data': payload, 'id': request.sid }, namespace='/chat')

# SocketIO supports acknowledgment callbacks that confirm that a message was received by the client:
# def ack():
#     print('Message was received')

# Unnamed event
# @socket.on('message')
# def handle_message(data):
#     print('Received message: ', data)
    
    # Returns response back to the client
    # socket.emit(data, callback=ack)


# Unnamed event
# @socket.on('json')
# def handle_json(json):
#     print('Received json: ', json)
#     SocketIO.send('Received json', json=True)


# Named event
# @socket.on('custom_event')
# def handle_custom_event(arg1, arg2, arg3):
#     print('Received custom: ', arg1, arg2, arg3)

    # Returns response back to the client
#     socket.emit('server response', json=True, namespace='/chat')

# The names 'message', 'json', 'connect' and 'disconnect' are reserved and cannot be used for named events.

# Flask-SocketIO also supports SocketIO namespaces, which allow the client to multiplex several 
# independent connections on the same physical socket. When a namespace is not specified a 
# default global namespace with the name '/' is used.
# @socket.on('custom_notf', namespace='/code')
# def handle_custom_notf(data):
#     print('Received notf: ', data)


def create_app(config_class):
    app = Flask(__name__)
    # app.config['SECRET_KEY'] = 'secret!'
    socket.init_app(
        app,
        cors_allowed_origins="*"
    )

    app.config.from_object(config_class)

    with app.app_context():

        from app.notf_send.views import bp
        app.register_blueprint(bp)

        @app.route('/health', methods=['GET'])
        def app_check():
            from app.utils import Success
            from datetime import datetime
            data = {
                'currentTime': datetime.utcnow(),
                'status': 'Application is up!'
            }
            return Success('SocketIO application', status_code=200, data=data).emit

        return app, socket
