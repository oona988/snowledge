/**
Segmenttien tiedot piirtävä komponentti
Sisältää myös segmenttien tietojen päivitystoiminnot kirjautuneille käyttäjille

Luonut: Markku Nirkkonen

Päivityshistoria

10.1.2021 Markku Nirkkonen
Lumivyöryvaara näkyy, kun tarkastellaan segmenttiä, joka on lumivyöryaluetta

9.1.2021 Markku Nirkkonen
Lumitilanteen päivitysdialogia fiksattu paremmaksi
Lisäksi pieniä korjauksia

7.1.2021 Markku Nirkkonen
Lumitilanteen päivitysaika näkyviin käyttöliittymään

4.1.2021 Markku Nirkkonen
Avatarin tilalle segmentin lumitilannetta kuvaava logo

30.12.2020 Markku Nirkkonen
Avatar värjäytyy segmentin värin mukaiseksi

11.12. Lisättiin lumilaadun ja alasegmentin tiedot hakujen parsimiseen

5.12. Arttu Lakkala
Muutettii update postin kohde (api/segments/update/:id -> api/update/:id)
Tehty API:ssa tapahtuneen muutoksen mukaisesti

26.11. Markku Nirkkonen
Tekstejä suomennettu

25.11. Markku Nirkkonen
Muotoiltu segmentin tiedot korttimaisemmaksi
Segmentin tiedot näyttävän kortin voi sulkea

17.11. Markku Nirkkonen 
Ensimmäinen versio segmenttien päivittämisestä

**/

import * as React from "react";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import FormHelperText from "@material-ui/core/FormHelperText";


const useStyles = makeStyles((theme) => ({

  close: {
    color: "white"
  },
  textBox: {
    margin: "auto",
    display: "block",
  },
  snowLogo: {
    padding: theme.spacing(3),
    textAlign: "center"
  },
  snowInfoTexts: {
    maxWidth: 300,
    color: "white",
    padding: theme.spacing(3),
  },
  editButton: {
    color: "white",
    display: "flex",
  },
  inputs: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  helpers: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  }
}));

function getRelativeTimestamp(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (Math.round(elapsed/1000) == 1) {
      return "1 sekunti sitten";
    }
    return `${Math.round(elapsed/1000)} sekuntia sitten`;
  } else if (elapsed < msPerHour) {
    if (Math.round(elapsed/msPerMinute) == 1) {
      return "1 minuutti sitten";
    }
    return `${Math.round(elapsed/msPerMinute)} minuuttia sitten`;
  } else if (elapsed < msPerDay ) {
    if (Math.round(elapsed/msPerHour) == 1) {
      return "1 tunti sitten";
    }
    return `${Math.round(elapsed/msPerHour)} tuntia sitten`;
  } else if (elapsed < msPerMonth) {
    if (Math.round(elapsed/msPerDay) == 1) {
      return "1 päivä sitten";
    }
    return `noin ${Math.round(elapsed/msPerDay)} päivää sitten`;
  } else if (elapsed < msPerYear) {
    if (Math.round(elapsed/msPerMonth) == 1) {
      return "1 kuukausi sitten";
    }
    return `noin ${Math.round(elapsed/msPerMonth)} kuukautta sitten`;
  } else {
    if (Math.round(elapsed/msPerYear) == 1) {
      return "1 vuosi sitten";
    }
    return `noin ${Math.round(elapsed/msPerYear)} vuotta sitten`;
  }
}

function Info(props) {

  const [loginOpen, setLoginOpen] = React.useState(false);
  const [snowtype, setSnowtype] = React.useState(0);
  const [text, setText] = React.useState("Ei tietoa");
  
  const classes = useStyles();

  var updateInfo = "";

  // Parsitaan päivämäärä ja aika päivityksestä, mikäli päivitys löytyy
  if (props.segmentdata.update !== null && props.segmentdata.update !== undefined) {
    // Datasta saadaan viimeisin päivitysaika
    let latestUpdateTime = new Date(props.segmentdata.update.Aika);
    let currentTime = new Date();
    updateInfo = `Viimeksi päivitetty: ${getRelativeTimestamp(currentTime, latestUpdateTime)}`;
  }

  var dangerimage;
  var dangertext;

  // Alustetaan komponentit, mikäli valitulla segmentillä on lumivyöryvaara
  if (props.segmentdata !== null) {
    if (props.segmentdata.Lumivyöryvaara) {
      // Lumivyöryvaaran merkin tiedostonimi on !.png
      dangerimage = <img src={process.env.PUBLIC_URL + "/lumilogot/!.png"} alt="lumivyöryvaaran logo"/>;
      dangertext = <Typography variant="subtitle1" color="error">Lumivyöryherkkä alue, tarkista lumivyörytilanne!</Typography>;
    } else {
      dangerimage = <div />;
      dangertext = null;
    }
  }

  /*
   * Event handlers
   */
  
  // Segmentin päivitysdialogin avaus
  const openUpdate = () => {
    setText(props.segmentdata.update !== null ? props.segmentdata.update.Teksti : "Ei kuvausta");
    setSnowtype(props.segmentdata.update !== null ? props.segmentdata.update.Lumilaatu : 0);
    setLoginOpen(true);
  };

  // Segmentin päivitysdialogin sulkeminen
  const closeUpdate = () => {
    setLoginOpen(false);
    setText(props.segmentdata.update !== null ? props.segmentdata.update.Teksti : "Ei kuvausta");
    setSnowtype(props.segmentdata.update !== null ? props.segmentdata.update.Lumilaatu : 0);
  };

  // Lumitilanteen kuvaustekstin päivittäminen
  const updateText = (event) => {
    setText(event.target.value);
  };

  // Lumitilanteen lumityypin päivittäminen
  const updateSnowtype = (event) => {
    setSnowtype(event.target.value);
  };

  // Nollataan valittu segmentti sulkiessa
  function closeShownSegment() {
    props.onClose(null);
  }

  // Kun lomake lähetetään, tehdään POST methodin api-kutsu polkuun /api/update/:id
  const sendForm = () => {
    
    // Tallennushetken lumilaatu, kuvausteksti. Lisäksi päivitettävän (valitun) segmentin ID
    const data = {
      Segmentti: props.segmentdata.ID,
      Lumilaatu: snowtype,
      // Kuvauksen syöttökentän ollessa tyhjä (text === ""), päivitetään edellisen päivityksen tekstillä
      Teksti: text === "" ? props.segmentdata.update.Teksti : text
    };
    const fetchUpdate = async () => {
      //setLoading(true);
      const response = await fetch("api/update/" + props.segmentdata.ID,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token
          },
          body: JSON.stringify(data),
        });
      await response.json();
    };
    fetchUpdate();
    
    // Haetaan ajantasaiset segmenttien tiedot heti päivittämisen jälkeen
    const fetchData = async () => {
      const snow = await fetch("api/lumilaadut");
      const snowdata = await snow.json();
      const updates = await fetch("api/segments/update");
      const updateData = await updates.json();
      const response = await fetch("api/segments");
      const data = await response.json();
      
      
      await updateData.forEach(update => {
        snowdata.forEach(snow => {
          if(snow.ID === update.Lumilaatu){
            update.Lumi = snow;
          }
        });
      });
      
      data.forEach(segment => {
        segment.update = null;
        updateData.forEach(update => {
          if (update.Segmentti === segment.ID) {
            segment.update = update;           
          }
          // päivitetään näytettävä segmentti
          if (segment.ID === props.segmentdata.ID) {
            props.onUpdate(segment);
          }
        });
        if(segment.On_Alasegmentti != null)
        {
          data.forEach(mahd_yla_segmentti => {
            if(mahd_yla_segmentti.ID === segment.On_Alasegmentti){
              segment.On_Alasegmentti = mahd_yla_segmentti.Nimi;
            }
          });
        }
        if (segment.Nimi === "Metsä") {
          props.updateWoods(segment);
        }
      });

      // Päivitetään segmentit, jotta ne piirtyvät uudestaan
      props.updateSegments(data);

    };
    fetchData();
    closeUpdate();  
  };

  

  // Segmenttidataa tulee olla, jotta renderöidään mitään näkyvää
  if (props.segmentdata !== undefined) {
    
    if (props.token !== null && props.token !== undefined) {
      
      // Nämä renderöidään, kun käyttäjä on kirjautunut (muokkaustoiminto lisänä)
      return (
        <div className="info">
          <IconButton aria-label="close" className={classes.close} onClick={() => closeShownSegment()}>
            <CloseIcon />
          </IconButton>

          <Box className={classes.textBox} >

            {/* Segmentin nimi ja lumivyöryvaarasta kertova teksti, mikäli kyseessä lumivyöryherkkä segmentti */}
            <Typography variant="h5" className={classes.snowInfoTexts} align="center" component="p">
              {props.segmentdata === null ? "Ei nimitietoa" : props.segmentdata.Nimi}
              {props.segmentdata === null ? null : dangertext}
            </Typography>

            {/* Pohjamaasto, kommentoi näkyviin jos halutaan näyttää */}
            {/* <Typography variant="subtitle1" className={classes.snowInfoTexts} align="center" component="p">
              {props.segmentdata === null ? "Ei tietoa pohjamaastosta" : props.segmentdata.Maasto}
            </Typography> */}

            {/* Segmentin logon tulee olla nimetty segmentin ID:n kanssa yhtenevästi */}

            <Box className={classes.snowLogo}>
              {/* Segmentin logon tulee olla nimetty segmentin ID:n kanssa yhtenevästi */}
              {props.segmentdata.update === null || props.segmentdata.update.Lumi === undefined ? <div /> : <img src={process.env.PUBLIC_URL + "/lumilogot/" + props.segmentdata.update.Lumi.ID + ".png"} alt="lumityypin logo"/>}
              {/* Lumivyöryvaarasta ilmoitetaan logolla */}
              {props.segmendata === null ? null : dangerimage}
            </Box>
            <Typography variant="body1" className={classes.snowInfoTexts} align="center" component="p">
              {props.segmentdata.update === null || props.segmentdata.update.Lumi === undefined ? "Ei tietoa" : props.segmentdata.update.Lumi.Nimi}
            </Typography>
            <Typography variant="body2" className={classes.snowInfoTexts} align="center" component="p">
              {props.segmentdata.update === null || props.segmentdata.update === undefined ? "Ei kuvausta" : props.segmentdata.update.Teksti}
            </Typography>
            <Typography variant="caption" className={classes.snowInfoTexts} align="center" component="p">
              {props.segmentdata.update === null || props.segmentdata.update === undefined ? "" : updateInfo}
            </Typography>
          </Box>

          <IconButton 
            className={classes.editButton}
            onClick={openUpdate}
          >
            <EditIcon />
            <Typography variant="button">Päivitä</Typography>
          </IconButton>
          
          {/* Segmentin päivitysdialogi */}
          <Dialog 
            onClose={closeUpdate} 
            open={loginOpen}
          >
            <DialogTitle id="update-segment">Päivitä segmenttiä</DialogTitle>
              
            {/* Avustetekstit, esim segmentin nimi */}
            <Box className={classes.helpers}>
              <Typography>{props.segmentdata.Nimi}</Typography>
              <Typography variant="caption" >Vihje: jos haluat päivittää vain aikaleiman, päivitä muuttamatta lumityyppiä ja jätä kuvaus tyhjäksi</Typography>
            </Box>
              
            {/* Lumityypin valinta */}
            <InputLabel id="snowtype" className={classes.inputs}>Lumityyppi</InputLabel>
            <Select
              labelId="snowtype"
              id="snowtype"
              value={snowtype}
              onChange={updateSnowtype}
              displayEmpty
              className={classes.inputs}
            >
              <MenuItem value={0}>Ei tietoa</MenuItem>
              <MenuItem value={1}>Pehmeä lumi</MenuItem>
              <MenuItem value={2}>Tuulen pieksämä aaltoileva lumi</MenuItem>
              <MenuItem value={3}>Korppu</MenuItem>
              <MenuItem value={4}>Sohjo</MenuItem>
              <MenuItem value={5}>Jää</MenuItem>
            </Select>
            {snowtype === 0 ? <FormHelperText className={classes.inputs}>Muuta lumityyppiä päivittääksesi</FormHelperText> : <div />}

            {/* Kuvausteksti */}
            <FormControl className={classes.inputs}>
              <InputLabel htmlFor="text" >Kuvaus</InputLabel>
              <Input
                id="text"
                type='text'
                multiline={true}
                rows={5}
                placeholder={text}
                onChange={updateText}              
              />
            </FormControl>
            
            {/* Dialogin toimintopainikkeet. Päivitys disabloitu, jos lumityyppi on Ei tietoa (snowtype === 0) */}
            <DialogActions>
              <Divider />
              <Button id={"dialogClose"} onClick={closeUpdate}>Peruuta</Button>
              <Button variant="contained" color="primary" id={"dialogOK"} onClick={sendForm} disabled={snowtype === 0}>Päivitä</Button>
            </DialogActions>
          
          </Dialog>
        </div>
      );
    }
    else {
      // Kirjautumattoman käyttäjän näkymät (muokkaustoimintoa ei ole)
      return (
        <div className="info">
          <IconButton aria-label="close" className={classes.close} onClick={() => closeShownSegment()}>
            <CloseIcon />
          </IconButton>

          <Box className={classes.textBox} >

            {/* Segmentin nimi ja lumivyöryvaarasta kertova teksti, mikäli kyseessä lumivyöryherkkä segmentti */}
            <Typography variant="h5" className={classes.snowInfoTexts} align="center" component="p">
              {props.segmentdata === null ? "Ei nimitietoa" : props.segmentdata.Nimi}
              {/* Lumivyöryvaarasta ilmoitetaan logolla */}
              {props.segmentdata === null ? null : dangertext}
            </Typography>

            {/* Pohjamaasto, kommentoi näkyviin jos halutaan näyttää */}
            {/* <Typography variant="subtitle1" className={classes.snowInfoTexts} align="center" component="p">
              {props.segmentdata === null ? "Ei tietoa pohjamaastosta" : props.segmentdata.Maasto}
            </Typography> */}

            <Box className={classes.snowLogo}>
              {/* Segmentin logon tulee olla nimetty segmentin ID:n kanssa yhtenevästi */}
              {props.segmentdata.update === null || props.segmentdata.update === undefined ? <div /> : <img src={process.env.PUBLIC_URL + "/lumilogot/" + props.segmentdata.update.Lumi.ID + ".png"} alt="lumityypin logo"/>}
              {props.segmendata === null ? null : dangerimage}
            </Box>
            <Typography variant="body1" className={classes.snowInfoTexts} align="center" component="p">
              {props.segmentdata.update === null || props.segmentdata.update === undefined ? "Ei tietoa" : props.segmentdata.update.Lumi.Nimi}
            </Typography>
            <Typography variant="body2" className={classes.snowInfoTexts} align="center" component="p">
              {props.segmentdata.update === null || props.segmentdata.update === undefined ? "Ei kuvausta" : props.segmentdata.update.Teksti}
            </Typography>
            <Typography variant="caption" className={classes.snowInfoTexts} align="center" component="p">
              {props.segmentdata.update === null || props.segmentdata.update === undefined ? "" : updateInfo}
            </Typography>
          </Box>
          
        </div>
      );
    }
  // mikäli segmenttidataa ei ole saatavilla, ei yritetä renderöidä mitään näkyvää
  } else {
    return <div className="info" />;
  }
}
 
export default Info;