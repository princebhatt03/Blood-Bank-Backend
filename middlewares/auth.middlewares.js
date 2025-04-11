export default (req, res, next) => {
  if (req.session && req.session.admin) {
    return next();
  }

  if (req.flash) {
    req.flash(
      'error',
      'You must be logged in as an admin to access this page.'
    );
  }

  res.redirect('/adminLogin');
};
