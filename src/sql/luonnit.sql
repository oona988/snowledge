CREATE TABLE Segmentit (
    ID SERIAL PRIMARY KEY,
    Nimi VARCHAR(100),
    Maasto VARCHAR(100),
    Lumivyöryvaara BOOL,
    On_Alasegmentti BIGINT UNSIGNED,
    FOREIGN KEY(On_Alasegmentti) REFERENCES Segmentit(ID)
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
    Vari VARCHAR(15),
    Ennatysaika datetime DEFAULT NULL
);

CREATE TABLE Paivitykset (
    Tekija BIGINT UNSIGNED,
    Segmentti BIGINT UNSIGNED,
    Aika DATETIME,
    Lumilaatu INT,
    Teksti TEXT,
    Kuvaus TEXT,
    lumen_kuva BLOB,
    Lumilaadut_ID bigint(20) unsigned,
    FOREIGN KEY(Tekija) references Kayttajat(ID) ON DELETE CASCADE,
    FOREIGN KEY(Segmentti) references Segmentit(ID) ON DELETE CASCADE,
    CONSTRAINT Lumilaadut_ID FOREIGN KEY (Lumilaadut_ID) REFERENCES Lumilaadut (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
    CONSTRAINT tunniste PRIMARY KEY (Aika, Segmentti)
);

CREATE TABLE Koordinaatit(
    Segmentti BIGINT UNSIGNED,
    Jarjestys BIGINT UNSIGNED,
    Sijainti Point,
    FOREIGN KEY(Segmentti) references Segmentit(ID) ON DELETE CASCADE,
    CONSTRAINT tunniste PRIMARY KEY(Jarjestys, Segmentti)
);

CREATE TABLE Alalumilaadut (
  Alalumilaaduti_ID int(10) unsigned NOT NULL AUTO_INCREMENT,
  Alatyypin_nimi varchar(45) DEFAULT NULL,
  Lumilaadut_ID bigint(20) unsigned DEFAULT NULL,
  Hiihdettavyys int(10) DEFAULT NULL,
  PRIMARY KEY (Alalumilaaduti_ID),
  KEY Lumi_alatyyppi_ibfk_1_idx(Lumilaadut_ID),
  CONSTRAINT Alalumilaadut_ibfk_1 
  FOREIGN KEY (Lumilaadut_ID) references Lumilaadut(ID) ON DELETE NO ACTION ON UPDATE NO ACTION
);
