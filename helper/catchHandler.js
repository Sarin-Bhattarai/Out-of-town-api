/**
 * Handler to catch `async` operation errors.
 * Reduces having to write `try-catch` all the time.
 */

module.exports = {
  wrapAsync: (action) => (req, res, next) => action(req, res).catch(next),

  /**
   * Show useful information to client in development.
   */
  devErrorHandler: (err, req, res, next) => {
    err.stack = err.stack || "";
    const status = err.status || 500;
    const error = { message: err.message };
    res.status(status);
    res.json({ status, error });
  },
};
