const db = require('../db');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

require('dotenv').config()

const login = (req,res) => {

    const {username,password} = req.body;

    console.log("fdsfdsfdsfsd",req.body);

    console.log(username,password);

    const queryStudent = "SELECT * From Student WHERE korisnickoime = ?"
    const queryProfesor = "SELECT * FROM Profesor where korisnickoime = ?"

    db.query(queryStudent,[username],(err,data) => {
        if(err) {
            return res.status(500).json("Internal server error!");
        }

        if(data.length) {
            console.log("usao");
        const correctPassword = bcrypt.compareSync(password,data[0].lozinka);

            if(correctPassword) {
                const token = jwt.sign({korisnickoIme:data[0].korisnickoime,indeksStudenta:data[0].indeks_studenta,imeSmjera:data[0].ime_smjera,imeFakulteta:data[0].ime_fakulteta},process.env.SECRET_KEY);

                const sendObj = {korisnickoIme:data[0].korisnickoime,indeksStudenta:data[0].indeks_studenta,imeSmjera:data[0].ime_smjera,imeFakulteta:data[0].ime_fakulteta,rola:"Student",token:token};

                return res.status(200).json(sendObj);
            }
        }
        

        db.query(queryProfesor,[username],(err,data) => {

            if(err) {
                return res.status(500).json("Internal server error!");
            }

            if(!data.length) {
                return res.status(401).json({message:"Nepravilni kredencijali!"});
            }
            else {
                const correctPassword = bcrypt.compareSync(password,data[0].lozinka)

                if(!correctPassword) {
                    console.log("usao");
                    return res.status(401).json({message:"Nepravilni kredencijali!"});
                }

            const token = jwt.sign({korisnickoIme:data[0].korisnickoime},process.env.SECRET_KEY);

            const sendObj = {korisnickoIme:data[0].korisnickoime,rola:"Profesor",token:token};

            res.status(200).json(sendObj);
            }
        })

    })

    

}

const logout = (req,res) => {

}


module.exports = {login,logout}