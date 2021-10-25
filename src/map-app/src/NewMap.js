/**
Kartan piirto käyttöliittymään ('@react-google-maps/api' -kirjaston komponenteilla)
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
Vaihdettiin sovelluksen käyttämä kartta Google Mapsista Maanmittauslaitoksen karttaan.

**/

import * as React from "react";
import clsx from "clsx";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import pallasMap from "./pallas_map.json";
import { Map as NewMap, MapLayer, MapSource } from "react-maplibre-ui";
import "maplibre-gl/dist/maplibre-gl.css";

// Tyylimäärittelyt kartan päälle piirrettäville laatikoille
const useStyles = makeStyles((theme) => ({
  checkbox: {
    backgroundColor: "white",
    padding: theme.spacing(1)
  },
  checkboxContainer: {
    display: "flex",
    padding: theme.spacing(1),
    position: "absolute",
    bottom: "20px",
    left: theme.spacing(1),
    zIndex: 1
  },
  infoboxContainer: {
    padding: theme.spacing(1),
    width: "120px",
    backgroundColor: "white",
    position: "absolute",
    top: "210px",
    left: theme.spacing(1),
    zIndex: 1,
    display: "block"
  },
  infobox: {
    display: "block",
    padding: theme.spacing(0.2),
  },
  infoboxHeader: {
    display: "flex",
  },
  colorbox: {
    height: "15px",
    zIndex: 1,
  },
  snowLogo: {
    textAlign: "center"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

function Map(props) {
  
  // Use state hooks
  const [ selectedSegment, setSelectedSegment ] = React.useState({});
  const [ mouseover, setMouseover ] = React.useState({ID: null, name: null});
  const [ subsOnly, setSubsOnly ] = React.useState(false);
  const [ expanded, setExpanded ] = React.useState(props.isMobile ? false : true);
  const [ highlighted, setHighlighted] = React.useState(null);

  const center = [24.05, 68.069];

  // zoom rippuu näytön koosta
  const zoom = (props.isMobile ? 11 : 11.35);

  // Koordinaattipisteet segmenttejä ympäröiville metsämarkereille
  /*
  const markerPoints = [
    {lat: 68.035073, lng: 24.044421},
    {lat: 68.085595, lng: 24.005129},
    {lat: 68.082975, lng: 24.116956}
  ];
  */

  /*
   * Event handlers
   */
  
  // Päivittää tiedon kartalta valitusta segmentistä
  function updateChosen(segment) {
    setSelectedSegment(segment);
    props.onClick(segment);
  }

  // Päivitetään tieto siitä, minkä segmentin päälläkursori on
  function updateMouseover(id, name) {
    setMouseover({ID: id, name: name});
  }

  // Nollataan tiedot, kun kursori poistuu segmentin päältä
  function handleMouseout() {
    setMouseover({ID: null, name: null});
  }
  
  // Päivitetään tieto siitä, näytetäänkö vain alasegmentit vai ei
  function updateSubsOnly() {
    setSubsOnly(!subsOnly);
  }

  // Laajentaa/kutistaa segmenttien väritietoboksin
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Päivittää korostettavan lumityypin kursorin liikkuessa segmentti-infojen päällä
  // Arvo on 0, jos kyseessä on päivittämätön segmentti (lumilaadun nimi "Ei tietoa", kts. Pallas.js)
  // Arvo on index + 1, mikä vastaa lumityypin ID:tä (tämän avulla oikean lumityypin segmentit korostuvat kartassa)
  // Arvo on null, jos funktio ei saa tietoa parametrina (hiiren poistuessa selitteen yläpuolelta)
  const updateHighlighted = (item, index) => {
    if (item) {
      if (item.name === "Ei tietoa") {
        setHighlighted(0);
      } else {
        setHighlighted(index+1);
      }
    } else {
      setHighlighted(null);
    }  
  };
  
  // Use styles
  const styledClasses = useStyles();

  return (
    /*
     * Karttaan piirretään checkbox yläsegmenttien piilottamiselle,
     * Infolaatikko selittämään kartan värejä
     * Segmentit monikulmioina
     * Custom markereita metsän ja mahdollisen lumivyöryvaaran merkkaamiseksi
     * Kartta piirretään '@react-google-maps/api' -kirjaston komponenteilla
     */
    <div className="map">
      <Box className={styledClasses.checkboxContainer}>
        <FormControlLabel
          className={styledClasses.checkbox}
          control={
            <Checkbox            
              checked={subsOnly}
              onChange={updateSubsOnly}
              name="Subsegments_only"
              color="primary"
            />
          }
          label="Vain laskualueet"
        />
      </Box>
      <Box className={styledClasses.infoboxContainer}>
        <Box className={styledClasses.infoboxHeader}>
          <Typography>Selitteet</Typography>
          <IconButton
            className={clsx(styledClasses.expand, {
              [styledClasses.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {/* Selitteet renderöidään, jos tiedot segmenttien nimistä ovat saatavilla (props.segmentColors.name) */}
          {
            props.segmentColors !== null 
              ?
              props.segmentColors.map((item, index) => {
              
                return (
                // Seliteboksi, sisältää lumilogot ja selitteet
                  <Box key={index} className={styledClasses.infobox} onMouseOver={() => updateHighlighted(item, index)} onMouseOut={() => updateHighlighted(null)} onClick={() => updateHighlighted(item, index)}>
                    {/* Lumityypin ikonin tiedostonimen tulee olla luku, joka vastaa lukua,
                  joka on sama kuin lumityypin indeksi segmenttiväritaulukossa + 1 */}
                    {
                      index === props.segmentColors.length - 1 
                        ? 
                        <Typography className={styledClasses.snowLogo}>?</Typography> 
                        : 
                        <Box className={styledClasses.snowLogo}><img src={process.env.PUBLIC_URL + "/pienetlogot/" + (index + 1) + ".png"} alt="lumityypin logo" align="center"/></Box>      
                    }
                    {/* <Paper className={styledClasses.colorbox} style={{backgroundColor: item.color}} /> */}
                    <Box className={styledClasses.snowLogo}>
                      <Typography variant='caption' align='justify'>{item.name}</Typography>
                    </Box>       
                    <Divider />
                  </Box>
                );
              })
              :
              <div />
          }
        </Collapse>
      </Box>
      <NewMap
        mapStyle={pallasMap}
        style={{
          height: "100%",
          width: "100%",
        }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        {
          props.segments.map(item => {
            var drawColor = "#000000";
            var snowID = 0;
            var drawOpacity = 0.15;
            if(item.update !== null) {
              if(item.update.Lumi !== undefined) {
                drawColor = item.update.Lumi.Vari;
                snowID = item.update.Lumi.ID;
              }
            }
            // Set opacity to be higher value when highlighted
            if(mouseover.ID === item.ID || (selectedSegment.ID === item.ID && props.shownSegment !== null) || highlighted === snowID) {
              drawOpacity = 0.8;
            }
            // Create an array that includes arrays of a points coordinates in a segment
            var segmentArray;
            // In the case that only subsegments should be shown, add only subsegments to the array
            if(subsOnly && item.On_Alasegmentti === null) {
              segmentArray = [];
            } else {
              segmentArray = [];
              item.Points.forEach(data => {
                segmentArray.push([data.lng, data.lat]);
              });
            }
          
            // Piirretään segmentit monikulmioina
            return (
              <Box key={item.ID}>
                <MapLayer
                  id={"fill-area-" + item.ID}
                  source={"fill-source-" + item.ID}
                  type="fill"
                  paint={{
                    "fill-color": drawColor,
                    "fill-opacity": drawOpacity,
                  }}
                  onClick={() => updateChosen(item)}
                  onMouseOver={() => updateMouseover(item.ID, item.Nimi)}
                  onMouseOut={() => handleMouseout()}
                >
                  <MapSource
                    id={"fill-source-" + item.ID}
                    type="geojson"
                    data={{
                      "type":"Polygon",
                      "coordinates":[segmentArray, []]
                    }}
                  ></MapSource>
                </MapLayer>
                <MapLayer
                  id={"line-area-" + item.ID}
                  source={"line-source-" + item.ID}
                  type="line"
                  paint={{
                    "line-color": drawColor,
                    "line-width": 1.5,
                  }}
                >
                  <MapSource
                    id={"line-source-" + item.ID}
                    type="geojson"
                    data={{
                      "type":"Polygon",
                      "coordinates":[segmentArray]
                    }}
                  ></MapSource>
                </MapLayer>
              </Box>
            );
          })
        }
      </NewMap> 
    </div>
  );
}

export default Map;