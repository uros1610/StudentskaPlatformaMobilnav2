const express = require('express');
const router = express.Router();

const {sviPredmetiProfesora,sveInfoProfesor, sviRezultatiPredmet,sviFakultetiProfesora,sviSmjeroviProfesora} = require('../controllers/profesor');

router.get('/sviPredmetiProfesora',sviPredmetiProfesora);
router.get('/sviFakultetiProfesora',sviFakultetiProfesora);
router.get('/sviSmjeroviProfesora/:imeFakulteta',sviSmjeroviProfesora);
router.get('/sveInformacijeProfesor',sveInfoProfesor)
router.get('/sviRezultati/:imePredmeta/:imeSmjera/:imeFakulteta',sviRezultatiPredmet)



module.exports = router;