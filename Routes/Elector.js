const express = require('express');
const router = express.Router();

const ElectorController = require('../Controllers/ElectorController');
const ElectorIsAuthMiddleware = require('../Middleware/ElectorIsAuth');

router.get('/', ElectorIsAuthMiddleware, ElectorController.GetHome);
router.post('/', ElectorIsAuthMiddleware, ElectorController.PostHome);
router.get('/puestos-electorales:DIdentidad', ElectorIsAuthMiddleware, ElectorController.GetPuestosElectorales);
router.get('/puestos-electorales/candidatos:puesto/:DIdentidad', ElectorIsAuthMiddleware, ElectorController.GetCandidatos);
router.post('/puestos-electorales/candidatos:puesto/:DIdentidad', ElectorIsAuthMiddleware, ElectorController.PostCandidatos);
router.get('/logout-elector', ElectorIsAuthMiddleware, ElectorController.GetLogoutElector);

module.exports = router;