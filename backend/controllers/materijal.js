const db = require('../db.js');
const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.sviMaterijaliProfesora = (req, res) => {
    // vrace imena fajlova, kako bi mogli da se displajuju
    // '/public/ime_fajla.ekstenzija'
    const query = `SELECT id, putanja FROM materijal WHERE korisnickoime_profesora = ?`;

    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token,process.env.SECRET_KEY,(err,data) => {

        if(err) {
            return res.status(403).json("Forbidden!");
        }

        //vrace sva imena fajlova vezanih za ovoga profesora
        db.query(query, [data.korisnickoIme], (err,results) => {
            if (err) {
                return res.status(500).json("Internal server error!");
            }
            
            let imena_materijala = [];
            
            results.forEach(materijal => {
                let ime_materijala = { id:materijal.id, putanja:materijal.putanja.split("/")[2] };
                imena_materijala.push(ime_materijala);
            });

            res.status(200).json(imena_materijala);
        });

    })

};

exports.sviMaterijaliPredmet = (req, res) => {
    
    const ime_predmeta = req.params.imePredmeta;
    const ime_smjera = req.params.imeSmjera;
    const ime_fakulteta = req.params.imeFakulteta;
    const id = req.params.id;

    const query = `SELECT putanja FROM materijal WHERE ime_predmeta = ? AND ime_smjera = ? AND ime_fakulteta = ? ORDER BY datum_kreiranja DESC LIMIT ?,?`;

    console.log(req.params);
    const limit = 10;
    const offset = (id-1)*10;

    console.log("USAO je ovdje");

    db.query(query, [ime_predmeta, ime_smjera, ime_fakulteta,offset,limit], (err,results) => {
        if (err) {
            return res.status(500).json(err);
        }
        
        let imena_materijala = [];

        results.forEach(materijal => {
            let ime_materijala = { id:materijal.id, putanja:materijal.putanja.split("/")[3] };
            imena_materijala.push(ime_materijala);
        });

        res.status(200).json(imena_materijala);
    });
}

exports.ukupanBrojMaterijala = (req,res) => {
    const ime_predmeta = req.params.imePredmeta;
    const ime_smjera = req.params.imeSmjera;
    const ime_fakulteta = req.params.imeFakulteta;

    const query = `SELECT COUNT(*) AS brojMaterijala FROM materijal WHERE ime_predmeta = ? AND ime_smjera = ? AND ime_fakulteta = ?`;

    console.log(req.params);
    

    console.log("USAO je ovdje");

    db.query(query, [ime_predmeta, ime_smjera, ime_fakulteta], (err,results) => {
        if (err) {
            return res.status(500).json(err);
        }
               
        res.status(200).json(results);
    });
}

//ovi su samo za vracanje imena fajlova, slijedi za download ->

//pretpostavljam da na klik ide da se ovo poziva
exports.downloadMaterial = (req, res) => {
    const { ime } = req.params;
    const filePath = `./public/files/${ime}`;
    
    // Extract the file extension
    const ext = ime.split('.').pop(); // Get the part after the last dot
    
    // Determine the content type based on the file extension
    let contentType = 'application/octet-stream'; // Default content type
    
    switch (ext.toLowerCase()) {
        case 'pdf':
            contentType = 'application/pdf';
            break;
        case 'txt':
            contentType = 'text/plain';
            break;
        case 'jpg':
        case 'jpeg':
            contentType = 'image/jpeg';
            break;
        case 'png':
            contentType = 'image/png';
            break;
        case 'gif':
            contentType = 'image/gif';
            break;
        case 'mp3':
            contentType = 'audio/mpeg';
            break;
        case 'mp4':
            contentType = 'video/mp4';
            break;
        case 'doc':
        case 'docx':
            contentType = 'application/msword';
            break;
        case 'xls':
        case 'xlsx':
            contentType = 'application/vnd.ms-excel';
            break;
        case 'ppt':
        case 'pptx':
            contentType = 'application/vnd.ms-powerpoint';
            break;
        case 'zip':
            contentType = 'application/zip';
            break;
        case 'csv':
            contentType = 'text/csv';
            break;
        default:
            // Handle unknown file types or set a generic content type
            contentType = 'application/octet-stream';
            break;
    }
    
    
    // Set the Content-Type header
    res.setHeader('Content-Type', contentType);
    
    // Send the file as a download with the specified filename
    res.download(filePath, ime, (err) => {
        if (err) {
            console.error('File download error:', err);
            return res.status(404).json({ message: 'File not found', err: err });
        }
        // Optionally, you can handle success response here
        // res.status(200).json({ message: 'File download successful' });
    });
};

  

exports.okaciMaterijal = (req, res) => {
    // Log the structure of req.files to debug
    console.log(req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No materials were attached' });
    }

    const { ime_predmeta, ime_smjera, ime_fakulteta, ime_fajla } = req.body;
    console.log(req.body);
    const attached_file = req.files.file;

    console.log(attached_file);

    // Check if the attached_file is undefined
    if (!attached_file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const putanja = `./public/files/${attached_file.name}`;
    const query = `INSERT INTO materijal (korisnickoime_profesora, ime_predmeta, ime_smjera, ime_fakulteta, putanja, naslov,datum_kreiranja) VALUES (?, ?, ?, ?, ?, ?,?)`;

    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
        if (err) {
            return res.status(403).json("Forbidden!");
        }

        const q = `SELECT * FROM profesor_predmet WHERE korisnickoime_profesora = ? AND ime_predmeta = ? AND ime_smjera = ? AND ime_fakulteta = ?`;

        db.query(q, [data.korisnickoIme, ime_predmeta, ime_smjera, ime_fakulteta], (err, podaci) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (podaci.length === 0) {
                return res.status(403).json("Forbidden!");
            }

            db.query(query, [data.korisnickoIme, ime_predmeta, ime_smjera, ime_fakulteta, putanja, ime_fajla,new Date()], (err, results) => {
                if (err) {
                    return res.status(500).json(err);
                }

                attached_file.mv(putanja, (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'File upload failed', err: err });
                    }

                    res.status(200).json({
                        message: 'File uploaded successfully',
                        file: {
                            name: attached_file.name,
                            mimetype: attached_file.mimetype,
                            size: attached_file.size
                        }
                    });
                });
            });
        });
    });
};


exports.obrisiMaterijal = (req, res) => {
    const id = req.params.id;
    const ime_fajla = req.params.imeMaterijala;

    const query = `DELETE FROM materijal WHERE id = ?`;
    const filePath = '../public/'+ime_fajla;

    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token,process.env.SECRET_KEY,(err,data) => {

        if(err) {
            return res.status(403).json("Forbidden!");
        }
        
        db.query(query,[id], (err,results) => {
            if (err) {
                return res.status(500).json("Internal server error!");
            }

            if(results.affectedRows === 0){
                return res.status(404).json("Material not found");
            }
            
            fs.unlink(filePath, (err) => {
                if (err) {
                  return res.status(500).json({ error: 'Failed to delete material', details: err });
                }
            });

            res.status(200).json({message:'Successfully deleted material'});
        });
    });
}