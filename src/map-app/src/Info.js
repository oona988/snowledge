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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SnowRecordView from "./SnowRecordView";

// Changes button color palette. Muuttaa nappien väripalettia.
const theme = createTheme({
  palette: {
    primary: {
      main: "#000000B3"
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
    fontFamily: "Donau",
    letterSpacing: 4,
    textTransform: "uppercase",
    fontWeight: 600,
    display: "block",
  },
  snowRecordEHeaders: {
    fontFamily: "Donau",
    padding: "3px",
    marginTop: "5px",
    marginBottom: "5px",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: 600,
    display: "block",
    fontSize: "medium",
  },
  snowRecordEButtons: {
    paddingLeft: 66,
    paddingRight: 56,
    position: "relative",
    borderRadius: "10px",

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
    borderRadius: "10px",
    width: 350,
  },
  snowRecordEItemContents: {
    marginBottom: "5px",
    marginTop: "2px",
    display: "flex",
    flexDirection: "row",
  },
  snowRecordETextFields: {
    fontFamily: "Donau",
    borderRadius: "10px",
  },
}));


function Info(props) {

  const [loginOpen, setLoginOpen] = React.useState(false);
  const [text, setText] = React.useState("");

  const [entryVisible, setEntryVisible] = React.useState(true);
  const [addVisible, setAddVisible] = React.useState(true);
  const [selectVisible, setSelectVisible] = React.useState(false);
  const [searchVisible, setSearchVisible] = React.useState(false);

  const [selectDisabled, setSelectDisabled] = React.useState([false, false]);
  const [isSecondary, setIsSecondary] = React.useState(false);
  const [snowRecordContent, setSnowRecordContent] = React.useState([]);
  const [snowTypeList, setSnowTypeList] = React.useState([]);
  const [disabledSnowTypes, setDisabledSnowTypes] = React.useState([]);
  //

  const classes = useStyles();

  /*
   * Event handlers
   */

  // Segmentin päivitysdialogin avaus
  const openUpdate = () => {

    console.log(props.segmentdata.update.Lumi1);
    console.log(props.segmentdata.update.Lumi2);
    console.log(props.segmentdata.update.Lumi3);
    console.log(props.segmentdata.update.Lumi4);

    setSnowTypeList(props.snowtypes);

    setEntryVisible(true);
    setText(props.segmentdata.update !== null ? props.segmentdata.update.Kuvaus : "");
    const idArray = [];

    idArray[0] = (props.segmentdata.update !== null ? props.segmentdata.update.Lumilaatu_ID1 : 0);
    idArray[1] = (props.segmentdata.update !== null ? props.segmentdata.update.Lumilaatu_ID2 : 0);
    idArray[2] = (props.segmentdata.update !== null ? props.segmentdata.update.Toissijainen_ID1 : 0);
    idArray[3] = (props.segmentdata.update !== null ? props.segmentdata.update.Toissijainen_ID2 : 0);

    snowRecordStartUp(idArray);
    setLoginOpen(true);
  };

  // Segmentin päivitysdialogin sulkeminen
  const closeUpdate = () => {
    setSearchVisible(false);
    setSelectVisible(false);
    setAddVisible(true);
    setSelectDisabled([false, false]);
    setSnowRecordContent([]);
    setDisabledSnowTypes([]);
    setLoginOpen(false);
    setText("");
  };

  // Lumitilanteen kuvaustekstin päivittäminen
  const updateText = (e) => {
    setText(e.target.value);
  };

  // Nollataan valittu segmentti sulkiessa
  function closeShownSegment() {
    props.onClose(null);
  }

  // Hides unnecessary information on snow record entry view, if checkbox is checked.
  const updateEntryVisible = (e) => {
    if (!e.target.checked) {
      setEntryVisible(true);
    }
    else if (e.target.checked) {
      setEntryVisible(false);
    }
  };

  // opens search
  const handleSearchOpen = (e) => {

    setIsSecondary(e.target.value);
    setAddVisible(false);
    setSelectVisible(false);
    setSearchVisible(true);
  };

  // closes search 
  const handleSearchClose = (e, value) => {
    if (value !== null) {
      addSnowRecordContent(value.ID);
      setDisabledSnowTypes(disabledSnowTypes.concat(value.ID));
    }

    if (snowRecordContent.length < 3) {
      setAddVisible(true);
    }

    setSearchVisible(false);
  };

  const snowRecordStartUp = (array) => {
    let newContent = [];
    let newDisabled = [];
    let primaryCount = 0;
    let secondaryCount = 0;

    for (let i = 0; i < array.length; i++) {
      if (array[i] !== null && array[i] > 0) {
        if (i > 1) {
          secondaryCount++;
          newContent = newContent.concat({ id: array[i], secondary: true });
          newDisabled =  newDisabled.concat(array[i]);
        }
        else {
          primaryCount++;
          newContent = newContent.concat({ id: array[i], secondary: false });
          newDisabled = newDisabled.concat(array[i]);
        }
      }
    }

    console.log(primaryCount);
    console.log(secondaryCount);

    let newValues = selectDisabled;

    if (primaryCount == 2) {
      // disables primary option
      newValues[0] = true;
    }
    
    if (secondaryCount == 2) {
      // disables secondary option
      newValues[1] = true;
    }

    if(primaryCount + secondaryCount === 4){
      setAddVisible(false);
    } 
    else {
      setAddVisible(true);
    }

    console.log(newContent);
    setSelectDisabled(newValues);
    setDisabledSnowTypes(newDisabled);
    setSnowRecordContent(snowRecordContent.concat(newContent));
  };

  const addSnowRecordContent = (id) => {
    let primaryValues = 0;
    let secondaryValues = 0;
    // Determines amount of primary and secondary snow types
    snowRecordContent.forEach(e => {
      if (e["secondary"] === false) {
        primaryValues++;
      }
      else if (e["secondary"] === true) {
        secondaryValues++;
      }
    });

    if (!isSecondary) {
      let primaryContent = { id: id, secondary: false };
      setSnowRecordContent(snowRecordContent.concat(primaryContent));

      if (primaryValues == 1) {
        // disables primary option
        let newValues = selectDisabled;
        newValues[0] = true;
        setSelectDisabled(newValues);
      }
    }
    else if (isSecondary) {

      let secondaryContent = { id: id, secondary: true };
      console.log(secondaryContent);
      setSnowRecordContent(snowRecordContent.concat(secondaryContent));

      if (secondaryValues == 1) {
        // disables secondary option
        let newValues = selectDisabled;
        newValues[1] = true;
        setSelectDisabled(newValues);
      }
    }
  };
  // Gets snowrecordcontent IDs inside an Array (Useful for updates)
  function getSnowRecordContentIDs() {
    let idArray = [];
    let secondaryArray = [];
    snowRecordContent.forEach(element => {
      if (element.secondary === false) {
        idArray.push(element.id);
      }
    });

    if (idArray.length == 1) {
      idArray.push(null);
    }
    else if (idArray.length == 0) {
      idArray.push(null);
      idArray.push(null);
    }

    snowRecordContent.forEach(element => {
      if (element.secondary === true) {
        secondaryArray.push(element.id);
      }
    });

    if (secondaryArray.length == 1) {
      secondaryArray.push(null);
    }
    else if (secondaryArray.length == 0) {
      secondaryArray.push(null);
      secondaryArray.push(null);
    }

    idArray = idArray.concat(secondaryArray);

    return idArray;
  }

  // Removes a snowtype in snow record entry view
  const removeSnowtype = (item) => {
    const newContent1 = snowRecordContent.filter(snowRecordContent => { return snowRecordContent.id != item.id; });
    setSnowRecordContent(newContent1);

    if (newContent1.length < 4) {
      setAddVisible(true);
    }

    if (item.secondary === false) {
      let newValues = selectDisabled;
      newValues[0] = false;
      setSelectDisabled(newValues);
    }

    if (item.secondary === true) {
      let newValues = selectDisabled;
      newValues[1] = false;
      setSelectDisabled(newValues);
    }

    const newContent2 = disabledSnowTypes.filter(disabledSnowTypes => { return disabledSnowTypes != item.id; });
    setDisabledSnowTypes(newContent2);

  };
  // Defines the default value of a snowtype box
  const getValue = (id) => {
    let index = snowTypeList.findIndex((snowTypeList => snowTypeList.ID === id));
    console.log(snowTypeList[index]);
    return snowTypeList[index];
  };
  // Checks if an option should be disabled or not
  const checkDisabledValues = (option) => {
    let returnValue = false;

    disabledSnowTypes.forEach(type => {
      if (option.ID == type) {
        returnValue = true;
      }
    });
    return returnValue;
  };

  // closes the select inside snow type box and switches the value of the box
  const handleSelectClose = (e, value, item) => {
    let itemId = item.id;
    let valueId = value.ID;
    let index = snowRecordContent.findIndex((snowRecorditem => snowRecorditem.id === itemId));

    const newContent = snowRecordContent;
    newContent[index].id = valueId;
    setSnowRecordContent(newContent);

    let newContent2 = disabledSnowTypes.filter(snowtype => snowtype != itemId);
    newContent2 = newContent2.concat(valueId);
    setDisabledSnowTypes(newContent2);
  };

  // Kun lomake lähetetään, tehdään POST methodin api-kutsu polkuun /api/update/:id
  const sendForm = () => {
    
    const idValues = getSnowRecordContentIDs();
    // Tallennushetken lumilaatujen id:t, kuvausteksti. Lisäksi päivitettävän (valitun) segmentin ID
    const data = {
      Segmentti: props.segmentdata.ID,
      Lumilaatu_ID1: idValues[0],
      Lumilaatu_ID2: idValues[1],
      Toissijainen_ID1: idValues[2],
      Toissijainen_ID2: idValues[3],
      Kuvaus: text
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

      // PÄIVITÄ VASTAAMAAN NYKYISTÄ TIETOKANTAA, TARKISTA VIRHEIDEN VARALTA !!!
      await updateData.forEach(update => {
        snowdata.forEach(snow => {
          if (snow.ID === update.Lumilaatu_ID1) {
            update.Lumi1 = snow;
          }
          else if (snow.ID === update.Lumilaatu_ID2) {
            update.Lumi2 = snow;
          }
          else if (snow.ID === update.Toissijainen_ID1) {
            update.Lumi3 = snow;
          }
          else if (snow.ID === update.Toissijainen_ID2) {
            update.Lumi4 = snow;
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

          <SnowRecordView segmentdata={props.segmentdata} close={closeShownSegment} snowtypes={props.snowtypes}></SnowRecordView>
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
                <Typography className={classes.snowRecordEHeader}>PÄIVITÄ SEGMENTTIÄ</Typography>
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

                {/*THIS BOX CONTAINS ELEMENTS HIDDEN WHEN THE CHECKBOX IS ACTIVE*/}
                {entryVisible && (
                  <Box className={classes.snowRecordEPart}>
                    <Divider variant="middle" />
                    <Box className={classes.snowRecordEPart}>
                      {/*Snowtype add button:*/}
                      {addVisible && (<Box className={classes.snowRecordEButtonsWrapper}>
                        <Button size="large" variant="contained" onClick={() => { setAddVisible(false); setSelectVisible(true); }} color="primary" endIcon={<SearchIcon fontSize="large" />}
                          className={classes.snowRecordEButtons}>Lisää
                        </Button>
                      </Box>)}
                      {/*Select whether type is primary or secondary:*/}
                      {selectVisible && (<Select className={classes.snowRecordETextFields}
                        fullWidth={true}
                        displayEmpty
                        open={true}
                        onChange={handleSearchOpen}
                        style={{
                          backgroundColor: "white", border: "6px solid", color: "#000000B3"
                        }}
                      >
                        <MenuItem disabled={selectDisabled[0]} value={false}>Ensisijainen</MenuItem>
                        <MenuItem disabled={selectDisabled[1]} value={true}>Toissijainen</MenuItem>
                      </Select>)}
                      {/*Autofill search:*/}
                      {searchVisible && (<Box>
                        <Autocomplete
                          className={classes.snowRecordETextFields}
                          id="snowRecordSearch"
                          onChange={(event, value) => { handleSearchClose(event, value); }}
                          open={searchVisible}
                          autoComplete={true}
                          options={snowTypeList}
                          noOptionsText={"Ei tuloksia"}
                          popupIcon={""}
                          size="small"
                          getOptionDisabled={(option) => checkDisabledValues(option)}
                          getOptionLabel={(option) => option.Nimi}
                          renderInput={(params) => (<TextField {...params} className={classes.snowRecordETextFields}
                            size="small"
                            autoFocus={true}
                            placeholder="Etsi"
                            variant="outlined"
                            style={{ backgroundColor: "white", border: "6px solid", color: "#000000B3" }}
                          />)}
                        />
                      </Box>)}
                      {/*Snowtype boxes*/}
                      {snowRecordContent.map(item => (<Box id={item.id} key={item.id}>
                        <Box className={classes.snowRecordEItem} boxShadow={2}>
                          <Box display="flex" flexDirection="row">
                            <Typography className={classes.snowRecordEHeaders}>{item.secondary ? "Toissijainen tyyppi" : "Ensisijainen tyyppi"}</Typography>
                            <IconButton onClick={() => removeSnowtype(item)} marginLeft="auto">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                          <Autocomplete
                            className={classes.snowRecordETextFields}
                            disableClearable
                            id="snowRecordSearch"
                            autoComplete={true}
                            onChange={(e, value) => { handleSelectClose(e, value, item); }}
                            options={snowTypeList}
                            noOptionsText={"Ei tuloksia"}
                            size="small"
                            getOptionDisabled={(option) => checkDisabledValues(option)}
                            defaultValue={getValue(item.id)}
                            getOptionLabel={(option) => option.Nimi}
                            renderInput={(params) => (<TextField {...params} fullWidth={true} className={classes.snowRecordETextFields}
                              size="small" variant="outlined"
                            />)}
                          />
                        </Box>
                      </Box>))}
                    </Box>

                    <Divider variant="middle" />
                    {/* Description text box*/}
                    <Box className={classes.snowRecordEPart}>
                      <Typography variant="h5" className={classes.snowRecordEHeaders}>Kuvaus</Typography>
                      <TextField className={classes.snowRecordETextFields} value={text} onChange={updateText} id="standard-basic" placeholder="Kirjoita..." multiline variant="outlined" />
                    </Box>
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
             Dialogin toimintopainikkeet. Päivitys disabloitu, jos lumityyppi on Ei tietoa (snowtype === 0) KORJAA DISABLED!*/}
                <DialogActions>
                  <Button id={"dialogClose"} variant="contained" color="secondary" onClick={closeUpdate}>Peruuta</Button>
                  <Button variant="contained" color="primary" id={"dialogOK"} onClick={sendForm} disabled={false}>Päivitä</Button>
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