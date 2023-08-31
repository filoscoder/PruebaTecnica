const loggingMiddleware = (db) => async (req, res, next) => {
  const action = req.originalUrl;
  if (action === '/hfswapi/getLogs') {
    return next();
  }

  const ip = (
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    ''
  )
    .split(',')[0]
    .trim();
  const header = JSON.stringify(req.headers);

  // Persist this info on DB
  const info = {
    ip,
    header,
    action,
  };

  const log = await db.logging.create(info);

  next();
};

module.exports = loggingMiddleware;
