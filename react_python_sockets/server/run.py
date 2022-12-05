from config import Config
from app import create_app


app, socket = create_app(Config)

if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=5000)
    socket.run(app)
