const Ciudadanos = require('../Models/Ciudadanos');
const PuestoElectivo = require('../Models/PuestoElectivo');
const Candidatos = require('../Models/Candidatos');
const Partidos = require('../Models/Partidos');
const Votos = require('../Models/Votos');
const Elecciones = require('../Models/Elecciones');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "jjimenesjonsales@gmail.com",
        pass: "8297663269", // naturally, replace both with your real credentials or an application-specific password
    },
});

//Bregando Con El Estado


exports.GetHome = (req, res, next) => {
    res.status(500).render('Elector/Home.hbs', { PageTitle: 'Home' });
}

exports.PostHome = async (req, res, next) => {
    try {
        const elecciones = await Elecciones.findAll({ where: { Estado: true } });
        if (elecciones[0]?.dataValues.Estado) {
            const Ciudadano = await Ciudadanos.findByPk(req.body.DIdentidad);
            if (Ciudadano === [] || Ciudadano == null) {
                req.flash("errors", "Documento de indentidad invalido");
                res.redirect('/');
            } else if (Ciudadano.dataValues.Estado) {
                const CantidadDeVotosEnEstaEleccion = (await Votos.findAll({ where: { CiudadanoId: Ciudadano.dataValues.DocumentoDeIdentidad, EleccionId: elecciones[0]?.dataValues.Id } })).length;
                const CantidadDePuestosActivos = (await PuestoElectivo.findAll({ where: { Estado: true } })).length;
                console.log(CantidadDeVotosEnEstaEleccion);
                console.log(CantidadDePuestosActivos);

                if (CantidadDeVotosEnEstaEleccion !== CantidadDePuestosActivos) {
                    req.session.ElectorIsAuthenticated = true;
                    req.session.Elector = Ciudadano.dataValues;
                    req.session.save();
                    res.redirect(`/puestos-electorales${req.session.Elector.DocumentoDeIdentidad}`);
                } else {
                    req.flash("errors", "Usted ha completado el proceso de votacion");
                    res.redirect('/');
                }
            } else if (!Ciudadano.dataValues.Estado) {
                req.flash("errors", "Usted Se encuentra inactivo");
                res.redirect('/');
            }
        } else {
            req.flash("errors", "No hay ninguna eleccion en curso");
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
        res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
    }
}

exports.GetPuestosElectorales = async (req, res, next) => {
    const { DIdentidad } = req.params;

    if (req.session.ElectorIsAuthenticated) {
        try {
            const eleccionEnCurso = await Elecciones.findOne({ where: { Estado: true } });
            const VotosRealizados = (await Votos.findAll({ where: { CiudadanoId: DIdentidad, EleccionId: eleccionEnCurso.dataValues.Id } })).map(item => item.dataValues);
            const Puestos = (await PuestoElectivo.findAll({ where: { Estado: true } })).map((item) => {
                const puesto = VotosRealizados.find(itemPuesto => item.Id == itemPuesto.PuestoElectivoId);
                return puesto ? { ...item.dataValues, DIdentidad, Completado: true } : { ...item.dataValues, DIdentidad, Completado: false }
            });
            res.render('Elector/PuestosElectorales.hbs', { PageTitle: 'Puestos Electorales', Puestos: Puestos });
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
        }
    }
}

exports.GetCandidatos = async (req, res, next) => {
    const { puesto } = req.params;
    const { DIdentidad } = req.params;
    try {
        const candidatos = (await Candidatos.findAll({ where: { puestoElectivoId: puesto, Estado: true }, include: [PuestoElectivo, Partidos], })).map(item => {
            return { ...item?.dataValues, puesto_electivo: { ...item?.dataValues.puesto_electivo?.dataValues }, partido: { ...item?.dataValues.partido?.dataValues } }
        });
        console.log(candidatos)
        res.render('Elector/Candidatos.hbs', { PageTitle: 'Candidatos', candidatos, DIdentidad });

    } catch (error) {
        console.log(error);
        res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
    }
}

exports.PostCandidatos = async (req, res, next) => {
    const { DIdentidad } = req.params;

    try {

        const { CandidatoIdSeleccionado } = req.body;

        const { Id } = await Elecciones.findOne({ where: { Estado: true } });
        const { puestoElectivoId } = await Candidatos.findOne({ where: { Id: CandidatoIdSeleccionado } });
        await Votos.create({ EleccionId: Id, CiudadanoId: DIdentidad, CandidatoId: CandidatoIdSeleccionado, PuestoElectivoId: puestoElectivoId });

        const cantidadDeVotos = (await Votos.findAll({ where: { EleccionId: Id, CiudadanoId: DIdentidad } })).length;
        const CantidadDePuestoElectivos = (await PuestoElectivo.findAll({ where: { Estado: true } })).length;

        if (cantidadDeVotos !== CantidadDePuestoElectivos) {
            console.log('///////////////////this is mail ////////////////////');
            await transporter.sendMail({
                from: "jjimenesjonsales@gmail.com",
                to: "rijoyohan52@gmail.com",
                subject: `Welcome`,
                html: `Usted  ha completado su proceso de votacion con exito`,
            }).then(() => console.log('mesage enviado con exito')).catch(error => console.error(error));
        }

        res.redirect(`/puestos-electorales${DIdentidad}`);

    } catch (error) {
        console.log(error);
        res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
    }
}

exports.GetLogoutElector = async (req, res, next) => {
    await req.session.destroy();
    res.redirect('/');
}


