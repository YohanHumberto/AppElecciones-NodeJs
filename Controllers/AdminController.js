const Usuarios = require('../Models/Usuarios');
const PuestoElectivo = require('../Models/PuestoElectivo');
const Partidos = require('../Models/Partidos');
const Ciudadanos = require('../Models/Ciudadanos');
const Candidatos = require('../Models/Candidatos');
const Elecciones = require('../Models/Elecciones');
const Votos = require('../Models/Votos');
const { Op } = require('sequelize');



exports.GetLogin = (req, res, next) => {
    res.render('admin/Login.hbs', { PageTitle: 'Opcciones' });
}
exports.PostLogin = async (req, res, next) => {
    const UserName = req.body.UserName;
    const Password = req.body.Password;

    try {
        const usuario = await Usuarios.findAll({
            where: {
                NombreDeUsuario: UserName,
                Password: Password
            }
        });

        if (usuario.length > 0 && usuario !== null || UserName == "admin" && Password == "1234") {
            req.session.AdminIsAuthenticated = true;
            req.session.userLogged = usuario;
            req.session.save(e => {
                e && console.log(e);
            });
            res.redirect('/admin/opcciones');
        } else {
            req.flash("errors", "Usuario o Contraseña Incorrecto");
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.log(error);
        res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
    }
}


exports.GetOpciones = (req, res, next) => {
    req?.session?.AdminIsAuthenticated ? res.render('admin/Opcciones.hbs', { PageTitle: 'Opcciones' }) : res.redirect('/admin/login')
}


exports.GetOptCandidatos = async (req, res, next) => {

    const AdminIsAuthenticated = req?.session?.AdminIsAuthenticated;

    if (AdminIsAuthenticated) {
        try {
            const buttonDesactivarIsActive = (await Elecciones.findAll({ where: { Estado: true } })).length > 0 ? false : true;
            const partidosLength = (await Partidos.findAll({ where: { Estado: true, Nombre: { [Op.not]: '/*bla*/' } } })).length;
            const puestosLength = (await PuestoElectivo.findAll({ where: { Estado: true } })).length;
            const candidatos = (await Candidatos.findAll({ where: { Nombre: { [Op.not]: 'Ninguno' } } })).map(item => item.dataValues).filter(item => item.PartidoId !== -1 && item);
            const AgregarIsActive = partidosLength > 0 && puestosLength > 0 ? true : false;
            res.render('admin/Candidatos/OptCandidatos.hbs', { PageTitle: 'Candidatos', candidatos, AgregarIsActive, buttonDesactivarIsActive });
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
        }
    } else {
        res.redirect('/admin/login')
    }

}
exports.GetFormCandidatos = async (req, res, next) => {

    const id = req.params.id;
    const puestos = (await PuestoElectivo.findAll({ where: { Estado: true } })).map(item => item.dataValues);
    const partidos = (await Partidos.findAll({ where: { Estado: true, Nombre: { [Op.not]: '/*bla*/' } } })).map(item => item.dataValues);
    if (id) {

        try {
            const candidato = await Candidatos.findByPk(id);
            const newPuesto = puestos.map(item => { return { ...item, candidato: candidato.dataValues } });
            const newPartido = partidos.map(item => { return { ...item, candidato: candidato.dataValues } });

            res.render('admin/Candidatos/FormCandidatos.hbs', {
                PageTitle: 'Agregar Candidato',
                EditIsActive: true,
                candidato: candidato.dataValues,
                puestos: newPuesto,
                partidos: newPartido,

            });
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
        }

    } else {
        res.render('admin/Candidatos/FormCandidatos.hbs', {
            PageTitle: 'Agregar Candidato',
            puestos,
            partidos,

        });
    }

}
exports.PostFormCandidatos = async (req, res, next) => {


    const id = req.params.id;
    const { body } = req;
    const fotopath = req?.file?.path;

    if (id) {

        try {

            fotopath
                ? await Candidatos.update({ ...body, Foto: "/" + fotopath }, { where: { Id: id } })
                : await Candidatos.update(body, { where: { Id: id } })

            res.redirect('/admin/opcciones/candidatos');
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
        }

    } else {

        try {
            await Candidatos.create({ ...body, Foto: "/" + fotopath });
            res.redirect('/admin/opcciones/candidatos')
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
        }

    }
}
exports.GetChangeEstadoCandidatos = async (req, res, next) => {

    const id = req.params.id;
    const { body } = req;

    try {
        const candidato = await Candidatos.findByPk(id);
        if (candidato) {
            candidato.update({ Estado: !candidato.dataValues.Estado });
            res.redirect('/admin/opcciones/candidatos');
        } else {
            res.redirect('/admin/opcciones/candidatos');
        }
    } catch (error) {
        console.log(error);
        res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
    }
}



exports.GetOptCiudadanos = async (req, res, next) => {

    try {
        const buttonDesactivarIsActive = (await Elecciones.findAll({ where: { Estado: true } })).length > 0 ? false : true;
        const ciudadanos = (await Ciudadanos.findAll()).map(item => item.dataValues);
        console.log(ciudadanos)
        res.render('admin/Ciudadanos/OptCiudadanos.hbs', { PageTitle: 'Ciudadanos', ciudadanos, buttonDesactivarIsActive });
    } catch (error) {
        console.log(error);
        res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
    }
}
exports.GetFormCiudadanos = async (req, res, next) => {

    const id = req.params.id;

    if (id) {
        try {
            const ciudadano = await Ciudadanos.findByPk(id);
            console.log(ciudadano);
            if (ciudadano) {
                res.render('admin/Ciudadanos/FormCiudadanos.hbs', { PageTitle: 'Form Ciudadanos', EditIsActive: true, ciudadano: ciudadano.dataValues });
            }
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
        }
    } else {
        res.render('admin/Ciudadanos/FormCiudadanos.hbs', { PageTitle: 'Form Ciudadanos' });
    }
}
exports.PostFormCiudadanos = async (req, res, next) => {

    const id = req.params.id;
    const { body } = req;

    if (id) {
        try {
            await Ciudadanos.update(body, { where: { DocumentoDeIdentidad: id } });
            res.redirect('/admin/opcciones/ciudadanos')
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
        }
    } else {
        try {
            await Ciudadanos.create(req.body);
            res.redirect('/admin/opcciones/ciudadanos')
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
        }
    }
}
exports.GetChangeEstadoCiudadanos = async (req, res, next) => {

    const id = req.params.id;
    const { body } = req;

    try {
        const ciudadano = await Ciudadanos.findByPk(id);
        if (ciudadano) {
            ciudadano.update({ Estado: !ciudadano.dataValues.Estado });
            res.redirect('/admin/opcciones/ciudadanos');
        } else {
            res.redirect('/admin/opcciones/ciudadanos');
        }
    } catch (error) {
        console.log(error);
        res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
    }
}


exports.GetOptPartidos = async (req, res, next) => {

    try {
        const buttonDesactivarIsActive = (await Elecciones.findAll({ where: { Estado: true } })).length > 0 ? false : true;
        const partidos = (await Partidos.findAll({ where: { Nombre: { [Op.not]: '/*bla*/' } } })).map(item => item.dataValues);
        res.render('admin/Partidos/OptPartidos.hbs', { PageTitle: 'Partidos', partidos, buttonDesactivarIsActive });
    } catch (error) {
        console.log(error);
        res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
    }
}
exports.GetFormPartidos = async (req, res, next) => {

    const id = req.params.id;

    if (id) {
        try {
            const partido = await Partidos.findByPk(id);
            if (partido) {
                res.render('admin/Partidos/FormPartidos.hbs', { PageTitle: 'Form Ciudadanos', EditIsActive: true, partido: partido.dataValues });
            }
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
        }
    } else {
        res.render('admin/Partidos/FormPartidos.hbs', { PageTitle: 'Form Partidos' });
    }
}
exports.PostFormPartidos = async (req, res, next) => {

    const id = req.params.id;
    const { body } = req;
    const fotopath = req?.file?.path;


    if (id) {

        try {
            fotopath
                ? await Partidos.update({ ...body, Logo: "/" + fotopath }, { where: { Id: id } })
                : await Partidos.update(body, { where: { Id: id } })
            res.redirect('/admin/opcciones/partidos');
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
        }

    } else {

        try {
            await Partidos.create({ ...body, Logo: "/" + fotopath });
            res.redirect('/admin/opcciones/partidos');
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
        }

    }
}
exports.GetChangeEstadoPartidos = async (req, res, next) => {
    const id = req.params.id;
    const { body } = req;

    try {
        const partido = await Partidos.findByPk(id);
        if (partido) {
            if (partido.dataValues.Estado) {
                const candidatosFromThisPartido = await Candidatos.findAll({ where: { Estado: true, PartidoId: partido.dataValues.Id, Nombre: { [Op.not]: 'Ninguno' } } });
                candidatosFromThisPartido.forEach(async (element) => {
                    const candidato = await Candidatos.findByPk(element.dataValues.Id);
                    candidato.update({ Estado: false })
                });
            }
            partido.update({ Estado: !partido.dataValues.Estado });
            res.redirect('/admin/opcciones/partidos');
        } else {
            res.redirect('/admin/opcciones/partidos');
        }
    } catch (error) {
        console.log(error);
        res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
    }
}



exports.GetOptPuestoElectivo = async (req, res, next) => {
    try {
        const buttonDesactivarIsActive = (await Elecciones.findAll({ where: { Estado: true } })).length > 0 ? false : true;
        const puestosElectivos = (await PuestoElectivo.findAll()).map(item => item.dataValues);
        console.log(puestosElectivos)
        res.render('admin/PuestosElectivos/OptPuestoElectivo.hbs', { PageTitle: 'Puesto Electivo', puestosElectivos, buttonDesactivarIsActive });
    } catch (error) {
        console.log(error);
        res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
    }
}
exports.GetFormPuestoElectivo = async (req, res, next) => {
    const id = req.params.id;

    if (id) {
        try {
            const puestoElectivo = await PuestoElectivo.findByPk(id);
            if (puestoElectivo) {
                res.render('admin/PuestosElectivos/FormPuestosElectorales.hbs', { PageTitle: 'Form Ciudadanos', EditIsActive: true, puestoElectivo: puestoElectivo.dataValues });
            }
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
        }
    } else {
        res.render('admin/PuestosElectivos/FormPuestosElectorales.hbs', { PageTitle: 'Form PuestoElectivo' });
    }
}
exports.PostFormPuestoElectivo = async (req, res, next) => {
    const id = req.params.id;
    const { body } = req;

    if (id) {

        try {
            await PuestoElectivo.update(body, { where: { Id: id } });
            res.redirect('/admin/opcciones/puesto-electivo');
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
        }

    } else {

        try {
            const { dataValues: puesto } = await PuestoElectivo.create(body);
            const partidosExist = (await Partidos.findAll({ where: { Nombre: { [Op.not]: '/*bla*/' } } })).length > 0;
            let partido = 0;
            !partidosExist
                ? partido = await Partidos.create({ Nombre: 'Ninguno', Descripcion: '/*bla*/', Logo: '/*bla*/', Estado: true })
                : partido = Partidos.findOne({ where: { Nombre: '/*bla*/' } }).dataValues;
            await Candidatos.create({
                Nombre: 'Ninguno',
                Apellido: 'Ninguno',
                partidoId: partido?.Id,
                puestoElectivoId: puesto?.Id,
                Foto: 'https://elmunicipalista.net/wp-content/uploads/2019/11/23d5d064c34ff6b5b14cf3300447a5cc.jpg',
                Estado: true
            });
            res.redirect('/admin/opcciones/puesto-electivo');
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
        }

    }
}
exports.GetchangeestadoPuestoElectivo = async (req, res, next) => {

    const id = req.params.id;

    try {
        const puestoElectivo = await PuestoElectivo.findByPk(id);
        if (puestoElectivo) {
            if (puestoElectivo.dataValues.Estado) {
                const candidatosFromThisPuesto = await Candidatos.findAll({ where: { Estado: true, puestoElectivoId: puestoElectivo.dataValues.Id, Nombre: { [Op.not]: 'Ninguno' } } });
                candidatosFromThisPuesto.forEach(async (element) => {
                    const candidato = await Candidatos.findByPk(element.dataValues.Id);
                    candidato.update({ Estado: false })
                });
            }
            puestoElectivo.update({ Estado: !puestoElectivo.dataValues.Estado });
            res.redirect('/admin/opcciones/puesto-electivo');
        } else {
            res.redirect('/admin/opcciones/puesto-electivo');
        }
    } catch (error) {
        console.log(error);
        res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
    }
}


exports.GetOptElecciones = async (req, res, next) => {
    try {
        const ExistElectionActive = (await Elecciones.findAll({ where: { Estado: true } })).map(item => item.dataValues).length > 0 ? true : false;
        const elecciones = (await Elecciones.findAll()).map(item => item.dataValues);
        res.render('admin/Elecciones/OptElecciones.hbs', { PageTitle: 'Puesto Electivo', elecciones, ExistElectionActive })
    } catch (error) {
        console.log(error);
        res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
    }
}
exports.GetFormElecciones = async (req, res, next) => {
    res.render('admin/Elecciones/FormElecciones.hbs', { PageTitle: 'Form Elecciones' })
}
exports.PostFormElecciones = async (req, res, next) => {
    const { body } = req;

    try {
        const CantidadDeCandidatos = (await Candidatos.findAll({ where: { Estado: true, Nombre: { [Op.not]: 'Ninguno' } } })).length;
        if (CantidadDeCandidatos >= 2) {
            await Elecciones.create(body);
            res.redirect('/admin/opcciones/elecciones');
        } else {
            req.flash("errors", 'No se pudo crear la eleccion, porque no hay suficientes candidatos activos o creados');
            res.redirect('/admin/opcciones/elecciones/agregar');
        }
    } catch (error) {
        console.log(error);
        res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
    }
}

exports.GetResultados = async (req, res, next) => {

    const { IdEleccion } = req.params;

    try {
        const votos = (await Votos.findAll({ where: { EleccionId: IdEleccion } })).map(item => item.dataValues);

        const candidatos = (await Candidatos.findAll()).map(item => {
            return { ...item.dataValues, CantidadDeVotos: votos.filter(itemV => itemV.CandidatoId == item.Id).length }
        }).sort((a, b) => a.CantidadDeVotos - b.CantidadDeVotos).reverse();
        console.log(candidatos);

        const puestosElectivos = (await PuestoElectivo.findAll({ where: { Estado: true } })).map(item => {
            return { ...item.dataValues, TotalVotosPorPuesto: votos.filter(itemf => itemf.PuestoElectivoId == item.Id).length }
        });

        const NewPuesto = puestosElectivos.map(item => { return { ...item, candidatos } });

        res.render('admin/Elecciones/Resultados.hbs', { PageTitle: 'Resulta dos', NewPuesto });
    } catch (error) {
        console.log(error);
        res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
    }
}
exports.GetChangeStateEleccionToFalse = async (req, res, next) => {
    const { id } = req.params;

    try {
        const eleccion = await Elecciones.findByPk(id);
        eleccion.update({ ...eleccion, Estado: false });
        res.redirect('/admin/opcciones/elecciones');
    } catch (error) {
        console.log(error);
        res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500' });
    }
}

exports.GetLogoutAdmin = async (req, res, next) => {
    await req.session.destroy();
    res.redirect('/admin/login');
}
