const express = require('express');
const router = express.Router();

const AdminController = require('../Controllers/AdminController');
const AdminIsAuthMiddleware = require('../Middleware/AdminIsAuth');


router.get('/login', AdminIsAuthMiddleware, AdminController.GetLogin);
router.post('/login', AdminIsAuthMiddleware, AdminController.PostLogin);


router.get('/opcciones', AdminIsAuthMiddleware, AdminController.GetOpciones);

router.get('/opcciones/candidatos', AdminIsAuthMiddleware, AdminController.GetOptCandidatos);
router.get('/opcciones/candidatos/agregar', AdminIsAuthMiddleware, AdminController.GetFormCandidatos);
router.post('/opcciones/candidatos/agregar', AdminIsAuthMiddleware, AdminController.PostFormCandidatos);
router.get('/opcciones/candidatos/editar:id', AdminIsAuthMiddleware, AdminController.GetFormCandidatos);
router.post('/opcciones/candidatos/editar:id', AdminIsAuthMiddleware, AdminController.PostFormCandidatos);
router.get('/opcciones/candidatos/changeestado:id', AdminIsAuthMiddleware, AdminController.GetChangeEstadoCandidatos);

router.get('/opcciones/ciudadanos', AdminIsAuthMiddleware, AdminController.GetOptCiudadanos);
router.get('/opcciones/ciudadanos/agregar', AdminIsAuthMiddleware, AdminController.GetFormCiudadanos);
router.post('/opcciones/ciudadanos/agregar', AdminIsAuthMiddleware, AdminController.PostFormCiudadanos);
router.get('/opcciones/ciudadanos/editar:id', AdminIsAuthMiddleware, AdminController.GetFormCiudadanos);
router.post('/opcciones/ciudadanos/editar:id', AdminIsAuthMiddleware, AdminController.PostFormCiudadanos);
router.get('/opcciones/ciudadanos/changeestado:id', AdminIsAuthMiddleware, AdminController.GetChangeEstadoCiudadanos);

router.get('/opcciones/partidos', AdminIsAuthMiddleware, AdminController.GetOptPartidos);
router.get('/opcciones/partidos/agregar', AdminIsAuthMiddleware, AdminController.GetFormPartidos);
router.post('/opcciones/partidos/agregar', AdminIsAuthMiddleware, AdminController.PostFormPartidos);
router.get('/opcciones/partidos/editar:id', AdminIsAuthMiddleware, AdminController.GetFormPartidos);
router.post('/opcciones/partidos/editar:id', AdminIsAuthMiddleware, AdminController.PostFormPartidos);
router.get('/opcciones/partidos/changeestado:id', AdminIsAuthMiddleware, AdminController.GetChangeEstadoPartidos);

router.get('/opcciones/puesto-electivo', AdminIsAuthMiddleware, AdminController.GetOptPuestoElectivo);
router.get('/opcciones/puesto-electivo/agregar', AdminIsAuthMiddleware, AdminController.GetFormPuestoElectivo);
router.post('/opcciones/puesto-electivo/agregar', AdminIsAuthMiddleware, AdminController.PostFormPuestoElectivo);
router.get('/opcciones/puesto-electivo/editar:id', AdminIsAuthMiddleware, AdminController.GetFormPuestoElectivo);
router.post('/opcciones/puesto-electivo/editar:id', AdminIsAuthMiddleware, AdminController.PostFormPuestoElectivo);
router.get('/opcciones/puesto-electivo/changeestado:id', AdminIsAuthMiddleware, AdminController.GetchangeestadoPuestoElectivo);

router.get('/opcciones/elecciones', AdminIsAuthMiddleware, AdminController.GetOptElecciones);
router.get('/opcciones/elecciones/agregar', AdminIsAuthMiddleware, AdminController.GetFormElecciones);
router.post('/opcciones/elecciones/agregar', AdminIsAuthMiddleware, AdminController.PostFormElecciones);
router.get('/opcciones/elecciones/chagestate:id', AdminIsAuthMiddleware, AdminController.GetChangeStateEleccionToFalse);
router.get('/opcciones/elecciones/resultados:IdEleccion', AdminIsAuthMiddleware, AdminController.GetResultados);

router.get('/logout-admin', AdminIsAuthMiddleware, AdminController.GetLogoutAdmin);

module.exports = router;