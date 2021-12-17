CREATE TABLE Segmentit (
    ID SERIAL PRIMARY KEY ,
    Nimi VARCHAR(30),
    Maasto VARCHAR(20),
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
    Salasana VARCHAR(30)
);

CREATE TABLE Paivitykset (
    Tekija BIGINT UNSIGNED,
    Segmentti BIGINT UNSIGNED,
    Aika DATETIME,
    Lumilaatu VARCHAR(20),
    FOREIGN KEY(Tekija) references Kayttajat(ID),
    FOREIGN KEY(Segmentti) references Segmentit(ID),
    CONSTRAINT tunniste PRIMARY KEY (Tekija, Segmentti)
);

CREATE TABLE Koordinaatit(
    Segmentti BIGINT UNSIGNED,
    Jarjestys BIGINT UNSIGNED,
    Sijainti Point,
    FOREIGN KEY(Segmentti) references Segmentit(ID),
    CONSTRAINT tunniste PRIMARY KEY(Jarjestys, Segmentti)
);