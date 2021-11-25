const express = require('express');
const router = express.Router();

const ElectorController = require('../Controllers/ElectorController');

router.get('/', ElectorController.GetHome);
router.post('/', ElectorController.PostHome);
router.get('/puestos-electorales:DIdentidad', ElectorController.GetPuestosElectorales);
router.get('/puestos-electorales/candidatos:puesto/:DIdentidad', ElectorController.GetCandidatos);
router.post('/puestos-electorales/candidatos:puesto/:DIdentidad', ElectorController.PostCandidatos);
router.get('/logout-elector', ElectorController.GetLogoutElector);

module.exports = router;