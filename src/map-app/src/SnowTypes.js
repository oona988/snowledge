/**
Page for information about snowtypes

Recent changes:

7.12 Emil Calonius
Created component

**/

import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  snowType: {
    display: "flex",
    flexDirection: "column",
    width: "500px",
    paddingBottom: "60px"
  },
  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(50, 76, 109)",
    color: "white",
    height: "10vh",
    position: "fixed",
    top: 0,
    width: "75vw"
  },
  content: {
    paddingTop: "15vh",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  },
  snow: {
    display: "flex"
  },
  avalanche: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "15vh",
    paddingLeft: "50px",
    paddingRight: "50px"
  }
}));

function SnowTypes() {

  const styledClasses = useStyles();
  return(
    <div className={styledClasses.root}>
      <Box className={styledClasses.header}>
        <Typography variant="h3">SELITTEET</Typography>
      </Box>
      <Box className={styledClasses.avalanche}>
        <img src="/icons/avalanche.svg" style={{height: "100px", width: "100px"}}></img>
        <Typography variant="h4">Lumivyöryvaroitus</Typography>
        <Typography>
          Pallaksen lumivyörymaastoja ovat useat kurut kuten Pyhäkuru, Palkaskuru, 
          Rihmakuru sekä yli 25 asteiset jyrkät rinteet Lommoltunturissa, Keimiötunturissa ja Lehmäkerolla. 
          Yksittäisiä pienempiä vyöryjä voi tapahtua myös muualla jyrkkien maastonmuotojen läheisyydessä. 
          Todennäköisyys lumivyöryyn kasvaa säänmuutosten yhteydessä.
        </Typography>
      </Box>
      <Box className={styledClasses.content}>
        <Box className={styledClasses.snowType}>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_uusi.svg" style={{height: "100px", width: "100px"}}></img>
            <Box>   
              <Typography variant="h5">Uusi lumi</Typography>
              <Typography>Vastasatanut pehmeä lumi.</Typography>
              <img src="/icons/skiability/4.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_newSnow_wet.svg" style={{height: "100px", width: "100px"}}></img>
            <Box>  
              <Typography variant="h5">Märkä uusi lumi</Typography>
              <Typography>
                Lunta, josta voit helposti tehdä lumipallon. 
                Märkää lunta muodostuu sateen tapahtuessa lähellä nollaa tai reilusti suojan puolella.
              </Typography>
              <img src="/icons/skiability/4.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_puuteri.svg" style={{height: "100px", width: "100px"}}></img>
            <Box>    
              <Typography variant="h5">Puuterilumi</Typography>
              <Typography>
                Vastasatanutta irtonaista, höyhenenkevyttä ja tiivistymätöntä lunta. 
                Puuterilunta muodostuu yleensä tyynellä ilmalla ja kovalla pakkasella.
              </Typography>
              <img src="/icons/skiability/5.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_uusi_viti.svg" style={{height: "100px", width: "100px"}}></img>
            <Box>  
              <Typography variant="h5">Vitilumi</Typography>
              <Typography>Vastasatanutta, kevyttä, pehmeää ja hieman tiivistyvää pakkaslunta.</Typography>
              <img src="/icons/skiability/5.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
        </Box>
        <Box className={styledClasses.snowType}>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_korppu.svg" style={{height: "100px", width: "100px"}}></img>
            <Box> 
              <Typography variant="h5">Korppu</Typography>
              <Typography>Kova hangen pinnalla oleva kansi. Korppu voi olla luonteeltaan tasaista tai rosoista.</Typography>
              <img src="/icons/skiability/3.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_korppu_kantava.svg" style={{height: "100px", width: "100px"}}></img>
            <Box> 
              <Typography variant="h5">Kantava korppu</Typography>
              <Typography>Tukeva ja kantava lumikansi, jonka pinta on usein hyvin kovaa ja tiivistä.</Typography>
              <img src="/icons/skiability/3.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_korppu_ohut.svg" style={{height: "100px", width: "100px"}}></img>
            <Box> 
              <Typography variant="h5">Ohut korppu</Typography>
              <Typography>
                Hiihtäjän painosta rikkoutuva lumikansi. 
                Korpun alla lumi voi olla paikoitellen upottavaa. 
              </Typography>
              <img src="/icons/skiability/3.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_korppu_rikkoutuva.svg" style={{height: "100px", width: "100px"}}></img>
            <Box> 
              <Typography variant="h5">Rikkoutuva korppu</Typography>
              <Typography>
                Satunnaisesti kantava, yllättäen rikkoutuva lumen pinta. 
                Kansi voi olla hyvinkin paksu, jos sen alla on huokoista lunta.
              </Typography>
              <img src="/icons/skiability/2.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
        </Box>
        <Box className={styledClasses.snowType}>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/wind_driven_snow.svg" style={{height: "100px", width: "100px"}}></img>
            <Box>  
              <Typography variant="h5">Tuulen pieksemä lumi</Typography>
              <Typography>Tuulen kovettama ja moninpaikoin epätasaiseksi muotoilema lumi.</Typography>
              <img src="/icons/skiability/3.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_tuulenPieksema_aaltoileva.svg" style={{height: "100px", width: "100px"}}></img>
            <Box>
              <Typography variant="h5">Aaltoileva lumi</Typography>
              <Typography>
                Tuulen muotoilema uuden lumen alue. 
                Aallot ovat pehmeitä ja hyvin rikottavissa.
              </Typography>
              <img src="/icons/skiability/4.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_tuulenPieksema_sasturgi.svg" style={{height: "100px", width: "100px"}}></img>
            <Box>  
              <Typography variant="h5">Sasturgi</Typography>
              <Typography>Tuulen aiheuttamaa lumiaallokkoa, joka on kovaa, jäistä ja terväharjanteista. </Typography>
              <img src="/icons/skiability/1.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_tuulenPieksema_tuisku.svg" style={{height: "100px", width: "100px"}}></img>
            <Box >    
              <Typography variant="h5">Tuiskulumi</Typography>
              <Typography>
                Tasainen, tuulen kerrostama ja pakkaama laatta tai linssi. 
                Tuiskulunta voi kertyä myös ilman lumisadetta, jos tuuli siirtää lunta paikasta toiseen. 
                Tuiskulunta syntyy yleensä suojapuolelle.
              </Typography>
              <img src="/icons/skiability/4.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
        </Box>
        <Box className={styledClasses.snowType}>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_jaa.svg" style={{height: "100px", width: "100px"}}></img>
            <Box> 
              <Typography variant="h5">Jää</Typography>
              <Typography>
                Hangen pinnalla oleva kova ja rikkoutumaton jäinen kerros. 
                Jää on syntynyt sulamis-jäätymisreaktion tuloksena.
              </Typography>
              <img src="/icons/skiability/2.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_jaa_rikkoutuva.svg" style={{height: "100px", width: "100px"}}></img>
            <Box> 
              <Typography variant="h5">Rikkoutuva jää</Typography>
              <Typography>Hangen pinnalla oleva kova ja rikkoutuva jäinen kerros.</Typography>
              <img src="/icons/skiability/1.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
        </Box>
        <Box className={styledClasses.snowType}>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_sohjo.svg" style={{height: "100px", width: "100px"}}></img>
            <Box>  
              <Typography variant="h5">Sohjo</Typography>
              <Typography>Vesipitoinen ja osittain sulanut lumi suojasäällä.</Typography>
              <img src="/icons/skiability/2.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_sohjo_kastuva.svg" style={{height: "100px", width: "100px"}}></img>
            <Box>
              <Typography variant="h5">Kastuva lumi</Typography>
              <Typography>Lämpenemisen tai vesisateen myötä pinnalta alkaen märkä tai kostea lumi.</Typography>
              <img src="/icons/skiability/3.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/icon_sohjo_saturoitunut.svg" style={{height: "100px", width: "100px"}}></img>
            <Box>  
              <Typography variant="h5">Saturoitunut lumi</Typography>
              <Typography>Märkä, läpi koko kerroksen sohjoutuva ja kermavaahtomainen lumi.</Typography>
              <img src="/icons/skiability/2.svg" style={{height: "20px", width: "100px"}}></img>
            </Box>
          </Box>
        </Box>
        <Box className={styledClasses.snowType}>
          <Box className={styledClasses.snow}>
            <img src="/lumilogot/Lumetonmaa.svg" style={{height: "100px", width: "100px"}}></img>
            <Box>  
              <Typography variant="h5">Vähäinen lumi</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default SnowTypes;