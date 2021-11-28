module.exports = (req, res, next) => {

    if (!req.session.ElectorIsAuthenticated) {
        if (req.session.AdminIsAuthenticated) {
            return res.redirect('/admin/opcciones');
        }
        if (req.url !== '/') {
            return res.redirect('/');
        }
    } else {
        if (req.url === '/') {
            return res.redirect(`/puestos-electorales${req.session.Elector.DocumentoDeIdentidad}`);
        }
    }

    next();
}