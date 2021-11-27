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

**/

import * as React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import PallasMap from "./PallasMap";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";

// Tyylimäärittelyt kartan päälle piirrettäville laatikoille
const useStyles = makeStyles((theme) => ({
  menuContainer: {
    display: "flex",
    padding: theme.spacing(1),
    position: "absolute",
    bottom: "20px",
    left: theme.spacing(1),
    zIndex: 1,
    flexDirection: "column-reverse",
    width: "300px",
  },
  listItem: {
    display: "block",
    backgroundColor: "white",
    width: "300px",
    borderRadius: 8
  }
}));

function Map(props) {
  
  // Use state hooks
  const [ subsOnly, setSubsOnly ] = React.useState(false);
  const [ highlightedSnowType, setHighlightedSnowType ] = React.useState(-1);
  // An array of snow types that are currently applied to a segment on the map
  const [ currentSnowTypes, setCurrentSnowTypes ] = React.useState([]);
  const [ open, setOpen ] = React.useState(false);

  // Zoom depends on the size of the screen
  const zoom = (props.isMobile ? 11 : 11.35);

  React.useEffect(() => {
    // Get all of the snow types that are currently applied to a segment on the map
    props.segments.forEach(segment => {
      if(segment.update !== null) {
        if(segment.update.Lumi !== undefined && !(currentSnowTypes.includes(segment.update.Lumi))) {
          let newArray = currentSnowTypes;
          newArray.push(segment.update.Lumi);
          setCurrentSnowTypes(newArray);
        }
      }
    });
  }, [props.segments]);

  /*
   * Event handlers
   */

  function handleClick() {
    setOpen(!open);
  }
  // eslint-disable-next-line no-unused-vars
  function updateHighlightedSnowType(snowId) {
    if(highlightedSnowType === snowId) {
      setHighlightedSnowType(-1);
    } else {
      setHighlightedSnowType(snowId);
    }
  }
  
  // Päivittää tiedon kartalta valitusta segmentistä
  function updateChosen(segment) {
    props.onClick(segment);
  }
  
  // Päivitetään tieto siitä, näytetäänkö vain alasegmentit vai ei
  // eslint-disable-next-line no-unused-vars
  function updateSubsOnly() {
    setSubsOnly(!subsOnly);
  }
  
  // Use styles
  const styledClasses = useStyles();

  return (
    <div className="map">
      <Box className={styledClasses.menuContainer}>
        <Button
          onClick={handleClick}
          variant="contained"
        >Näytä alueet...</Button>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List>
            <Box className={styledClasses.listItem}>
              {
                // Append a snow type to the list if it can be found on a segment
                currentSnowTypes.map(snowType => {
                  return(
                    currentSnowTypes.length > 0 ?
                      <Box key={snowType.ID}>
                        <Button fullWidth="true" onClick={() => {updateHighlightedSnowType(snowType.ID); handleClick(); if(subsOnly) updateSubsOnly();}}>
                          {snowType.Nimi}
                        </Button>
                      </Box>
                      :
                      <Box></Box>
                  );
                })
              }
              <Button fullWidth="true" onClick={() => {updateSubsOnly(); handleClick(); if(highlightedSnowType !== -1) updateHighlightedSnowType(-1);}}>
                Vain laskualueet
              </Button>
            </Box>
          </List>
        </Collapse>
      </Box>
      <PallasMap
        shownSegment={props.shownSegment}
        chosenSegment={segment => updateChosen(segment)}
        segmentColors={props.segmentColors}
        segments={props.segments}
        isMobile={props.isMobile}
        zoom={zoom}
        subsOnly={subsOnly}
        viewManagement={props.viewManagement}
        highlightedSnowType={highlightedSnowType}
      ></PallasMap>
    </div>
  );
}

export default Map;