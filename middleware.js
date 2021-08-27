
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
         //store url where they are requesting from
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}
