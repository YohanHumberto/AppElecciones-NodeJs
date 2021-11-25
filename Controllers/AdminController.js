const { Usuarios } = require('../Models/Usuarios');
const { PuestoElectivo } = require('../Models/PuestoElectivo');
const { Partidos } = require('../Models/Partidos');
const { Ciudadanos } = require('../Models/Ciudadanos');
const { Candidatos } = require('../Models/Candidatos');
const { Elecciones } = require('../Models/Elecciones');
const { Votos } = require('../Models/Votos');


const { ChageLoginAdminToFalse, ChageLoginAdminToTrue } = require('../Util/Estado/LoginState');

const GetLoginAdmin = () => {
    const { LoginAdmin } = require('../Util/Estado/LoginState');
    return LoginAdmin;
}
const GetLoginElector = () => {
    const { LoginElector } = require('../Util/Estado/LoginState');
    return LoginElector;
}


exports.GetLogin = (req, res, next) => {
    if (GetLoginElector().Estado) {
        res.redirect(`/puestos-electorales${GetLoginElector().DIdentidad}`);
    } else {
        if (!GetLoginAdmin()) {
            res.render('Admin/Login.hbs', { PageTitle: 'Login', Alert: false, AlertMessage: '', Login: GetLoginAdmin() });
        } else {
            res.redirect('/admin/opcciones')
        }
    }
}
exports.PostLogin = async (req, res, next) => {
    if (!GetLoginAdmin()) {
        const UserName = req.body.UserName;
        const Password = req.body.Password;

        try {
            const usuario = await Usuarios.findAll({
                where: {
                    NombreDeUsuario: UserName,
                    Password: Password
                }
            })

            console.log(usuario);

            if (usuario.length > 0 && usuario !== null || UserName == "admin" && Password == "1234") {
                ChageLoginAdminToTrue();
                res.redirect('/admin/opcciones');
            } else {
                res.render('Admin/Login.hbs', { PageTitle: 'Login', Alert: true, AlertMessage: 'Usuario o Contraseña Incorrecto', Login: GetLoginAdmin() });
            }
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/opcciones')
    }
}


exports.GetOpciones = (req, res, next) => {
    GetLoginAdmin() ? res.render('admin/Opcciones.hbs', { PageTitle: 'Opcciones', Login: GetLoginAdmin() }) : res.redirect('/admin/login')
}


exports.GetOptCandidatos = async (req, res, next) => {
    if (GetLoginAdmin()) {
        try {
            const buttonDesactivarIsActive = (await Elecciones.findAll({ where: { Estado: true } })).length > 0 ? false : true;
            console.log(buttonDesactivarIsActive)
            const partidosLength = (await Partidos.findAll({ where: { Estado: true } })).length;
            const puestosLength = (await PuestoElectivo.findAll({ where: { Estado: true } })).length;
            const candidatos = (await Candidatos.findAll()).map(item => item.dataValues).filter(item => item.PartidoId !== -1 && item);
            const AgregarIsActive = partidosLength > 0 && puestosLength > 0 ? true : false;
            res.render('admin/Candidatos/OptCandidatos.hbs', { PageTitle: 'Candidatos', candidatos, Login: GetLoginAdmin(), AgregarIsActive, buttonDesactivarIsActive });
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/login')
    }

}
exports.GetFormCandidatos = async (req, res, next) => {
    if (GetLoginAdmin()) {
        const id = req.params.id;
        const puestos = (await PuestoElectivo.findAll({ where: { Estado: true } })).map(item => item.dataValues);
        const partidos = (await Partidos.findAll({ where: { Estado: true } })).map(item => item.dataValues);
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
                    Login: GetLoginAdmin()
                });
            } catch (error) {
                console.log(error);
                res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
            }

        } else {
            res.render('admin/Candidatos/FormCandidatos.hbs', {
                PageTitle: 'Agregar Candidato',
                puestos,
                partidos,
                Login: GetLoginAdmin()
            });
        }
    } else {
        res.redirect('/admin/login')
    }
}
exports.PostFormCandidatos = async (req, res, next) => {
    if (GetLoginAdmin()) {

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
                res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
            }

        } else {

            try {
                const Candidato = new Candidatos({ ...body, Foto: "/" + fotopath });
                await Candidato.save();
                res.redirect('/admin/opcciones/candidatos')
            } catch (error) {
                console.log(error);
                res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
            }

        }
    } else {
        res.redirect('/admin/login')
    }
}
exports.GetChangeEstadoCandidatos = async (req, res, next) => {
    if (GetLoginAdmin()) {
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
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/login')
    }
}



exports.GetOptCiudadanos = async (req, res, next) => {
    if (GetLoginAdmin()) {
        try {
            const buttonDesactivarIsActive = (await Elecciones.findAll({ where: { Estado: true } })).length > 0 ? false : true;
            const ciudadanos = (await Ciudadanos.findAll()).map(item => item.dataValues);
            console.log(ciudadanos)
            res.render('admin/Ciudadanos/OptCiudadanos.hbs', { PageTitle: 'Ciudadanos', ciudadanos, Login: GetLoginAdmin(), buttonDesactivarIsActive });
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/login')
    }
}
exports.GetFormCiudadanos = async (req, res, next) => {
    if (GetLoginAdmin()) {
        const id = req.params.id;

        if (id) {
            try {
                const ciudadano = await Ciudadanos.findByPk(id);
                console.log(ciudadano);
                if (ciudadano) {
                    res.render('admin/Ciudadanos/FormCiudadanos.hbs', { PageTitle: 'Form Ciudadanos', EditIsActive: true, ciudadano: ciudadano.dataValues, Login: GetLoginAdmin() });
                }
            } catch (error) {
                console.log(error);
                res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
            }
        } else {
            res.render('admin/Ciudadanos/FormCiudadanos.hbs', { PageTitle: 'Form Ciudadanos', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/login')
    }
}
exports.PostFormCiudadanos = async (req, res, next) => {
    if (GetLoginAdmin()) {
        const id = req.params.id;
        const { body } = req;

        if (id) {
            try {
                await Ciudadanos.update(body, { where: { DocumentoDeIdentidad: id } });
                res.redirect('/admin/opcciones/ciudadanos')
            } catch (error) {
                console.log(error);
                res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
            }
        } else {
            try {
                const Ciudadano = new Ciudadanos(req.body);
                await Ciudadano.save();
                res.redirect('/admin/opcciones/ciudadanos')
            } catch (error) {
                console.log(error);
                res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
            }
        }
    } else {
        res.redirect('/admin/login')
    }
}
exports.GetChangeEstadoCiudadanos = async (req, res, next) => {
    if (GetLoginAdmin()) {
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
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/login')
    }
}


exports.GetOptPartidos = async (req, res, next) => {
    if (GetLoginAdmin()) {
        try {
            const buttonDesactivarIsActive = (await Elecciones.findAll({ where: { Estado: true } })).length > 0 ? false : true;
            const partidos = (await Partidos.findAll()).map(item => item.dataValues);
            res.render('admin/Partidos/OptPartidos.hbs', { PageTitle: 'Partidos', partidos, Login: GetLoginAdmin(), buttonDesactivarIsActive });
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/login')
    }
}
exports.GetFormPartidos = async (req, res, next) => {
    if (GetLoginAdmin()) {
        const id = req.params.id;

        if (id) {
            try {
                const partido = await Partidos.findByPk(id);
                if (partido) {
                    res.render('admin/Partidos/FormPartidos.hbs', { PageTitle: 'Form Ciudadanos', EditIsActive: true, partido: partido.dataValues, Login: GetLoginAdmin() });
                }
            } catch (error) {
                console.log(error);
                res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
            }
        } else {
            res.render('admin/Partidos/FormPartidos.hbs', { PageTitle: 'Form Partidos', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/login')
    }
}
exports.PostFormPartidos = async (req, res, next) => {
    if (GetLoginAdmin()) {

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
                res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
            }

        } else {

            try {
                const Partido = new Partidos({ ...body, Logo: "/" + fotopath });
                await Partido.save();
                res.redirect('/admin/opcciones/partidos');
            } catch (error) {
                console.log(error);
                res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
            }

        }
    } else {
        res.redirect('/admin/login')
    }
}
exports.GetChangeEstadoPartidos = async (req, res, next) => {
    if (GetLoginAdmin()) {
        const id = req.params.id;
        const { body } = req;

        try {
            const partido = await Partidos.findByPk(id);
            if (partido) {
                if (partido.dataValues.Estado) {
                    const candidatosFromThisPartido = await Candidatos.findAll({ where: { Estado: true, PartidoId: partido.dataValues.Id } });
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
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/login')
    }
}



exports.GetOptPuestoElectivo = async (req, res, next) => {
    if (GetLoginAdmin()) {
        try {
            const buttonDesactivarIsActive = (await Elecciones.findAll({ where: { Estado: true } })).length > 0 ? false : true;
            const puestosElectivos = (await PuestoElectivo.findAll()).map(item => item.dataValues);
            console.log(puestosElectivos)
            res.render('admin/PuestosElectivos/OptPuestoElectivo.hbs', { PageTitle: 'Puesto Electivo', puestosElectivos, Login: GetLoginAdmin(), buttonDesactivarIsActive });
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/login')
    }
}
exports.GetFormPuestoElectivo = async (req, res, next) => {
    if (GetLoginAdmin()) {

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
            res.render('admin/PuestosElectivos/FormPuestosElectorales.hbs', { PageTitle: 'Form PuestoElectivo', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/login')
    }
}
exports.PostFormPuestoElectivo = async (req, res, next) => {
    if (GetLoginAdmin()) {
        const id = req.params.id;
        const { body } = req;

        if (id) {

            try {
                await PuestoElectivo.update(body, { where: { Id: id } });
                res.redirect('/admin/opcciones/puesto-electivo');
            } catch (error) {
                console.log(error);
                res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
            }

        } else {

            try {
                const puesto = new PuestoElectivo(body);
                await puesto.save();

                setTimeout(async () => {
                    const candidatoAgregadoID = await PuestoElectivo.findOne({ where: { Nombre: body.Nombre, Estado: true } });
                    const defaultCandidato = new Candidatos({
                        Nombre: 'Ninguno',
                        Apellido: 'Ninguno',
                        PartidoId: -1,
                        puestoElectivoId: candidatoAgregadoID.dataValues.Id,
                        Foto: 'https://elmunicipalista.net/wp-content/uploads/2019/11/23d5d064c34ff6b5b14cf3300447a5cc.jpg',
                        Estado: true
                    });
                    await defaultCandidato.save();
                    res.redirect('/admin/opcciones/puesto-electivo');
                }, 100);

            } catch (error) {
                console.log(error);
                res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
            }

        }
    } else {
        res.redirect('/admin/login')
    }
}
exports.GetchangeestadoPuestoElectivo = async (req, res, next) => {
    if (GetLoginAdmin()) {

        const id = req.params.id;

        try {
            const puestoElectivo = await PuestoElectivo.findByPk(id);
            if (puestoElectivo) {
                if (puestoElectivo.dataValues.Estado) {
                    const candidatosFromThisPuesto = await Candidatos.findAll({ where: { Estado: true, puestoElectivoId: puestoElectivo.dataValues.Id } });
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
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/login')
    }
}


exports.GetOptElecciones = async (req, res, next) => {
    if (GetLoginAdmin()) {
        try {
            const ExistElectionActive = (await Elecciones.findAll({ where: { Estado: true } })).map(item => item.dataValues).length > 0 ? true : false;
            const elecciones = (await Elecciones.findAll()).map(item => item.dataValues);
            res.render('admin/Elecciones/OptElecciones.hbs', { PageTitle: 'Puesto Electivo', elecciones, ExistElectionActive, Login: GetLoginAdmin() })
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/login')
    }
}
exports.GetFormElecciones = async (req, res, next) => {
    if (GetLoginAdmin()) {
        res.render('admin/Elecciones/FormElecciones.hbs', { PageTitle: 'Form Elecciones', Login: GetLoginAdmin() })
    } else {
        res.redirect('/admin/login')
    }
}
exports.PostFormElecciones = async (req, res, next) => {
    if (GetLoginAdmin()) {
        const { body } = req;
        const { id } = req.params;

        try {
            const CantidadDeCandidatos = (await Candidatos.findAll({ where: { Estado: true } })).length;
            if (CantidadDeCandidatos >= 1) {
                const eleccion = new Elecciones(body);
                await eleccion.save();
                res.redirect('/admin/opcciones/elecciones');
            } else {
                res.render('admin/Elecciones/FormElecciones.hbs', {
                    PageTitle: 'Form Elecciones',
                    Login: GetLoginAdmin(),
                    Alert: true,
                    AlertMessage: 'No se pudo crear la eleccion, porque no hay suficientes candidatos activos o creados'
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/login')
    }
}

exports.GetResultados = async (req, res, next) => {

    const { IdEleccion } = req.params;

    if (GetLoginAdmin()) {
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

            res.render('admin/Elecciones/Resultados.hbs', { PageTitle: 'Resulta dos', NewPuesto, Login: GetLoginAdmin() });
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/login')
    }
}
exports.GetChangeStateEleccionToFalse = async (req, res, next) => {
    if (GetLoginAdmin()) {
        const { id } = req.params;

        try {
            const eleccion = await Elecciones.findByPk(id);
            eleccion.update({ ...eleccion, Estado: false });
            res.redirect('/admin/opcciones/elecciones');
        } catch (error) {
            console.log(error);
            res.status(500).render('Error/500.hbs', { PageTitle: 'Error 500', Login: GetLoginAdmin() });
        }
    } else {
        res.redirect('/admin/login')
    }
}

exports.GetLogoutAdmin = (req, res, next) => {
    ChageLoginAdminToFalse();
    res.redirect('/admin/login');
}
