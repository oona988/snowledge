/**
Kartan ja sen päällä olevien elementtien piirto käyttöliittymään
Viimeisin päivitys

Markku Nirkkonen 9.1.2021
Lisätty metsään viittaavat markerit, joista voi valita myös metsäsegmentin lumitilanteen näkyviin

Markku Nirkkonen 30.12.2020
Värit tulevat nyt päivityksistä

Markku Nirkkonen 26.11.2020
Segmenttien värien selitteen kutistamis/laajentamis -mahdollisuus lisätty
Pieni korjaus segmenttien hoverin toimintaan.

Markku Nirkkonen 25.11.2020
Värit muutettu asiakkaan pyytämiksi
Ensimmäinen versio värien selitteistä lisätty kartan päälle
Tummennus segmentiltä poistuu, jos sen tiedot näyttävä kortti suljetaan

Markku Nirkkonen 17.11.2020
Segmenttien väri määräytyy nyt lumilaadun mukaan

Markku Nirkkonen 16.11.2020
Lisätty "Vain laskualueet" checkbox suodattamaan segmenttejä

Arttu Lakkala 15.11.2020
Lisätty päivitys värin valintaan

Emil Calonius 18.10.2021
Changed map from Google Maps to Maanmittauslaitos map

Emil Calonius 24.10.2021
Added drawing of segments on map

Emil Calonius 31.10.2021
Added highlighting to segments

Emil Calonius 4.11
Stopped using react-maplibre-ui library because of limitations
now creation of the map happens in PallasMap.js that is imported in this file

Emil Calonius 26.11.2021
Remove old infobox and checkbox
Add a filter feature

Emil Calonius 9.12
Edited layout of filter feature for mobile

**/

import * as React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import PallasMap from "./PallasMap";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import FilterIcon from "@material-ui/icons/FilterList";

// Tyylimäärittelyt kartan päälle piirrettäville laatikoille
const useStyles = makeStyles((theme) => ({
  menuContainer: {
    display: "flex",
    padding: theme.spacing(1),
    flexDirection: "column-reverse",
    flex: 6,
  },
  menu: {
    display: "block",
    backgroundColor: "white",
    borderRadius: 8
  },
  buttonsCntainer: {
    display: "flex",
    padding: theme.spacing(1),
    position: "absolute",
    bottom: "60px",
    left: theme.spacing(1),
    zIndex: 1,
    width: "350px"
  },
  buttonsCntainerMobile: {
    display: "flex",
    padding: theme.spacing(1),
    position: "absolute",
    bottom: "60px",
    left: theme.spacing(1),
    zIndex: 1,
    width: "100px"
  },
  eyeIcon: {
    color: "white",
  },
  eyeIconContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: theme.spacing(1),
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 8,
    flex: 1,
    height: "40px",
  },
  logo: {
    position: "absolute",
    left: "42vw",
    top: "15px",
    width: "72px",
    height: "44px",
    zIndex: 1
  }
}));

function Map(props) {
  
  // Use state hooks
  // Snow type to be highlighted on the map, -1 means subsegments only, -2 everything and -3 nothing
  const [ highlightedSnowType, setHighlightedSnowType ] = React.useState(-3);
  // An array of snow types that are currently applied to a segment on the map
  const [ currentSnowTypes, setCurrentSnowTypes ] = React.useState([]);
  const [ open, setOpen ] = React.useState(false);
  const [ buttonText, setButtonText ] = React.useState("Näytä ainoastaan...");

  // Zoom depends on the size of the screen
  const zoom = (props.isMobile ? 11 : 11.35);

  React.useEffect(() => {
    // Get all of the snow types that are currently applied to a segment on the map
    props.segments.forEach(segment => {
      let newArray = currentSnowTypes;
      if(segment.update !== null) {
        if(segment.update.Lumi1 !== undefined && !(currentSnowTypes.includes(segment.update.Lumi1))) {
          console.log(segment.update.Lumi1);
          newArray.push(segment.update.Lumi1);
        }
        if(segment.update.Lumi2 !== undefined && !(currentSnowTypes.includes(segment.update.Lumi2))) {
          console.log(segment.update.Lumi2);
          newArray.push(segment.update.Lumi2);
        }
      }
      setCurrentSnowTypes(newArray);
    });
  }, [props.segments]);

  /*
   * Event handlers
   */

  function handleClick() {
    setOpen(!open);
  }

  function updateHighlightedSnowType(snow) {
    if(highlightedSnowType === snow.ID) {
      setHighlightedSnowType(-3);
      setButtonText("Näytä ainoastaan...");
    } else {
      setHighlightedSnowType(snow.ID);
      setButtonText(snow.Nimi);
    }
  }
  
  // Updates the chosen segment
  function updateChosen(segment) {
    props.onClick(segment);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleClickOpen() {
    setOpen(!open);
  }
  
  // Use styles
  const styledClasses = useStyles();

  return (
    <div className="map">
      {props.isMobile ?
        <img className={styledClasses.logo} src="pallaksen_pollot_logo.png"></img>
        :
        <div></div>}
      <PallasMap
        shownSegment={props.shownSegment}
        chosenSegment={segment => updateChosen(segment)}
        segmentColors={props.segmentColors}
        segments={props.segments}
        isMobile={props.isMobile}
        zoom={zoom}
        viewManagement={props.viewManagement}
        highlightedSnowType={highlightedSnowType}
        showMap={props.showMap}
      ></PallasMap>
      {props.isMobile ? 
        <Box className={styledClasses.buttonsCntainerMobile}>
          <Box style={{paddingRight: "10px"}}>
            <IconButton
              onClick={handleClickOpen}
              style={{backgroundColor: highlightedSnowType > -2 ? "#ed7a72" : "white", height: "40px", borderRadius: 8}}
            >
              <FilterIcon></FilterIcon>
            </IconButton>
          </Box>
          <Dialog onClose={handleClose} open={open}>
            <List style={{maxHeight: "500px", overflow: "auto"}}>
              <Box className={styledClasses.menu}>
                {
                  // Append a snow type to the list if it can be found on a segment
                  currentSnowTypes.map(snowType => {
                    return(
                      currentSnowTypes.length > 0 ?
                        <Box key={snowType.ID}>
                          <Button
                            fullWidth="true"
                            onClick={() => {updateHighlightedSnowType(snowType); handleClickOpen();}}
                            style={{backgroundColor: highlightedSnowType === snowType.ID ? "#ed7a72" : "white"}}
                          >
                            {snowType.Nimi}
                          </Button>
                        </Box>
                        :
                        <Box></Box>
                    );
                  })
                }
                <Button
                  fullWidth="true"
                  onClick={() => {updateHighlightedSnowType({Nimi: "Vain laskualueet", ID: -1}); handleClickOpen();}}
                  style={{backgroundColor: highlightedSnowType === -1 ? "#ed7a72" : "white"}}
                >
                  Vain laskualueet
                </Button>
              </Box>
            </List>
          </Dialog>
          <Box className={styledClasses.eyeIconContainer}>
            <IconButton
              className={styledClasses.eyeIcon}
              onClick={() => {highlightedSnowType === -2 ? updateHighlightedSnowType({ID: -3, Nimi: "Näytä ainoastaan..."}) : updateHighlightedSnowType({ID: -2, Nimi: "Näytä ainoastaan..."});}}
            >
              {highlightedSnowType === -2 ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </Box>
        </Box>
        :
        <Box className={styledClasses.buttonsCntainer}>
          <Box className={styledClasses.menuContainer}>
            <Button
              onClick={handleClick}
              variant="contained"
              style={{backgroundColor: highlightedSnowType > -2 ? "#ed7a72" : "white", height: "40px"}}
            >
              {buttonText}
            </Button>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List style={{maxHeight: "500px", overflow: "auto"}}>
                <Box className={styledClasses.menu}>
                  {
                    // Append a snow type to the list if it can be found on a segment
                    currentSnowTypes.map(snowType => {
                      return(
                        currentSnowTypes.length > 0 ?
                          <Box key={snowType.ID}>
                            <Button
                              fullWidth="true"
                              onClick={() => {updateHighlightedSnowType(snowType); handleClick();}}
                              style={{backgroundColor: highlightedSnowType === snowType.ID ? "#ed7a72" : "white"}}
                            >
                              {snowType.Nimi}
                            </Button>
                          </Box>
                          :
                          <Box></Box>
                      );
                    })
                  }
                  <Button
                    fullWidth="true"
                    onClick={() => {updateHighlightedSnowType({Nimi: "Vain laskualueet", ID: -1}); handleClick();}}
                    style={{backgroundColor: highlightedSnowType === -1 ? "#ed7a72" : "white"}}
                  >
                    Vain laskualueet
                  </Button>
                </Box>
              </List>
            </Collapse>
          </Box>
          <Box className={styledClasses.eyeIconContainer}>
            <IconButton
              className={styledClasses.eyeIcon}
              onClick={() => {highlightedSnowType === -2 ? updateHighlightedSnowType({ID: -3, Nimi: "Näytä ainoastaan..."}) : updateHighlightedSnowType({ID: -2, Nimi: "Näytä ainoastaan..."});}}
            >
              {highlightedSnowType === -2 ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </Box>
        </Box>
      }
    </div>
  );
}

export default Map;