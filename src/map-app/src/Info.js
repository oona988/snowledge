/**
Segmenttien tiedot piirtävä komponentti
Sisältää myös segmenttien tietojen päivitystoiminnot kirjautuneille käyttäjille

Luonut: Markku Nirkkonen

Päivityshistoria

18.10.2021 Juho Kumara
Muokattu segmenttien päivitysikkunaa vastaamaan uutta UI-suunnitelmaa (Keskeneräinen versio ilman kaikkia tyylimuutoksia)
Edited snow record entry view to look similar to new UI design (Work-in-progress version without proper styling)

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
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
//import Input from "@material-ui/core/Input";
//import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";
//import { DialogContent, Paper } from "@material-ui/core";
//import { shadows } from '@material-ui/system';
//import { borders } from '@material-ui/system';
import SnowRecordView from "./SnowRecordView";

// Changes button color palette. Muuttaa nappien väripalettia.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#42628C"
    },
    secondary: {
      main: "#EEEEEE"
    }
  }
});

const useStyles = makeStyles((theme) => ({
  editButton: {
    color: "black",
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
    margin: "10px",
  },
  snowRecordEPart: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: "15px",
    marginTop: "15px",
  },
  snowRecordEHeader: {
    fontWeight: "bold",
    fontSize: 20,
  },
  snowRecordEHeaders: {
    fontSize: 15,
    padding: "3px",
    marginTop: "5px",
    marginBottom: "5px",
  },
  snowRecordEButtons: {
    paddingLeft: 66,
    paddingRight: 56,
    position: "relative",

    "& .MuiButton-endIcon": {
      position: "absolute",
      right: 16
    }
  },
  snowRecordEButtonsWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  snowRecordEItem: {
    padding: "10px",
    marginTop: "3px",
    marginBottom: "3px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: "3",
    borderRadius: "16",
  },
  snowRecordEItemContents: {
    marginBottom: "5px",
    marginTop: "2px",
    display: "flex",
    flexDirection: "row",
  },
}));


function Info(props) {

  const [loginOpen, setLoginOpen] = React.useState(false);
  const [snowtype, setSnowtype] = React.useState(0);
  const [text, setText] = React.useState("Ei tietoa");
  const [entryVisible, setEntryVisible] = React.useState(true);
  const [addVisible, setAddVisible] = React.useState(true);
  const [searchVisible, setSearchVisible] = React.useState(false);
  const [snowRecordContent, setSnowRecordContent] = React.useState([]);

  const classes = useStyles();

  // Delete after database is implemented
  const testSnowTypes = [
    { type: "Pehmeä lumi", value: 0 },
    { type: "Tuulen pieksämä aaltoileva lumi", value: 1 },
    { type: "Korppu", value: 2 },
    { type: "Sohjo", value: 3 },
    { type: "Jää", value: 4 },
  ];

  /*
   * Event handlers
   */

  // Segmentin päivitysdialogin avaus
  const openUpdate = () => {
    setEntryVisible(true);
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
  /*const updateText = (event) => {
    setText(event.target.value);
  };*/

  // Lumitilanteen lumityypin päivittäminen
  /*const updateSnowtype = (event) => {
    setSnowtype(event.target.value);
  };*/

  // Nollataan valittu segmentti sulkiessa
  function closeShownSegment() {
    props.onClose(null);
  }

  // Hides unnecessary information on snow record entry view, if checkbox is checked.
  const updateEntryVisible = (event) => {
    // updates display of the box, none makes contents hidden
    if (!event.target.checked) {
      setEntryVisible(true);
    }
    else if (event.target.checked) {
      setEntryVisible(false);
    }
  };
  // opens search
  const handleSearchOpen = (/*event*/) => {
    // updates display of the box, none makes contents hidden
    setAddVisible(false);
    setSearchVisible(true);
  };
  // closes search
  const handleSearchClose = (event, value) => {
    setSnowRecordContent(snowRecordContent.concat(value));
    console.log(value);
    /*console.log(event.target.textContent);*/
    setAddVisible(true);
    setSearchVisible(false);
  };
  // Removes snowtype in snow record entry view
  /*const removeSnowtype = (event, value) => {
      KESKEN
  };*/

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
          if (snow.ID === update.Lumilaatu) {
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
        if (segment.On_Alasegmentti != null) {
          data.forEach(mahd_yla_segmentti => {
            if (mahd_yla_segmentti.ID === segment.On_Alasegmentti) {
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
          <SnowRecordView segmentdata={props.segmentdata} close={closeShownSegment}></SnowRecordView>
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
            <MuiThemeProvider theme={theme}>
              <DialogTitle id="update-segment">
                {/*Otsikko */}
                <Typography className={classes.snowRecordEHeader}>Päivitä segmenttiä</Typography>
                {/*Avustetekstit, esim segmentin nimi */}
                <Typography variant="h5" className={classes.snowRecordEHeaders}>{props.segmentdata.Nimi}</Typography>
              </DialogTitle>

              <Box className={classes.snowRecordEBox}>
                <Box className={classes.snowRecordEPart}>
                  {/* Checkboxi pelkän aikaleiman päivitykselle*/}
                  <Box>
                    <FormControlLabel color="#42628B" control={<Checkbox onChange={updateEntryVisible} />} label="Päivitä vain aikaleima" />
                  </Box>
                </Box>

                <Divider variant="middle" />

                {/*THIS BOX CONTAINS ITEMS HIDDEN WHEN THE CHECKBOX IS ACTIVE*/}
                {entryVisible && (
                  <Box className={classes.snowRecordEPart}>
                    <Box className={classes.snowRecordEPart}>
                      {/* Lumityypin valinta 
                <InputLabel id="snowtype" className={classes.inputs}>Lumityypit {"\u0026"} esteet</InputLabel> */}
                      <Typography variant="h5" className={classes.snowRecordEHeaders}>Lumityypit {"\u0026"} esteet</Typography>
                      {/* OLD ONES COMMENTED: <Select
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

                      {addVisible && (<Box className={classes.snowRecordEButtonsWrapper}>
                        <Button size="large" variant="contained" onClick={handleSearchOpen} color="primary" endIcon={<SearchIcon fontSize="large" />}
                          className={classes.snowRecordEButtons}>Lisää</Button>
                      </Box>)}
                      {/*Add options from database to autocomplete: (Remove placeholders)*/}
                      {searchVisible && (<Box>
                        <Autocomplete
                          id="snowRecordSearch"
                          onChange={(event, value) => { handleSearchClose(event, value); }}
                          open={true}
                          autoComplete={true}
                          options={testSnowTypes}
                          noOptionsText={"Ei tuloksia"}
                          popupIcon={""}
                          getOptionLabel={(option) => option.type}
                          renderInput={(params) => (<TextField {...params} label="Etsi" variant="outlined"
                          />)}
                        />
                      </Box>)}

                      {snowRecordContent.map(item => (<Box key={item.value}>
                        <Box className={classes.snowRecordEItem} boxShadow={2} borderRadius={8}>
                          <div className={classes.snowRecordEItemContents}>
                            <FormControl variant="outlined" size="small" style={{ width: "80%" }}>
                              <Select
                                autoWidth={false}
                                value={item.value}
                                displayEmpty
                              >
                                <MenuItem value={0}>Pehmeä lumi</MenuItem>
                                <MenuItem value={1}>Tuulen pieksämä aaltoileva lumi</MenuItem>
                                <MenuItem value={2}>Korppu</MenuItem>
                                <MenuItem value={3}>Sohjo</MenuItem>
                                <MenuItem value={4}>Jää</MenuItem>
                              </Select>
                            </FormControl>
                            <IconButton paddingLeft={"10px"}>
                              <DeleteIcon />
                            </IconButton>
                          </div>
                          <Button size="small" variant="contained" color="primary" style={{ width: "80%" }}>Lisää alatyyppi</Button>
                        </Box>
                      </Box>))}
                    </Box>

                    <Divider variant="middle" />
                    {/* Kuvausteksti 
              <FormControl className={classes.inputs}>
                <InputLabel htmlFor="text" >Kuvaus</InputLabel>*/}
                    <Box className={classes.snowRecordEPart}>
                      <Typography variant="h5" className={classes.snowRecordEHeaders}>Kuvaus</Typography>
                      <TextField id="standard-basic" label="Kirjoita..." variant="standard" />
                    </Box>
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
                    <Box className={classes.snowRecordEPart}>
                      <Typography variant="h5" className={classes.snowRecordEHeaders}>Kuva</Typography>
                      <Box className={classes.snowRecordEButtonsWrapper}>
                        <Button size="large" variant="contained" color="primary" endIcon={<AddIcon fontSize="large" />} className={classes.snowRecordEButtons}>Lisää</Button>
                      </Box>
                    </Box>
                  </Box>)}
                {/*</Box>
             Dialogin toimintopainikkeet. Päivitys disabloitu, jos lumityyppi on Ei tietoa (snowtype === 0) */}
                <DialogActions>
                  <Button id={"dialogClose"} variant="contained" color="secondary" onClick={closeUpdate}>Peruuta</Button>
                  <Button variant="contained" color="primary" id={"dialogOK"} onClick={sendForm} disabled={snowtype === 0}>Päivitä</Button>
                </DialogActions>
              </Box>
            </MuiThemeProvider>
          </Dialog>
        </div>
      );
    }
    else {
      // Kirjautumattoman käyttäjän näkymät (muokkaustoimintoa ei ole)
      return (
        <div className="info">
          <SnowRecordView segmentdata={props.segmentdata} close={closeShownSegment}></SnowRecordView>
        </div>
      );
    }
    // mikäli segmenttidataa ei ole saatavilla, ei yritetä renderöidä mitään näkyvää
  } else {
    return <div className="info" />;
  }
}

export default Info;