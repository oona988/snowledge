/**
API kutsut päivitykselle

Päivityshistoria
Arttu Lakkala 15.11 Lisätty segmentit delete
Arttu Lakkala 22.11 Lisätty segmentit muutos
Arttu Lakkala 25.11 Lisätty segmentit lisäys
Arttu Lakkala 1.12  Rollback lisätty segmentin muutokseen
Arttu Lakkala 5.12 Rollback lisätty segmentin lisäykseen
Arttu Lakkala 5.12 uudelleennimettiin api.js
-----------------------------------------
Arttu Lakkala 6.12 Refactoroitiin API:sta

*/


const express = require("express");
const router = express.Router();
const database = require("./database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
//alusta salaukset
const saltRounds = 15;
const secret = "Lumihiriv0";
//alusta tarkistus
const { body, validationResult } = require("express-validator");

router.post("/:id", function(req, res) {

  if(req.body.Segmentti != req.params.id)
  {
    res.json("Segmentti numerot eivät täsmää");
    res.status(400);
  }
  database.query("INSERT INTO Paivitykset(Tekija, Segmentti, Kuvaus, Aika, Lumen_kuva, Lumilaatu_ID,Lumilaatu_ID1,Alalumilaatu_ID,Alalumilaatu_ID1 ) VALUES(?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)",
    [
      req.decoded.id,
      req.body.Segmentti,
      // req.body.Lumilaatu,
      req.body.Kuvaus,
      req.body.Lumen_kuva,
      req.body.Lumilaatu_ID,
      req.body.Lumilaatu_ID1,
      req.body.Alalumilaatu_ID,
      req.body.Alalumilaatu_ID,
      req.body.Alalumilaatu_ID1
    ],
    function (err) {
      if (err) throw err;
      res.json("Insert was succesfull");
      res.status(204);
    });
});



module.exports = router;