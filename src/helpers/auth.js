const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Sin autoridad.");
    res.redirect("/");
};

helpers.isSuperAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if(req.user.acess == "empleado"){
      return next();
    }
  }
  req.flash("error_msg", "Sin autoridad.");
  res.redirect("/");
};

module.exports = helpers;