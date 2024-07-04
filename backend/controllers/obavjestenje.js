const db = require('../db')
const jwt = require('jsonwebtoken')

const svaObavjestenjaPredmet = (req,res) => {

    const q = "SELECT * FROM Obavjestenje WHERE ime_predmeta = ? AND ime_smjera = ? AND ime_fakulteta = ? ORDER BY datum_kreiranja DESC";

    const {imePredmeta,imeSmjera,imeFakulteta} = req.params;



    db.query(q,[imePredmeta,imeSmjera,imeFakulteta],(err,data) => {
        if(err) {
            return res.status(500).json("Internal server error!");
        }
        else {
            return res.status(200).json(data);
        }
    })
}

const insertObavjestenje = (req,res) => {

        const {imePredmeta, imeSmjera, imeFakulteta } = req.params;

        const token = req.headers.authorization.split(" ")[1];

        jwt.verify(token,process.env.SECRET_KEY,(err,data) => {

            if(err) {
                return res.status(403).json("Forbidden!");
            }


        const query = "SELECT * FROM profesor_predmet WHERE korisnickoime_profesora = ? AND ime_predmeta = ? AND ime_smjera = ? AND ime_fakulteta = ?";
        
        db.query(query, [data.korisnickoIme,imePredmeta, imeSmjera, imeFakulteta], (err, data) => {
            if (err) {
                return res.status(500).json("Internal server error!");
            }
            if (!data.length) {
                return res.status(403).json("Forbidden!");
            }
            const values = [new Date(), req.body.opis, req.body.naslov, data.korisnickoIme, imePredmeta, imeSmjera, imeFakulteta];
            const queryInsert = "INSERT INTO Obavjestenje(datum_kreiranja, opis, naslov, korisnickoime_profesora, ime_predmeta, ime_smjera, ime_fakulteta) VALUES(?)";

            db.query(queryInsert, [values], (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json("Internal server error!");
                }
                else {
                    return res.status(200).json(data);
                }
            });
        });

    })
    
}

const updateObavjestenje = (req,res) => {
    const q = "UPDATE Obavjestenje SET datum_kreiranja = ? , naslov = ?, opis = ? WHERE id_obavjestenja = ?"

    const token = req.headers.authorization.split(" ")[1];

    console.log(req.params);

    

    if(!token) {
        return res.status(401).json("Access denied!");
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json("Unauthorized: Invalid token!");
        }


    db.query(q,[new Date(),req.body.naslov,req.body.opis,parseInt(req.params.idObavjestenja)],(err,data) => {
        if(err) {
            return res.status(500).json(err);
        }


        if(data.affectedRows === 0) {
            return res.status(404).json("Not found");
        }

        return res.status(200).json("Success");
        })
    })
}

const jednoObavjestenje = (req,res) => {
    const q = "SELECT * FROM Obavjestenje WHERE id_obavjestenja = ?";

    console.log(req.params);

    const id = parseInt(req.params.idObavjestenja);

    

    db.query(q,[id],(err,data) => {
        if(err) {
            return res.status(500).json(err);
        }
        console.log(data);
        if(data.length === 0) {
            return res.status(404).json("Not found");
        }
        return res.status(200).json(data);
    })
}


const deleteObavjestenje = (req,res) => {
    const q = "DELETE FROM Obavjestenje WHERE id_obavjestenja = ?";

    db.query(q,[parseInt(req.params.idObavjestenja)],(err,data) => {
        if(err) {
            return res.status(500).json(err);
        }

        console.log(req.params);

        if(data.affectedRows === 0) {
            return res.status(404).json("Not found");
        }
        return res.status(200).json("Success");
    })
}

const brojNeprocitanih = (req,res) => {
    const q = `SELECT COUNT(*) as brojNeprocitanih FROM Neprocitano_Obavjestenje no INNER JOIN Obavjestenje o ON no.id_obavjestenja = o.id_obavjestenja WHERE korisnickoime_studenta = ?
    AND ime_predmeta = ? AND ime_smjera = ? AND ime_fakulteta = ?
    `

    const token = req.headers.authorization.split(" ")[1];

    

    if(!token) {
        return res.status(401).json("Access denied!");
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json("Unauthorized: Invalid token!");
        }

        db.query(q,[decoded.korisnickoIme,req.params.imePredmeta,req.params.imeSmjera,req.params.imeFakulteta],(err,data) => {
            if(err) {
                return res.status(500).json("Internal server error!");
            }

            return res.status(200).json(data);
        })

    })

    
}

const brojObavjestenja = (req,res) => {
    const q = `SELECT COUNT(*) as brojObavjestenja FROM Obavjestenje WHERE ime_predmeta = ? AND ime_smjera = ? AND ime_fakulteta = ?
    `

    const token = req.headers.authorization.split(" ")[1];

    console.log("usaoOVDJEEEEEEEEEEEEEEEEEEEEE");

    

    if(!token) {
        return res.status(401).json("Access denied!");
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json("Unauthorized: Invalid token!");
        }

        db.query(q,[req.params.imePredmeta,req.params.imeSmjera,req.params.imeFakulteta],(err,data) => {
            if(err) {
                return res.status(500).json(err);
            }

            return res.status(200).json(data);
        })

    })

    
}


const brojNeprocitanihUkupno = (req,res) => {
    const q = `SELECT COUNT(*) as brojNeprocitanih FROM 
    Neprocitano_Obavjestenje no INNER JOIN Obavjestenje o ON no.id_obavjestenja = o.id_obavjestenja 
    WHERE korisnickoime_studenta = ?

    `

    const token = req.headers.authorization.split(" ")[1];

    

    if(!token) {
        return res.status(401).json("Access denied!");
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json("Unauthorized: Invalid token!");
        }

        db.query(q,[decoded.korisnickoIme],(err,data) => {
            if(err) {
                return res.status(500).json("Internal server error!");
            }

            return res.status(200).json(data);
        })

    })

    
}

const svaNeprocitanaObavjestenjaPredmet = (req,res) => {

    const q = `SELECT * FROM Neprocitano_Obavjestenje no 
    INNER JOIN Obavjestenje o ON no.id_obavjestenja = o.id_obavjestenja
     WHERE o.ime_predmeta = ? AND o.ime_smjera = ? AND o.ime_fakulteta = ?
    AND no.korisnickoime_studenta = ? ORDER BY o.datum_kreiranja DESC`;

    
    
    const token = req.headers.authorization.split(" ")[1];

    
    

    if(!token) {
        return res.status(401).json("Access denied!");
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json("Unauthorized: Invalid token!");
        }
        const {imePredmeta,imeSmjera,imeFakulteta} = req.params;


        db.query(q,[imePredmeta,imeSmjera,imeFakulteta,decoded.korisnickoIme],(err,data) => {
            if(err) {
                return res.status(500).json("Internal server error!");
            }
            else {
                console.log(data);
                return res.status(200).json(data);
            }
        })

    })
}

const deleteNeprocitanoObavjestenje = (req,res) => {
    const q = "DELETE FROM Neprocitano_Obavjestenje WHERE id_obavjestenja = ? AND korisnickoime_studenta = ? ";

    const token = req.headers.authorization.split(" ")[1];

    console.log("usao ovdje");

    if(!token) {
        return res.status(401).json("Access denied!");
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json("Unauthorized: Invalid token!");
        }

        db.query(q,[req.params.idObavjestenja,decoded.korisnickoIme],(err,data) => {
            if(err) {
                return res.status(500).json(err);
            }

            if(data.affectedRows === 0) {
                return res.status(404).json("Not found");
            }
            return res.status(200).json("Success");
        })
    })
}

module.exports = {svaObavjestenjaPredmet,insertObavjestenje,updateObavjestenje,jednoObavjestenje,deleteObavjestenje,brojNeprocitanih,svaNeprocitanaObavjestenjaPredmet,deleteNeprocitanoObavjestenje,brojNeprocitanihUkupno,brojObavjestenja}