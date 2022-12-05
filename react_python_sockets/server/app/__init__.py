from flask import Flask
from flask_socketio import SocketIO


socket = SocketIO()


def create_app(config_class):
    app = Flask(__name__)
    # app.config['SECRET_KEY'] = 'secret!'
    socket.init_app(app)

    app.config.from_object(config_class)

    with app.app_context():

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
