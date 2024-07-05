const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');

const materijaliController = require('../controllers/materijal.js');

router.use(fileUpload({createParentPath: true}));
router.get('/MaterijaliProfesora', materijaliController.sviMaterijaliProfesora);
router.get('/MaterijaliPredmeta/:imePredmeta/:imeSmjera/:imeFakulteta', materijaliController.sviMaterijaliPredmet);
router.get('/UkupanBrojMaterijala/:imePredmeta/:imeSmjera/:imeFakulteta',materijaliController.ukupanBrojMaterijala);
router.get('/PreuzmiMaterijal/:ime', materijaliController.downloadMaterial);
router.post('/PostaviMaterijal', materijaliController.okaciMaterijal);
router.delete('/ObrisiMaterijal/:id/:imeMaterijala', materijaliController.obrisiMaterijal);

module.exports = router;