/**

Lumitiedot esittävä komponentti

Luonut: Markku Nirkkonen

Päivityshistoria

18.10.2021
Siirretty Info.js tiedostosta erilliseen komponenttiin

**/

import * as React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
  dangerImage: {
    verticalAlign: "middle",
    padding: "5px",
  },
  root: {
    flexGrow: 1,
  },
  avalanche: {
    whiteSpace: "nowrap",
  },
  textBox: {
    margin: "auto",
  },
  mainSnowInfo: {
    padding: theme.spacing(3),
    display: "inline-block",
  },
  snowTypes: {
    padding: theme.spacing(3),
    display: "inline-block",
  },
  snowInfoTexts: {
    maxWidth: 300,
    color: "black",
    padding: theme.spacing(3),
    display: "inline",
  },
  typographyMargin: {
    margin: "5px",
  }
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
      dangerimage = <img className={classes.dangerImage} src={process.env.PUBLIC_URL + "/lumilogot/!.png"} alt="lumivyöryvaaran logo"/>;
      dangertext = <Typography variant="subtitle1" color="error" display="inline">Lumivyöryherkkä alue, tarkista lumivyörytilanne!</Typography>;
    } else {
      dangerimage = <div />;
      dangertext = null;
    }
  }

  return (
    <Grid container className={classes.root} direction={"row"} spacing={2}>
      {/* Segmentin nimi*/}
      <Grid item xs={10}>
        <Typography variant="h5" align="center" component="p">
          {segmentdata === null ? "Ei nimitietoa" : segmentdata.Nimi}
        </Typography>
      </Grid>

      {/* Lumivyöryvaarasta kertova teksti, mikäli kyseessä lumivyöryherkkä segmentti */}
      <Grid item xs={10} align="center" className={classes.avalanche}>
        {/* Lumivyöryvaarasta ilmoitetaan logolla */}
        {segmentdata === null ? null : dangertext}
        {segmentdata === null ? null : dangerimage}
      </Grid>

      {/* Pohjamaasto, kommentoi näkyviin jos halutaan näyttää */}
      {/* <Typography variant="subtitle1" className={classes.snowInfoTexts} align="center" component="p">
          {segmentdata === null ? "Ei tietoa pohjamaastosta" : segmentdata.Maasto}
      </Typography> */}

      
      <Grid item xs={5}>
        <Box margin="10px">
          {/* Segmentin logon tulee olla nimetty segmentin ID:n kanssa yhtenevästi */}
          {segmentdata.update === null || segmentdata.update === undefined ? <div /> : <img src={process.env.PUBLIC_URL + "/lumilogot/" + segmentdata.update.Lumi.ID + ".png"} alt="lumityypin logo"/>}
          
          <Typography variant="body1" className={classes.snowInfoTexts} component="p">
            {segmentdata.update === null || segmentdata.update === undefined ? "Ei tietoa" : segmentdata.update.Lumi.Nimi}
          </Typography>
        </Box>
      </Grid>


      {/* Alalumityypit */}
      <Grid item xs container direction="column" spacing={1}>
        <Grid item xs={13}>
          <Typography variant="h6" className={classes.snowInfoTexts} align="center" component="p">Alatyypit</Typography>
        </Grid>
        {/* TODO: Add loop for sub snowtypes */}
        <Grid item xs container direction="row" spacing={2}>
          <Grid item xs={6}>
            {segmentdata.update === null || segmentdata.update === undefined ? <div /> : <img src={process.env.PUBLIC_URL + "/lumilogot/" + segmentdata.update.Lumi.ID + ".png"} alt="lumityypin logo"/>}
            <Typography variant="body1" className={classes.snowInfoTexts} align="center" component="p">
              {segmentdata.update === null || segmentdata.update === undefined ? "" : segmentdata.update.Lumi.Nimi}
            </Typography>
          </Grid >
          <Grid item xs={6}>
            {segmentdata.update === null || segmentdata.update === undefined ? <div /> : <img src={process.env.PUBLIC_URL + "/lumilogot/" + segmentdata.update.Lumi.ID + ".png"} alt="lumityypin logo"/>}
            <Typography variant="body1" className={classes.snowInfoTexts} align="center" component="p">
              {segmentdata.update === null || segmentdata.update === undefined ? "" : segmentdata.update.Lumi.Nimi}
            </Typography>
          </Grid >
        </Grid>
      </Grid>

      <Grid container display="inline-block">
        <Grid item xs={6} align="center">
          <Typography variant="caption" component="p">
            {segmentdata.update === null || segmentdata.update === undefined ? "" : updateInfo}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body2" component="p">
            {segmentdata.update === null || segmentdata.update === undefined ? "Ei kuvausta" : segmentdata.update.Teksti}
          </Typography>
        </Grid>
      </Grid >
    </Grid>
  );
}

export default SnowRecordView;