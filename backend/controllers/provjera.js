const db = require('../db')
const jwt = require('jsonwebtoken');

const sveProvjereDatumi = (req,res) => {

    const {imePredmeta,imeSmjera,imeFakulteta} = req.params;
    const query = "SELECT DISTINCT ime_predmeta,ime_smjera,ime_fakulteta,datum_odrzavanja,ime_provjere FROM Rezultat WHERE ime_predmeta = ? AND ime_smjera = ? AND ime_fakulteta = ?"

    db.query(query,[imePredmeta,imeSmjera,imeFakulteta],(err,data) => {

        if(err) {
            return res.status(500).json("Internal server error!");
        }
        else {
            return res.status(200).json(data);
        }
    })
}

const insertProvjera = (req , res) => {

    const token = req.headers.authorization.split(" ")[1];
    const {imePredmeta,imeSmjera,imeFakulteta} = req.params;
    const {datumOdrzavanja,imeProvjere} = req.body;

    if(!token) {
        return res.status(401).json("Unauthorized!");
    }

    jwt.verify(token,process.env.SECRET_KEY,(err,decoded) => {
        if(err || decoded.rola === 'Student') {
            return res.status(401).json("Unauthorized!");
        } 
        const query = "SELECT * FROM Profesor_predmet WHERE korisnickoime_profesora = ? AND ime_predmeta = ? AND ime_smjera = ? AND ime_fakulteta = ?"

        db.query(query,[decoded.korisnickoIme,imePredmeta,imeSmjera,imeFakulteta],(err,data) => {
            if(err) {
                return res.status(500).json(err);
            }
            if(!data.length) {
                return res.status(403).json("Forbidden!");
            }
            const q2 = "SELECT korisnickoime_studenta AS korisnickoIme FROM Pohadja WHERE ime_predmeta = ? AND ime_smjera = ? AND ime_fakulteta = ?"
            const q3 = `INSERT INTO Rezultat(broj_poena, ime_provjere, korisnickoime_studenta, ime_predmeta, ime_smjera, ime_fakulteta, datum_odrzavanja)
                        VALUES (?, ?, ?, ?, ?, ?, ?)`;

            db.query(q2, [imePredmeta, imeSmjera, imeFakulteta], (err, students) => {
                if (err) {
                    return res.status(500).json(err);
                }

                const results = students.map(student => {
                    console.log(student);
                    const values = [-100, imeProvjere, student.korisnickoIme, imePredmeta, imeSmjera, imeFakulteta, new Date(datumOdrzavanja)];
                    return new Promise((resolve, reject) => {
                        db.query(q3, values, (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(data);
                            }
                        });
                    });
                });

                Promise.all(results)
                    .then(() => {
                        res.status(200).json("Success!");
                    })
                    .catch(err => {
                        res.status(500).json(err);
                    });
            });
        })
    })
}

module.exports = {sveProvjereDatumi,insertProvjera}