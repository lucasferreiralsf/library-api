

export class HttpError {

  message;
  status = 500;
  constructor(message, status?: number) {
    this.message = message;
    this.status = status;
  }
}

export function errorHandler(err, req, res, next) {
    err.status ? res.status(err.status) : res.status(500);
    res.json(err);
}