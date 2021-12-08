/**
Segmentin lisäyspainike ja segmentin lisäykseen liittyvät toiminnot

Luonut: Markku Nirkkonen 6.12.2020

10.1.2021 Markku Nirkkonen
Lisäyksiä segmentin lisäämiseen, esimerkiksi segmentin asettaminen lumivyöryherkäksi alueeksi

7.12.2020 Markku Nirkkonen
Jatkettu segmentin lisäyslomakkeen toteuttamista.
Segmentin lisääminen toimii, mutta lomake ei tarkista vielä kaikkia syötteitä.


**/

import * as React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles((theme) => ({
  add: {
    padding: theme.spacing(2),
    maxWidth: 400,
    marginTop: 10,
    margin: "auto",
    border: 1,
    borderRadius: 3,
    boxShadow: "0 2px 2px 2px rgba(0, 0, 0, .3)",
  },
  coordinateInputs: {
    display: "flex"
  },
  addNewLine: {
    // Koordinaattirivin lisäysnapin tyylit
  }
}));

function AddSegment(props) {

  // Hooks
  const [points, setPoints] = React.useState([{lat: null, lng: null}, {lat: null, lng: null}, {lat: null, lng: null}]);
  const [segmentName, setSegmentName] = React.useState("");
  const [terrain, setTerrain] = React.useState("");
  const [addOpen, setAddOpen] = React.useState(false);
  const [danger, setDanger] = React.useState(false);

  // Tarkistuksia lisäyspainikkeen aktivoitumiselle lisäysdialogissa
  // Tarkistaa, onko segmentillä nimi ja maastopohja
  // TODO: Lisää tarkistuksia koordinaateista?
  const formOK = Boolean(!(segmentName !== "" && terrain !== ""));
  
  // Määrittää, piirretäänkö rivinpoistopainike koordinaattipisterivin perään
  const fourthRow = Boolean(points.length >= 4);

  /*
   * Event handlers
   */
  
  // Avaa segmentin lisäysdialogin
  const openAdd = () => {
    setAddOpen(true);
  };

  // Sulkee dialogin
  const closeAdd = () => {
    setAddOpen(false);
    setSegmentName("");
    setTerrain("");
  };

  // Segmentin lisääminen (vahvistusdialogin jälkeen)
  const handleAdd = () => {
    
    // Tiedot  tulevat hookeista
    const data = {
      Nimi: segmentName,
      Maasto: terrain,
      Lumivyöryvaara: danger,
      On_Alasegmentti: props.id !== null ? props.id : null,
      Points: points
    };

    // Segmentin lisäämisen api-kutsu
    const fetchAddSegment = async () => {
      const response = await fetch("api/segment/",
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token
          },
          body: JSON.stringify(data),
        });
      const res = await response.json();
      console.log(res);
    };
    fetchAddSegment();

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
        });
        if (segment.Nimi === "Metsä") {
          props.updateWoods(segment);
        }
      });

      props.updateSegments(data);

    };
    fetchData();

    closeAdd();
  };

  // Segmentin nimen päivittäminen
  const updateName = (event) => {
    setSegmentName(event.target.value);
  };

  // Segmentin maastopohjan kuvauksen päivittäminen
  const updateTerrain = (event) => {
    setTerrain(event.target.value);
  };

  // Lumivyöryvaaran vaihtamienn
  const updateDanger = () => {
    setDanger(!danger);
  };

  // Koordinaattipisteiden päivittäminen
  const updatePoints = (index, latOrLng, event) => {
    console.log(event);
    const pointsNow = [...points];
    if (latOrLng === "lat") {
      pointsNow[index].lat = parseFloat(event.target.value);
    }
    if (latOrLng === "lng") {
      pointsNow[index].lng = parseFloat(event.target.value);
    }
    setPoints(pointsNow);
  };

  // Rivin lisääminen lomakkeelle (lisäpiste koordinaateille)
  const addNewRow = () => {
    setPoints([...points].concat({lat: null, lng: null}));
  };

  // Koordinaattipisterivin poistaminen
  const removeNewRow = () => {
    setPoints([...points].slice(0, points.length - 1));
  };

  const classes = useStyles();

  /*
   * Renderöinti
   */
  return (
    <div className="add">
      
      {/* Painike, joka avaa segmentin lisäysdialogin 
          ulkoasu muuttuu hieman riippuen siitä onko kyseessä
          ala- vai yläsegmentin lisäys*/}

      {
        props.addSubSegment
          ?
          <Button>
            <Typography variant="button" onClick={openAdd}>Lisää alasegmentti</Typography>
          </Button>
          :
          <Box className={classes.add}>
            <Button>
              <AddCircleOutlineIcon />
              <Typography variant="button" onClick={openAdd}>Lisää uusi yläsegmentti</Typography>
            </Button>
          </Box> 
      }
            

      {/* Segmentin lisäysdialogi */}
      <Dialog 
        onClose={closeAdd} 
        open={addOpen}
      >
        {/* Otsikko muuttuu tilanteen mukaan */}
        {props.addSubSegment ? <DialogTitle id="add_segment_dialog">Lisää alasegmentti</DialogTitle> : <DialogTitle id="add_segment_dialog">Lisää segmentti</DialogTitle>}
        <Typography variant="caption">Anna segmentille nimi, maastopohjakuvaus ja rajaavat koordinaatit.</Typography>
        <Typography variant="caption">Vähintään kolme (3) koordinaattipistettä vaaditaan.</Typography>
        <FormControl>
          <InputLabel htmlFor="name" >Segmentin nimi</InputLabel>
          <Input
            id="name"
            type='text'
            onChange={updateName}
          />
        </FormControl>
        <FormControl>  
          <InputLabel htmlFor="maasto" >Maastopohja</InputLabel>
          <Input
            id="maasto"
            type='text'
            onChange={updateTerrain}
          />
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox            
              checked={danger}
              onChange={updateDanger}
              name="danger"
              color="primary"
            />
          }
          label="Lumivyöryriskialue"
        />
        
        {/* Luodaan rivejä koordinaattipisteille 
        Neljännestä rivistä eteenpäin on mahdollisuus poistaa rivi */}
        {points.map((item, index) => {
          return (
            <Box key={index} className={classes.coordinateInputs}>
              <FormControl>  
                <InputLabel htmlFor={"lat"+index} >Lat:</InputLabel>
                <Input
                  id={"lat"+index}
                  type='text'
                  onChange={(event) => updatePoints(index, "lat", event)}
                />
              </FormControl>
              <FormControl>  
                <InputLabel htmlFor={"lng"+index} >Lng:</InputLabel>
                <Input
                  id={"lng"+index}
                  type='text'
                  onChange={(event) => updatePoints(index, "lng", event)}
                />
              </FormControl>
              
              {/* Neljännestä rivistä alkaen viimeinen rivi on mahdollista poistaa */}
              {
                fourthRow && index === points.length - 1 
                  ? 
                  <IconButton id="remove_new_points" aria-label="remove_new_points" onClick={removeNewRow}>
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  : 
                  <div />
              }
            </Box>
          );
        })}
        
        {/* Koordinaattipisterivin lisääminen */}
        <Box className={classes.addNewLine}>
          <IconButton id="add_new_points" aria-label="add_new_points" onClick={addNewRow}>
            <AddCircleOutlineIcon />
            <Typography variant="button">Lisää piste</Typography>
          </IconButton>
        </Box>
        
        {/* Painikkeet lomakkeen lopussa */}
        <DialogActions>   
          <Divider />
          <Button id={"deleteClose"} onClick={closeAdd}>Sulje</Button>
          <Button variant="contained" color="primary" id={"delete"} disabled={formOK} onClick={handleAdd}>Lisää</Button>
        </DialogActions>
      
      </Dialog>
    </div>
  );

}
 
export default AddSegment;