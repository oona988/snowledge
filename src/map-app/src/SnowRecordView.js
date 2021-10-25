/**

Lumitiedot esittävä komponentti

Luonut: Markku Nirkkonen

Päivityshistoria

18.10.2021
Siirretty Info.js tiedostosta erilliseen komponenttiin
Moved here from Info.js

23.10.2021 Oona Laitamäki
Muokattu näkymän ulkoasua sekä lisätty suhteellinen aikaleima, hiihdettävyys-elementit ja alalumityypit
Changed layout design & added relative timestamp, skiability elements and sub snowtypes

**/

import * as React from "react";
import { useMediaQuery } from "react-responsive";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/500.css";


const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    padding: "15px",
  },
  snowInfo: {
    alignContent: "center",
  },
  bigHeaders: {
    fontFamily: "Segoe UI",
    fontWeight: 500,
    display: "block",
  },
  smallHeaders: {
    fontFamily: "Roboto",
    fontWeight: 500,
    display: "block",
    fontSize: "medium",
  },
  normalText: {
    fontFamily: "Roboto",
    fontWeight: 300,
    fontSize: "small",
  },
  dangerIcon: {
    verticalAlign: "middle",
    maxWidth: "8%",
  },
  skiabilityIcon: {
    height: "15px",
    width: "45%",
    display: "block",
    paddingTop: "2%"
  },
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

function SnowRecordView({segmentdata}) {
  const classes = useStyles();

  // 0px  XS  600px  SM  900px  MD
  const isXS = useMediaQuery({ query: "(max-width: 599px)" });
  const isSM = useMediaQuery({ query: "(min-width: 600px) and (max-width: 900px)" });

  const [ expanded, setExpanded ] = React.useState(isXS ? false : true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  var updateInfo = "";

  // Parsitaan päivämäärä ja aika päivityksestä, mikäli päivitys löytyy
  if (segmentdata.update !== null && segmentdata.update !== undefined) {
    // Datasta saadaan viimeisin päivitysaika
    let latestUpdateTime = new Date(segmentdata.update.Aika);
    let currentTime = new Date();
    updateInfo = `Viimeksi päivitetty: ${getRelativeTimestamp(currentTime, latestUpdateTime)}`;
  }

  var dangerimage;
  var dangertext;

  // Alustetaan komponentit, mikäli valitulla segmentillä on lumivyöryvaara
  if (segmentdata !== null) {
    if (segmentdata.Lumivyöryvaara) {
      // Lumivyöryvaaran merkin tiedostonimi on !.png
      dangerimage = <img className={classes.dangerIcon} src={process.env.PUBLIC_URL + "/icons/avalanche.svg"} alt="lumivyöryvaaran logo"/>;
      dangertext = <Typography className={classes.normalText} variant="subtitle1" color="error" display="inline">Lumivyöryherkkä alue, tarkista lumivyörytilanne!</Typography>;
    } else {
      dangerimage = <div />;
      dangertext = null;
    }
  }

  return (
    <Grid container className={classes.root}>
      {/* Segmentin nimi*/}
      <Grid item xs={12} sm={12}>
        <Typography className={classes.bigHeaders} variant="h5" align="center" component="p">
          {segmentdata === null ? "Ei nimitietoa" : segmentdata.Nimi}
        </Typography>
      </Grid>

      {/* Lumivyöryvaarasta kertova teksti ja ikoni, mikäli kyseessä lumivyöryherkkä segmentti */}
      <Grid item xs={12} sm={12} align="center">
        {segmentdata === null ? null : dangertext}
        {segmentdata === null ? null : dangerimage}
      </Grid>

      {/* Description of segment, this might be changed later */}
      {!isXS && <Grid item xs={12} sm={12} align="center">
        <Typography className={classes.normalText} variant="subtitle1">
          {/*segmentdata.update === null || segmentdata.update === undefined ? "Ei kuvausta" : segmentdata.update.Teksti*/}
          Description about skiability or segment information here if needed
        </Typography>
      </Grid>}

      {/* Pohjamaasto, kommentoi näkyviin jos halutaan näyttää */}
      {/* <Typography variant="subtitle1" align="center" component="p">
          {segmentdata === null ? "Ei tietoa pohjamaastosta" : segmentdata.Maasto}
      </Typography> */}
    
      {/* Main snowtype info */}
      <Grid item xs={12} sm={5} container className={classes.snowInfo}>
        <Grid item xs={4} sm={3}>
          {/* Segmentin logon tulee olla nimetty segmentin ID:n kanssa yhtenevästi */}
          {/*segmentdata.update === null || segmentdata.update === undefined ? <div /> :*/ 
            <CardMedia
              component={"img"}
              src={process.env.PUBLIC_URL + "/icons/snowtypes-and-harms/uusi.svg"}
              alt="lumityypin logo"
            />
          }
        </Grid>
        <Grid item container xs={8} sm={9} className={classes.snowInfo}>
          <Grid item xs={12} sm={12}>
            <Typography className={classes.smallHeaders} variant="body1" component="p">
              {/*segmentdata.update === null || segmentdata.update === undefined ? "Ei tietoa" : segmentdata.update.Lumi.Nimi*/}
              {isXS ? "Uusi lumi, katso alatyypit" : "Uusi lumi"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography xs={12} sm={12} className={classes.normalText} variant="body2" component="p">
              Keskimääräinen hiihdettävyys:
              <img className={classes.skiabilityIcon} src={process.env.PUBLIC_URL + "/icons/skiability/5.svg"} alt="skiability"/>
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {/* Info about latest update time */}
      {isXS &&
        <Grid item xs={12} sm={12} container>
          <Grid item xs={12} sm={5}>
            <Typography className={classes.normalText} align="left" variant="body2" component="p">
              {segmentdata.update === null || segmentdata.update === undefined ? "" : updateInfo}
            </Typography>
          </Grid>
        </Grid >
      }
      
      <Grid item xs={12} sm={7}>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {isXS &&
            <Grid item xs={12}>
              <CardMedia
                component={"img"}
                style={{height: 30, width: "100%"}}
                src={`${process.env.PUBLIC_URL}/icons/dividers/right_down.svg`}
                alt="divider"
              />
            </Grid>
          }

          {/* Description of segment, this might be changed later */}
          {isXS && <Grid item xs={12}>
            <Typography className={classes.normalText} variant="subtitle2">
              {/*segmentdata.update === null || segmentdata.update === undefined ? "Ei kuvausta" : segmentdata.update.Teksti*/}
              Description about skiability or segment information here if needed
            </Typography>
          </Grid>}
          
          <Grid item xs={12} sm={12} container>
            <Grid item xs={2} sm={2}>
              <Typography className={classes.bigHeaders} variant="body1" component="p" display="inline" align="right">Alatyypit</Typography>
            </Grid>
            {!isXS &&
              <Grid item sm={8}>
                <CardMedia
                  component={"img"}
                  style={isSM ? {height: 30, width: "100%", borderLeft: "100px", paddingLeft: "3%"} : {height: 30, width: "100%", paddingLeft: "2%"}}
                  src={`${process.env.PUBLIC_URL}/icons/dividers/right_up.svg`}
                  alt="divider"
                />
              </Grid>}
            {/* Sub snowtypes */}
            {/* TODO: Add loop for sub snowtypes */}
            <Grid item xs={12} sm={6} container>
              <Grid item xs={3} sm={3}>
                {/*segmentdata.update === null || segmentdata.update === undefined ? <div /> : */
                  <CardMedia
                    component={"img"}
                    src={process.env.PUBLIC_URL + "/icons/snowtypes-and-harms/uusi_viti.svg"}
                    alt="lumityypin logo"
                  />
                }
              </Grid>
              <Grid item container xs={9} sm={9} className={classes.snowInfo}>
                <Grid item xs={12} sm={12}>
                  <Typography className={classes.smallHeaders} variant="body1" component="p">
                    {/*segmentdata.update === null || segmentdata.update === undefined ? "Ei tietoa" : segmentdata.update.Lumi.Nimi*/}
                    Vitilumi
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography xs={12} sm={12} className={classes.normalText} variant="body2" component="p">
                    Hiihdettävyys:
                    <img className={classes.skiabilityIcon} src={process.env.PUBLIC_URL + "/icons/skiability/5.svg"} alt="skiability"/>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} container>
              <Grid item xs={3} sm={3}>
                {/*segmentdata.update === null || segmentdata.update === undefined ? <div /> : */
                  <CardMedia
                    component={"img"}
                    src={process.env.PUBLIC_URL + "/icons/snowtypes-and-harms/kantoja.svg"}
                    alt="lumityypin logo"
                  />
                }
              </Grid>
              <Grid item container xs={9} sm={9} md={9} className={classes.snowInfo}>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography className={classes.smallHeaders} variant="body1" component="p">
                    Kantoja
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {isXS &&
            <Grid item xs={12}>
              <CardMedia
                component={"img"}
                style={{height: 30, width: "100%"}}
                src={`${process.env.PUBLIC_URL}/icons/dividers/right_down.svg`}
                alt="divider"
              />
            </Grid>
          }
        </Collapse>
      </Grid>

      {/* Info about latest update time */}
      {!isXS &&
        <Grid item sm={12} container>
          <Grid item sm={5}>
            <Typography className={classes.normalText} align="center" variant="body2" component="p">
              {segmentdata.update === null || segmentdata.update === undefined ? "" : updateInfo}
            </Typography>
          </Grid>
        </Grid >
      }

      {isXS &&
        <Grid item xs={12} align="center">
          <IconButton
            style={{padding: 0}}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <img src={`${process.env.PUBLIC_URL}/icons/expand.svg`} width="30%" height="14px" alt="expand"></img>
          </IconButton>
        </Grid>
      }
    </Grid>
  );
}

export default SnowRecordView;
