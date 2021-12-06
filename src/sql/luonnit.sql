CREATE TABLE Segmentit (
    ID SERIAL PRIMARY KEY,
    Nimi VARCHAR(100),
    Maasto VARCHAR(100),
    Lumivyöryvaara BOOL,
    On_Alasegmentti BIGINT UNSIGNED,
    FOREIGN KEY(On_Alasegmentti) REFERENCES Segmentit(ID)
);

CREATE TABLE Koordinaatit(
    Segmentti BIGINT UNSIGNED,
    Jarjestys BIGINT UNSIGNED,
    Sijainti Point,
    FOREIGN KEY(Segmentti) references Segmentit(ID) ON DELETE CASCADE,
    CONSTRAINT tunniste PRIMARY KEY(Jarjestys, Segmentti)
);

CREATE TABLE Kayttajat (
    ID SERIAL PRIMARY KEY,
    Etunimi VARCHAR(20),
    Sukunimi VARCHAR(30),
    Rooli VARCHAR(20),
    Sähköposti VARCHAR(30),
    Salasana VARCHAR(100),
    UNIQUE (Sähköposti)
);

CREATE TABLE Lumilaadut (
    ID SERIAL PRIMARY KEY,
    Nimi VARCHAR(50),
    Vari VARCHAR(15)
);

CREATE TABLE Alalumilaadut (
  Alalumilaatu_ID INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  Alatyypin_nimi VARCHAR(45) DEFAULT NULL,
  Lumilaatu_ID bigint(20) UNSIGNED DEFAULT NULL,
  Hiihdettavyys INT(10) DEFAULT NULL,
  PRIMARY KEY (Alalumilaatu_ID),
--   KEY Lumi_alatyyppi_ibfk_1_idx(Lumilaatu_ID),
  CONSTRAINT Alalumilaadut_id
  FOREIGN KEY (Lumilaatu_ID) REFERENCES Lumilaadut(ID) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE Paivitykset (
    Tekija BIGINT UNSIGNED,
    Segmentti BIGINT UNSIGNED,
    Aika DATETIME,
    -- Lumilaatu INT,
    Kuvaus TEXT,
    Lumen_kuva BLOB,
    Lumilaatu_ID bigint(20) UNSIGNED,
    Lumilaatu_ID1 bigint(20) UNSIGNED DEFAULT NULL,
    Alalumilaatu_ID INT(10) UNSIGNED,
    Alalumilaatu_ID1 INT(10) UNSIGNED DEFAULT NULL,
    FOREIGN KEY(Tekija) REFERENCES Kayttajat(ID) ON DELETE CASCADE,
    FOREIGN KEY(Segmentti) REFERENCES Segmentit(ID) ON DELETE CASCADE,
    CONSTRAINT Lumilaatu_ID FOREIGN KEY (Lumilaatu_ID) REFERENCES Lumilaadut (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT Lumilaatu_ID1 FOREIGN KEY (Lumilaatu_ID1) REFERENCES Lumilaadut (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT Alalumilaatu_ID FOREIGN KEY (Alalumilaatu_ID) REFERENCES Alalumilaadut (Alalumilaatu_ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT Alalumilaatu_ID1 FOREIGN KEY (Alalumilaatu_ID1) REFERENCES Alalumilaadut (Alalumilaatu_ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT tunniste PRIMARY KEY (Aika, Segmentti)
);