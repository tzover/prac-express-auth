'use strict';

// クライアントのエラーを表す独自エラー
class ClientError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ClientError';
    this.statusCode = statusCode;
    Error.captureStackTrace(this, ClientError);
  }
}

module.exports = ClientError;
