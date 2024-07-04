const express = require('express')

const router = express.Router()

const {sveProvjereDatumi, insertProvjera} = require('../controllers/provjera')

router.get('/:imePredmeta/:imeSmjera/:imeFakulteta',sveProvjereDatumi);
router.post('/:imePredmeta/:imeSmjera/:imeFakulteta',insertProvjera)


module.exports = router;