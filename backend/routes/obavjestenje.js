const express = require('express');
const router = express.Router();

const {svaObavjestenjaPredmet,insertObavjestenje,updateObavjestenje,jednoObavjestenje, deleteObavjestenje,brojNeprocitanih,svaNeprocitanaObavjestenjaPredmet, deleteNeprocitanoObavjestenje,brojNeprocitanihUkupno, brojObavjestenja} = require('../controllers/obavjestenje')

router.get('/brojObavjestenja/:imePredmeta/:imeSmjera/:imeFakulteta',brojObavjestenja)
router.get('/neprocitanaObavjestenja/:imePredmeta/:imeSmjera/:imeFakulteta',svaNeprocitanaObavjestenjaPredmet);
router.get('/brojNeprocitanih/:imePredmeta/:imeSmjera/:imeFakulteta',brojNeprocitanih);
router.get('/:imePredmeta/:imeSmjera/:imeFakulteta/',svaObavjestenjaPredmet);

router.get('/brojNeprocitanihUkupno/',brojNeprocitanihUkupno);
router.post('/:imePredmeta/:imeSmjera/:imeFakulteta',insertObavjestenje);
router.delete('/neprocitano/:idObavjestenja',deleteNeprocitanoObavjestenje);
router.put('/:idObavjestenja',updateObavjestenje);
router.get('/:idObavjestenja',jednoObavjestenje);
router.delete('/:idObavjestenja',deleteObavjestenje);


module.exports = router;