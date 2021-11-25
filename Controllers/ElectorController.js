const { Ciudadanos } = require('../Models/Ciudadanos');
const { PuestoElectivo } = require('../Models/PuestoElectivo');
const { Candidatos } = require('../Models/Candidatos');
const { Partidos } = require('../Models/Partidos');
const { Votos } = require('../Models/Votos');
const { Elecciones } = require('../Models/Elecciones');
const nodemailer = require('nodemailer');


const { ChageLoginElectorToFalse, EditLoginElector } = require('../Util/Estado/LoginState');

/* const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "jjimenesjonsales@gmail.com",
        pass: "8297663269", // naturally, replace both with your real credentials or an application-specific password
    },
}); */

//Bregando Con El Estado
const GetLoginAdmin = () => {
    const { LoginAdmin } = require('../Util/Estado/LoginState');
    return LoginAdmin;
}
const GetLoginElector = () => {
    const { LoginElector } = require('../Util/Estado/LoginState');
    return LoginElector;
}


exports.GetHome = (req, res, next) => {
    if (GetLoginAdmin()) {
        res.redirect('/admin/opcciones');
    } else {
        if (!GetLoginElector().Estado) {
            res.render('Elector/Home.hbs', { PageTitle: 'Home', Alert: false, AlertMessage: '', LoginElector: GetLoginElector() });
        } else {
            res.redirect(`/puestos-electorales${GetLoginElector().DIdentidad}`);
        }
    }
}

exports.PostHome = async (req, res, next) => {
    if (GetLoginAdmin()) {
        res.redirect('/admin/opcciones');
    } else {
        if (!GetLoginElector().Estado) {
            try {
                const elecciones = await Elecciones.findAll({ where: { Estado: true } });
                if (elecciones[0]?.dataValues.Estado) {
                    const Ciudadano = await Ciudadanos.findByPk(req.body.DIdentidad);
                    if (Ciudadano === [] || Ciudadano == null) {
                        res.render('Elector/Home.hbs', { PageTitle: 'Home', Alert: true, AlertMessage: 'Documento de indentidad invalido', LoginElector: GetLoginElector() });
                    } else if (Ciudadano.dataValues.Estado) {
                        const CantidadDeVotosEnEstaEleccion = (await Votos.findAll({ where: { CiudadanoId: Ciudadano.dataValues.DocumentoDeIdentidad, EleccionId: elecciones[0]?.dataValues.Id } })).length;
                        const CantidadDePuestosActivos = (await PuestoElectivo.findAll({ where: { Estado: true } })).length;
                        console.log(CantidadDeVotosEnEstaEleccion);
                        console.log(CantidadDePuestosActivos);

                        if (CantidadDeVotosEnEstaEleccion !== CantidadDePuestosActivos) {
                            EditLoginElector({ Estado: true, DIdentidad: req.body.DIdentidad });
                            res.redirect(`/puestos-electorales${GetLoginElector().DIdentidad}`);
                        } else {
                            res.render('Elector/Home.hbs', { PageTitle: 'Home', Alert: true, AlertMessage: 'Usted ha completado el proceso de votacion', LoginElector: GetLoginElector() });
                        }
                    } else if (!Ciudadano.dataValues.Estado) {
                        res.render('Elector/Home.hbs', { PageTitle: 'Home', Alert: true, AlertMessage: 'Usted Se encuentra inactivo', LoginElector: GetLoginElector() });
                    }
                } else {
                    res.render('Elector/Home.hbs', { PageTitle: 'Home', Alert: true, AlertMessage: 'No hay ninguna eleccion en curso', LoginElector: GetLoginElector() });
                }
            } catch (error) {
                console.log(error);
                res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', LoginElector: GetLoginElector() });
            }
        } else {
            res.redirect(`/puestos-electorales${GetLoginElector().DIdentidad}`);
        }
    }
}

exports.GetPuestosElectorales = async (req, res, next) => {
    if (GetLoginAdmin()) {
        res.redirect('/admin/opcciones');
    } else {
        const { DIdentidad } = req.params;

        if (GetLoginElector().Estado) {
            try {
                const eleccionEnCurso = await Elecciones.findOne({ where: { Estado: true } });
                const VotosRealizados = (await Votos.findAll({ where: { CiudadanoId: DIdentidad, EleccionId: eleccionEnCurso.dataValues.Id } })).map(item => item.dataValues);
                const Puestos = (await PuestoElectivo.findAll({ where: { Estado: true } })).map((item) => {
                    const puesto = VotosRealizados.find(itemPuesto => item.Id == itemPuesto.PuestoElectivoId);
                    return puesto ? { ...item.dataValues, DIdentidad, Completado: true } : { ...item.dataValues, DIdentidad, Completado: false }
                });
                res.render('Elector/PuestosElectorales.hbs', { PageTitle: 'Puestos Electorales', Puestos: Puestos, LoginElector: GetLoginElector() });
            } catch (error) {
                console.log(error);
                res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', LoginElector: GetLoginElector() });
            }
        } else {
            res.redirect('/');
        }
    }
}

exports.GetCandidatos = async (req, res, next) => {
    if (GetLoginAdmin()) {
        res.redirect('/admin/opcciones');
    } else {
        if (GetLoginElector().Estado) {
            const { puesto } = req.params;
            const { DIdentidad } = req.params;
            try {
                const candidatos = (await Candidatos.findAll({ where: { puestoElectivoId: puesto, Estado: true }, include: [PuestoElectivo, Partidos], })).map(item => {
                    return { ...item?.dataValues, puesto_electivo: { ...item?.dataValues.puesto_electivo?.dataValues }, partido: { ...item?.dataValues.partido?.dataValues } }
                });
                res.render('Elector/Candidatos.hbs', { PageTitle: 'Candidatos', candidatos, LoginElector: GetLoginElector(), DIdentidad });

            } catch (error) {
                console.log(error);
                res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', LoginElector: GetLoginElector() });
            }
        } else {
            res.redirect('/');
        }
    }
}

exports.PostCandidatos = async (req, res, next) => {
    if (GetLoginAdmin()) {
        res.redirect('/admin/opcciones');
    } else {
        const { DIdentidad } = req.params;

        try {

            const { CandidatoIdSeleccionado } = req.body;

            const { Id } = await Elecciones.findOne({ where: { Estado: true } });
            const { puestoElectivoId } = await Candidatos.findOne({ where: { Id: CandidatoIdSeleccionado } });
            await Votos.create({ EleccionId: Id, CiudadanoId: DIdentidad, CandidatoId: CandidatoIdSeleccionado, PuestoElectivoId: puestoElectivoId });

            /* const cantidadDeVotos = (await Votos.findAll({ where: { EleccionId: Id, CiudadanoId: DIdentidad } })).length;
            const CantidadDePuestoElectivos = (await PuestoElectivo.findAll()).length;

            console.log(cantidadDeVotos);
            console.log(CantidadDePuestoElectivos);

            if (cantidadDeVotos !== CantidadDePuestoElectivos) {
                await transporter.sendMail({
                    from: "Sistema Elecciones notifications",
                    to: "rijoyohan52@gmail.com",
                    subject: `Welcome`,
                    html: `Usted  ha completado su proceso de votacion con exito`,
                }).then(() => console.log('mesage enviado con exito')).catch(error => console.error(error));
            } */

            res.redirect(`/puestos-electorales${DIdentidad}`);

        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', LoginElector: GetLoginElector() });
        }
    }
}

exports.GetLogoutElector = (req, res, next) => {
    ChageLoginElectorToFalse();
    res.redirect('/');
}


