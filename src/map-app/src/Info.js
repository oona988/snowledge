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
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';



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
  },
  snowRecordEBox: {
    padding: "7px",
  },
  snowRecordEHeaders: {
    fontSize: 15,
    padding: "3px",
  },
  snowRecordEButtons: {
    paddingLeft: 66,
    paddingRight: 56,
    position: "relative",
/*
    "& .MuiButton-sizeSmall": {
      paddingLeft: 48,
      paddingRight: 32,
      position: "absolute",
      left: 16
    },*/
    "& .MuiButton-endIcon": {
      position: "absolute",
      right: 16
    }
  }
}));

function Info(props) {

  const [loginOpen, setLoginOpen] = React.useState(false);
  const [snowtype, setSnowtype] = React.useState(0);
  const [text, setText] = React.useState("Ei tietoa");
  const [entryHidden, setEntryHidden] = React.useState("flex");
  
  const classes = useStyles();

  var updateDate;
  var updateTime;

  // Parsitaan päivämäärä ja aika päivityksestä, mikäli päivitys löytyy
  if (props.segmentdata.update !== null && props.segmentdata.update !== undefined) {
    
    // Datasta aika tulee muodossa: yyyy-mm-ddThh:mm:ss.000Z
    let timedata = props.segmentdata.update.Aika;
    let timeString = timedata.split("T");
    
    // Päivämäärä taulukoksi muotoon [vuosi, kuukausi, päivä]
    updateDate = timeString[0].split("-");

    // Kellonaika muodossa hh:mm:ss
    updateTime = timeString[1].split(".")[0];
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
    setEntryHidden("flex");
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

  // Hides unnecessary information on snow record entry view, if checkbox is checked.
  const updateEntryHidden = (event) => {
    // updates display of the box, none makes contents hidden
    if (!event.target.checked){
      setEntryHidden("flex");
    }
    else if (event.target.checked){
      setEntryHidden("none");
    }
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
              {props.segmentdata.update === null || props.segmentdata.update === undefined ? "" : `${updateDate[2]}.${updateDate[1]}.${updateDate[0]} ${updateTime}`}
            </Typography>
          </Box>

          <IconButton 
            className={classes.editButton}
            onClick={openUpdate}
          >
            <EditIcon />
            <Typography variant="button">Päivitä</Typography>
          </IconButton>
          
          {/* Segmentin päivitysdialogi - SNOW RECORD ENTRY VIEW*/}
          <Dialog 
            onClose={closeUpdate} 
            open={loginOpen}
          >
            <DialogTitle id="update-segment">Päivitä segmenttiä</DialogTitle>
            {/*<Box className={snowRecordEBox}>
             Avustetekstit, esim segmentin nimi */}
            <Box className={classes.helpers}>
              <Typography variant="h5" className={classes.snowRecordEHeaders}>{props.segmentdata.Nimi}</Typography>
            </Box>
            {/* Checkboxi pelkän aikaleiman päivitykselle*/ }
            <Box>
              <FormControlLabel control={<Checkbox onChange={updateEntryHidden}/>} label="Päivitä vain aikaleima" />
            </Box>

            {/*THIS BOX CONTAINS ITEMS HIDDEN WHEN THE CHECKBOX IS ACTIVE*/}
            <Box display={entryHidden} flexDirection="column">
              {/* Lumityypin valinta 
              <InputLabel id="snowtype" className={classes.inputs}>Lumityypit {"\u0026"} esteet</InputLabel> */}
              <Typography variant="h5" className={classes.snowRecordEHeaders}>Lumityypit {"\u0026"} esteet</Typography>
              {/*<Select
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
              {snowtype === 0 ? <FormHelperText className={classes.inputs}>Muuta lumityyppiä päivittääksesi</FormHelperText> : <div />}*/}

              <Button variant="contained" color="primary" endIcon={<SearchIcon />} className={classes.snowRecordEButtons}>Lisää</Button>
              <Divider variant="middle" />
              {/* Kuvausteksti 
              <FormControl className={classes.inputs}>
                <InputLabel htmlFor="text" >Kuvaus</InputLabel>*/}
                <Typography variant="h5" className={classes.snowRecordEHeaders}>Kuvaus</Typography>
                <TextField id="standard-basic" label="Kirjoita..." variant="standard"/>
              {/* <Input
                  id="text"
                  type='text'
                  multiline={true}
                  rows={5}
                  placeholder={text}
                  onChange={updateText}              
              />*/}

              <Divider variant="middle" />  

              {/*</FormControl>*/}

              {/* Kuvan lisäys. Vain ulkoasu, EI TOIMI*/}
              <Typography variant="h5" className={classes.snowRecordEHeaders}>Kuva</Typography>
              <Button variant="contained" color="primary" endIcon={<AddIcon />} className={classes.snowRecordEButtons}>Lisää</Button>
            </Box>
            {/*</Box>
             Dialogin toimintopainikkeet. Päivitys disabloitu, jos lumityyppi on Ei tietoa (snowtype === 0) */}
            <DialogActions>
              <Button id={"dialogClose"} variant = 'contained' color="secondary" onClick={closeUpdate}>Peruuta</Button>
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
              {props.segmentdata.update === null || props.segmentdata.update === undefined ? "" : `${updateDate[2]}.${updateDate[1]}.${updateDate[0]} ${updateTime}`}
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