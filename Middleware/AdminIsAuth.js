module.exports = (req, res, next) => {

    if (!req.session.AdminIsAuthenticated) {
        if (req.session.ElectorIsAuthenticated) {
            return res.redirect(`/puestos-electorales${req.session.Elector.DocumentoDeIdentidad}`);
        }
        if (req.url !== '/login') {
            return res.redirect('/admin/login');
        }
    } else {
        if (req.url === '/login') {
            return res.redirect('/admin/opcciones');
        }
    }

    next();
}