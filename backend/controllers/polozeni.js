const jwt = require('jsonwebtoken');
const db = require('../db')

require('dotenv').config();

const sviPolozeni = (req,res) => {
    const token = req.headers.authorization.split(" ")[1];

    if(!token) {
        return res.status(401).json("Unauthorized!");
    }

    const limit = 5;
    const offset = (req.params.brojStranice-1)*5;
    
    console.log("usaoAAAAAAA");

    jwt.verify(token,process.env.SECRET_KEY,(err,decoded) => {
        if(err) {
            return res.status(401).json("Unauthorized!");
        }
        const q = `SELECT * FROM Svi_Ispiti si INNER JOIN Predmet p ON p.ime_predmeta = si.ime_predmeta 
        AND p.ime_smjera = si.ime_smjera AND
        p.ime_fakulteta = si.ime_fakulteta WHERE korisnickoime_studenta = ? AND brojPoena >= 50 LIMIT ?,?`

        db.query(q,[decoded.korisnickoIme,offset,limit],(err,data) => {
            if(err) {
                return res.status(500).json("Internal server error!");
            }
            return res.status(200).json(data);
        })
    })
}

const brojPolozenih = (req,res) => {
    const token = req.headers.authorization.split(" ")[1];

    if(!token) {
        return res.status(401).json("Unauthorized!");
    }

    console.log("usaoXD");
    

    jwt.verify(token,process.env.SECRET_KEY,(err,decoded) => {
        if(err) {
            return res.status(401).json("Unauthorized!");
        }
        const q = "SELECT COUNT(*) AS brojPolozenih FROM Svi_Ispiti WHERE korisnickoime_studenta = ? AND brojPoena >= 50"

        db.query(q,[decoded.korisnickoIme],(err,data) => {
            if(err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(data);
        })
    })
}

module.exports = {sviPolozeni,brojPolozenih}