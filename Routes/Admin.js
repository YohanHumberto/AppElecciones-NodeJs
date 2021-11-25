const express = require('express');
const router = express.Router();

const AdminController = require('../Controllers/AdminController');


router.get('/login', AdminController.GetLogin);
router.post('/login', AdminController.PostLogin);


router.get('/opcciones', AdminController.GetOpciones);

router.get('/opcciones/candidatos', AdminController.GetOptCandidatos);
router.get('/opcciones/candidatos/agregar', AdminController.GetFormCandidatos);
router.post('/opcciones/candidatos/agregar', AdminController.PostFormCandidatos);
router.get('/opcciones/candidatos/editar:id', AdminController.GetFormCandidatos);
router.post('/opcciones/candidatos/editar:id', AdminController.PostFormCandidatos);
router.get('/opcciones/candidatos/changeestado:id', AdminController.GetChangeEstadoCandidatos);

router.get('/opcciones/ciudadanos', AdminController.GetOptCiudadanos);
router.get('/opcciones/ciudadanos/agregar', AdminController.GetFormCiudadanos);
router.post('/opcciones/ciudadanos/agregar', AdminController.PostFormCiudadanos);
router.get('/opcciones/ciudadanos/editar:id', AdminController.GetFormCiudadanos);
router.post('/opcciones/ciudadanos/editar:id', AdminController.PostFormCiudadanos);
router.get('/opcciones/ciudadanos/changeestado:id', AdminController.GetChangeEstadoCiudadanos);

router.get('/opcciones/partidos', AdminController.GetOptPartidos);
router.get('/opcciones/partidos/agregar', AdminController.GetFormPartidos);
router.post('/opcciones/partidos/agregar', AdminController.PostFormPartidos);
router.get('/opcciones/partidos/editar:id', AdminController.GetFormPartidos);
router.post('/opcciones/partidos/editar:id', AdminController.PostFormPartidos);
router.get('/opcciones/partidos/changeestado:id', AdminController.GetChangeEstadoPartidos);

router.get('/opcciones/puesto-electivo', AdminController.GetOptPuestoElectivo);
router.get('/opcciones/puesto-electivo/agregar', AdminController.GetFormPuestoElectivo);
router.post('/opcciones/puesto-electivo/agregar', AdminController.PostFormPuestoElectivo);
router.get('/opcciones/puesto-electivo/editar:id', AdminController.GetFormPuestoElectivo);
router.post('/opcciones/puesto-electivo/editar:id', AdminController.PostFormPuestoElectivo);
router.get('/opcciones/puesto-electivo/changeestado:id', AdminController.GetchangeestadoPuestoElectivo);

router.get('/opcciones/elecciones', AdminController.GetOptElecciones);
router.get('/opcciones/elecciones/agregar', AdminController.GetFormElecciones);
router.post('/opcciones/elecciones/agregar', AdminController.PostFormElecciones);
router.get('/opcciones/elecciones/chagestate:id', AdminController.GetChangeStateEleccionToFalse);
router.get('/opcciones/elecciones/resultados:IdEleccion', AdminController.GetResultados);

router.get('/logout-admin', AdminController.GetLogoutAdmin);

module.exports = router;