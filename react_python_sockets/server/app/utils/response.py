from flask import make_response, jsonify


class Response:
    def __init__(self, message: str, status_code: int, data: dict = None):
        self.__message = message
        self.__status_code = status_code
        self.__data = data

    @property
    def emit(self):
        body = {'message': self.__message, 'status_code': self.__status_code}
        if self.__data is not None:
            body['data'] = self.__data
        response = make_response(jsonify(body))
        response.status_code = self.__status_code
        return response


class Success(Response):
    def __init__(self, message: str, status_code: int, data: dict = None):
        super().__init__(message, status_code, data)


class Error(Response):
    __defined_errors = {
        'ClientError': 400,
        'TokenError': 401,
    }

    def __init__(self, error: Exception):
        self.details = str(error)
        self.type = type(error).__name__
        super().__init__(self.details, self.error_code)

    @property
    def error_code(self):
        return self.__defined_errors.get(self.type, 500)
