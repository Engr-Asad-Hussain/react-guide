""" It is the configuration file for the User Service 2.0 """
import os
import dotenv

# Parse the dotenv file and get key/value pair for dotenv.
dotenv.load_dotenv()


class Config:
    """ Common configurations for development and production environments """

    # Secrets/Tokens/keys Configurations
    ACCESS_TOKEN_SECRET = os.getenv('ACCESS_TOKEN_SECRET')
    REFRESH_TOKEN_SECRET = os.getenv('REFRESH_TOKEN_SECRET')

    # Application Properties
    JWT_EXT = 1
    JSONIFY_PRETTYPRINT_REGULAR = True
