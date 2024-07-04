const express = require('express');
const router = express.Router();

const {sviPolozeni,brojPolozenih} = require('../controllers/polozeni')

router.get('/brojPolozenih',brojPolozenih);
router.get('/:brojStranice',sviPolozeni)

module.exports = router;