module.exports.isUserLogedIn = (req, res, next) => {
  console.log("Req.session.isUserLogedIn", req.session.isUserLogedIn)
  if (req.session.isUserLogedIn === undefined) {
    res.redirect('/login');
    return
  }
  if (req.session.isUserLogedIn === true) {
    next()
  }
}