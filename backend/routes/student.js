const express = require('express');
const router = express.Router();

const {sviStudenti,sviStudentiJedanSmjer,sviRezultatiStudenta,sviPredmetiStudenta,sviStudentiPredmet, updateRezultat,sveInfoStudent} = require('../controllers/student');

router.get('/',sviStudenti);

router.get('/sviRezultati',sviRezultatiStudenta);
router.get('/sviPredmetiStudenta',sviPredmetiStudenta);
router.get('/:imeSmjera/:imeFakulteta',sviStudentiJedanSmjer)
router.get('/:imePredmeta/:imeSmjera/:imeFakulteta',sviStudentiPredmet);
router.put("/updateRezultat/:idRezultat",updateRezultat);
router.get('/sveInformacijeStudent',sveInfoStudent)



module.exports = router;