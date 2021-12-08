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
    Vari VARCHAR(15),
    Hiihdettavyys INT(10) DEFAULT NULL,
    Kategoria_ID BIGINT(20) DEFAULT NULL,
    Lumityyppi_selite TEXT
);

CREATE TABLE Paivitykset (
    Tekija BIGINT UNSIGNED,
    Segmentti BIGINT UNSIGNED,
    Aika DATETIME,
    Kuvaus TEXT,
    Lumen_kuva MEDIUMBLOB,
    Lumilaatu_ID1 BIGINT(20) UNSIGNED DEFAULT NULL,
    Lumilaatu_ID2 BIGINT(20) UNSIGNED DEFAULT NULL,
    Toissijainen_ID1 BIGINT(20) UNSIGNED DEFAULT NULL,
    Toissijainen_ID2 BIGINT(20) UNSIGNED DEFAULT NULL,
    FOREIGN KEY(Tekija) REFERENCES Kayttajat(ID) ON DELETE CASCADE,
    FOREIGN KEY(Segmentti) REFERENCES Segmentit(ID) ON DELETE CASCADE,
    CONSTRAINT Lumilaatu_ID1 FOREIGN KEY (Lumilaatu_ID1) REFERENCES Lumilaadut (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT Lumilaatu_ID2 FOREIGN KEY (Lumilaatu_ID2) REFERENCES Lumilaadut (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT Toissijainen_ID1 FOREIGN KEY (Toissijainen_ID1) REFERENCES Lumilaadut (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT Toissijainen_ID2 FOREIGN KEY (Toissijainen_ID2) REFERENCES Lumilaadut (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT tunniste PRIMARY KEY (Aika, Segmentti)
);
