

export class HttpError {

  message;
  status = 500;
  constructor(message, status?: number) {
    this.message = message;
    this.status = status;
  }
}

export function errorHandler(err, req, res, next) {
    if(err.stack) console.error(err.stack);
    err.status ? res.status(err.status) : res.status(500);
    res.json(err);
}