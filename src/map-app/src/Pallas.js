/**
Pää javascript react appiin

Luonut: Markku Nirkkonen

Päivityshistoria

29.12.2020 Lisätty kirjautuneen käyttäjän tietojen tallentamiseen liittyviä toimintoja

11.12. Lisättiin lumilaadun ja alasegmentin tiedot hakujen parsimiseen

Markku Nirkkonen 26.11.2020
Hallintanäkymän komponentti lisätty

Arttu Lakkala 15.11 Lisätty päivityksen lisäys segmenttiin.

**/

import * as React from "react";
import { useEffect } from "react";
import "./App.css";
import "./style.css";
import Map from "./NewMap";
import Manage from "./Manage";
import Info from "./Info";
import TopBar from "./TopBar";
import WeatherTab from "./weather/WeatherTab";
import { useMediaQuery } from "react-responsive";

var refreshInterval = setInterval(window.location.reload.bind(window.location), (30*60000));

function App() {

  // Use state hookit
  const [token, setToken] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [segments, setSegments] = React.useState([]);
  const [segmentColors, setSegmentColors] = React.useState(null);
  const [woodsSegment, setWoodsSegment] = React.useState(null);
  const [shownSegment, setShownSegment] = React.useState(null);
  const [viewManagement, setViewManagement] = React.useState(false);

  //imported hook. Kysely näyttöportin koosta
  const isMobile = useMediaQuery({query: "(max-width:760px)"});
  
  // Valikoissa näkyvä teksti riippuu näytettävästä tilasta
  const manageOrMap = (viewManagement ? "Kartta" : "Hallitse");

  // const styledClasses = useStyles();
  
  //timeout for refreshing every 5 min
  /*
   * Haetaan renderöinnin jälkeen aina tiedot lumilaaduista, päivityksistä ja segmenteistä
   * Tallennetaan ne hookkeihin
   *
   */
  useEffect(() => {
    const fetchData = async () => {
      const snow = await fetch("api/lumilaadut");
      const snowdata = await snow.json();
      const updates = await fetch("api/segments/update");
      const updateData = await updates.json();
      const response = await fetch("api/segments");
      const data = await response.json();

      // Taulukko käytettäville väreille kartassa. Musta väri oletuksena, jos tietoa ei ole
      // Muut värit suoraan kannasta. Taulukko on olennainen NewMap.js:n toiminnan kannalta (kartan värit)
      // emptyColor.name kirjoitusmuoto on olennainen myös NewMap.js:n updateHighlighted -funktiossa
      // Mikäli muutetaan, muutettava myös siellä.
      const emptyColor = [{color: "#000000", name: "Ei tietoa"}];
      const snowcolors = snowdata.map((item) => {
        return {color: item.Vari, name: item.Nimi};
      });
      // Yhdistetään olemassa olevat värit ja "ei tietoa" (viimeiseksi)
      setSegmentColors(snowcolors.concat(emptyColor));
      
      await updateData.forEach(update => {
        snowdata.forEach(snow => {
          if(snow.ID === update.Lumilaatu_ID){
            update.Lumi = snow;
          }
        });
      });
      
      setWoodsSegment(null);
      data.forEach(segment => {       
        segment.update = null;
        updateData.forEach(update => {
          if (update.Segmentti === segment.ID) {
            segment.update = update;
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
          setWoodsSegment(segment);
        }
      });
      updateSegments(data);
    };
    fetchData();
  }, []);

  /*
   * Event handlerit
   */

  // Segmentin valinta
  function chooseSegment(choice) {
    setShownSegment(choice);
  }

  // Token tallennetaan reactin stateen
  function updateToken(token) {
    if (typeof token !== "undefined"){
      clearInterval(refreshInterval);
    }
    setToken(token);
  }

  // Käyttäjän päivitys (kirjautuneen)
  function updateUser(user) {
    setUser(user);
  }

  // Kaikkien segmenttien päivittäminen
  function updateSegments(data) {
    setSegments(data);
  }

  function updateWoods(data) {
    setWoodsSegment(data);
  }

  // Vaihtaa näkymää hallinnan ja kartan välillä
  function updateView() {
    setViewManagement(!viewManagement);
  }

  // TODO: Komponenttien tyylejä ja asetteluja voi vielä parannella
  return (
    <div className="app">
      {/* Sovelluksen yläpalkki */}
      <div className="top_bar">
        <TopBar 
          isMobile={isMobile} 
          updateUser={updateUser}
          user={user}
          token={token} 
          updateToken={updateToken} 
          updateView={updateView}
          viewManagement={viewManagement} 
          manageOrMap={manageOrMap} 
        />   
      </div>
      {/* Weather tab - this is here temporarily so that component is rendered
      and information fetched when application starts */}
      <div className="weather_tab">
        <WeatherTab/>   
      </div>
      <div className="map_container">
        {/* Hallintanäkymä tai kartta tilanteen mukaan */}
        {
          (
            viewManagement 
              ?
              <Manage 
                segments={segments}
                role={user.Rooli}
                token={token}
                onUpdate={chooseSegment}
                updateSegments={updateSegments}
                shownSegment={shownSegment}
                updateWoods={updateWoods}
              />
              :
              <Map 
                shownSegment={shownSegment}
                segmentColors={segmentColors}
                segments={segments} 
                onClick={chooseSegment} 
                isMobile={isMobile}
                woodsSegment={woodsSegment}
                viewManagement={viewManagement}
              />
          )
        }
      </div>
      {/* <div className="guide"></div> */}
        
      {/* Sovelluksen sivupalkki, jossa näytetään kartalta valitun segmentin tietoja
          Näytetään, kun jokin segmentti valittuna, eikä olla hallintanäkymässä */}
      <div className="segment_info">
        {(shownSegment !== null && !viewManagement ? 
          <Info
            //segments={segments}
            segmentdata={shownSegment} 
            token={token}
            updateSegments={updateSegments}
            onUpdate={chooseSegment}
            onClose={chooseSegment}
            updateWoods={updateWoods}
          />
          :
          <div />
        )} 
      </div>
    </div>
  );
}

export default App;