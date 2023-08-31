const { BAD_REQUEST } = require('http-status');

class ValidationError extends Error {
  statusCode;

  constructor(message) {
    super();
    this.statusCode = BAD_REQUEST;
    this.message = message;
  }
}

module.exports = ValidationError;
