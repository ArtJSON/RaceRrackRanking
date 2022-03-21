module.exports = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in to add a new race track');
        return res.redirect('/login');
    }
    next();
}
