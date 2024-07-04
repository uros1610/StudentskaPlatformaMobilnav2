const db = require('../db');
const jwt = require('jsonwebtoken')


const sviStudenti = (req,res) => {
    const query = "SELECT * FROM Student"

    db.query(query,[],(err,data) => {
        if(err) {
            return res.status(500).json("Internal server error!");
        }
        return res.status(200).json(data);
    })
}

const sviStudentiJedanSmjer = (req,res) => {
    const query = "SELECT * FROM Student WHERE ime_fakulteta = ? AND ime_smjera = ?"
    

    const {imeFakulteta,imeSmjera} = req.params;

    db.query(query,[imeFakulteta,imeSmjera],(err,data) => {
        if(err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(data);
    })
}

const sviRezultatiStudenta = (req,res) => {
    const query = "SELECT * FROM Rezultat WHERE korisnickoime_studenta = ?"

    console.log("OVDJE MORA DA UDJE")

    const token = req.headers.authorization.split(" ")[1];


    jwt.verify(token,process.env.SECRET_KEY,(err,data) => {

    if(err) {
        return res.status(403).json("Forbidden!");
    }
    

    db.query(query,[data.korisnickoIme],(err,data) => {
        if(err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(data);
    })
})}

const sviRezultatiStudentaJedanPredmet = (req,res) => {
    const query = "SELECT * FROM Rezultat WHERE korisnickoime_studenta = ? AND ime_predmeta = ? AND ime_smjera = ? AND ime_fakulteta = ?"
    
    const {korisnickoIme,imePredmeta,imeSmjera,imeFakulteta} = req.params;

    db.query(query,[korisnickoIme,imePredmeta,imeSmjera,imeFakulteta],(err,data) => {
        if(err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(data);
    })
}
const sviPredmetiStudenta = (req,res) => {
    const query = "SELECT ime_predmeta AS imePredmeta, ime_smjera AS imeSmjera,ime_fakulteta AS imeFakulteta, ukupan_broj_poena AS ukupanBrojPoena FROM Pohadja WHERE korisnickoime_studenta = ?"

    const token = req.headers.authorization.split(" ")[1];



    jwt.verify(token,process.env.SECRET_KEY,(err,data) => {

    if(err) {
        return res.status(403).json("Forbidden!");
    }
    

    db.query(query,[data.korisnickoIme],(err,data) => {
        if(err) {
            return res.status(500).json(err);
        }

        console.log(data);

        return res.status(200).json(data);
    })
})}
    

const sviStudentiPredmet = (req,res) => {
    const query = `SELECT s.korisnickoime AS korisnickoIme, s.indeks_studenta AS indeks,s.ime_studenta AS imeStudenta,s.prezime_studenta AS prezimeStudenta FROM Pohadja p 
    INNER JOIN Student s ON s.korisnickoime = p.korisnickoime_studenta 
    WHERE ime_predmeta = ? AND p.ime_smjera = ? AND s.ime_fakulteta = ?
    AND s.indeks_studenta LIKE ? AND s.ime_studenta LIKE ? AND s.prezime_studenta LIKE ?
    `


    const imePredmeta = req.params.imePredmeta;
    const imeSmjera = req.params.imeSmjera;
    const imeFakulteta = req.params.imeFakulteta;

   

    const indeks = "%" + req.query.indeks + "%";
    const ime = "%" + req.query.imeStudenta + "%";
    const prezime = "%" + req.query.prezimeStudenta + "%";


    console.log(req.params);

    db.query(query,[imePredmeta,imeSmjera,imeFakulteta,indeks,ime,prezime],(err,data) => {
        if(err) {
            return res.status(500).json(err);
        }

        return res.status(200).json(data);
    })
}

const updateRezultat = (req,res) => {

    const query = "UPDATE Rezultat SET broj_poena = ? WHERE id_provjere = ?";
    const query2 = "SELECT * FROM Rezultat WHERE id_provjere = ?";

    const {idRezultat} = req.params;

    const brojPoena = req.body.brojPoena;

    const token = req.headers.authorization.split(" ")[1];
    
    console.log(brojPoena,idRezultat);


    if(!token) {
        return res.status(401).json("Unauthorized!");
    }


    jwt.verify(token,process.env.SECRET_KEY,(err,decoded) => {

        if(err || decoded.rola === 'Student') {
            return res.status(403).json("Forbidden!");
        }

       

        db.query(query,[brojPoena,idRezultat],(err,data) => {

            if(err) {
                return res.status(500).json(err);
            }


            if(data.affectedRows === 0) {
                return res.status(404).json("Not found");
            }

            db.query(query2,[idRezultat],(err,data) => {
                if(err) {
                    return res.status(500).json(err);
                }

                const jsonFormat = data[0];

                
                const updateUkupanBrojPoena = "UPDATE Pohadja SET ukupan_broj_poena = ? WHERE korisnickoime_studenta = ? AND ime_predmeta = ? AND ime_smjera = ? AND ime_fakulteta = ?"
                db.query(updateUkupanBrojPoena,[req.body.ukupanBrojPoena,jsonFormat.korisnickoime_studenta,jsonFormat.ime_predmeta,jsonFormat.ime_smjera,jsonFormat.ime_fakulteta],(err,data) => {
                    if(err) {
                        return res.status(500).json(err);
                    }
                    const updateUkupanBrojPoenaSviIspiti = "UPDATE Svi_Ispiti SET brojPoena = ? WHERE korisnickoime_studenta = ? AND ime_predmeta = ? AND ime_smjera = ? AND ime_fakulteta = ?"

                    db.query(updateUkupanBrojPoenaSviIspiti,[req.body.ukupanBrojPoena,jsonFormat.korisnickoime_studenta,jsonFormat.ime_predmeta,jsonFormat.ime_smjera,jsonFormat.ime_fakulteta],(err,data) => {
                        if(err) {
                            return res.status(500).json(err);
                        }
                    return res.status(200).json("Success");
                    })

                })
            })

        })

    })

}

const sveInfoStudent = (req, res) => {
    const query = `
        SELECT 
            ime_studenta AS ime,
            prezime_studenta AS prezime,
            datum_rodjenja_studenta AS datumRodjenja,
            indeks_studenta AS indeks,
            ime_fakulteta AS imeFakulteta,
            ime_smjera AS imeSmjera,
            korisnickoime AS korisnickoIme 
        FROM Student 
        WHERE korisnickoime = ?`;

    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json("Forbidden! No token provided.");
    }

    const token = authHeader.split(" ")[1];

  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json("Forbidden! Invalid token.");
        }

        
        const korisnickoIme = decoded.korisnickoIme;
        
        
        db.query(query, [korisnickoIme], (err, results) => {
            if (err) {
                return res.status(500).json("Internal Server Error: " + err.message);
            }

           
            if (results.length === 0) {
                return res.status(404).json("Student not found");
            }

            
            return res.status(200).json(results);
        });
    });
};



module.exports = {sviStudenti,sviStudentiJedanSmjer,sviPredmetiStudenta,sviRezultatiStudenta,sviStudentiPredmet,updateRezultat,sviRezultatiStudentaJedanPredmet,sveInfoStudent}

