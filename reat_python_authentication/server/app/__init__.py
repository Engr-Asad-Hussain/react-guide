from flask import Flask
from flask_cors import CORS
from importlib import import_module

cors = CORS()


def register_bp(app):
    """ Registers the blueprint with the app instance. """
    for module_name in \
            ['auth_login', 'auth_register', 'auth_logout', 'token_validate', 'token_refresh', 'users']:
        module = import_module(f'app.{module_name}.views')
        app.register_blueprint(module.bp)
        

def create_app(config_class):
    """ Creates the flask factory application. It returns the instance of app. """
    app = Flask(__name__)
    app.config.from_object(config_class)
    cors.init_app(
        app,
        resources={ r'/*': { "origins": ["http://localhost:3000"] } },
        supports_credentials=True
    )

    with app.app_context():
        register_bp(app)

        @app.route('/health_check', methods=['GET'])
        def health_check():
            from app.utils.config import send_response
            data = {'message': 'Application is running...'}
            return send_response(body=data, status_code=200)

    return app
