from pprint import pprint
from flask import Flask, make_response, jsonify
# from flask_cors import CORS


# cors = CORS()


def create_app(config_class):
    """ Creates the flask factory application. It returns the instance of app. """
    app = Flask(__name__)
    app.config.from_object(config_class)
    # cors.init_app(app, resources={
    #     r'/*': {"origins": "http://localhost:2000"}
    # })

    with app.app_context():
        from app.auth.views import bp
        app.register_blueprint(bp)

        return app
