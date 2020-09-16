/*
    ruta: 'api/upload/:busqueda
*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { validarJWT } = require('../middleWares/validar-jwt');
const { fileUpload, retornaImg } = require('../controllers/uploads');


const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload);
router.get('/:tipo/:foto', retornaImg);

module.exports = router;