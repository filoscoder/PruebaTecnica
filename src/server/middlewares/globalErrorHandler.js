const HttpStatus = require('http-status');
const { INTERNAL_SERVER_ERROR } = HttpStatus;

const globalErrorHandler = (err, _req, res, _next) => {
  const statusCode = HttpStatus[err.statusCode]
    ? err.statusCode
    : INTERNAL_SERVER_ERROR;

  res.status(statusCode).send({ statusCode, error: err.message });
};

module.exports = globalErrorHandler;
