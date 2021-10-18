/**

Lumitiedot esittävä komponentti

Luonut: Markku Nirkkonen

Päivityshistoria

18.10.2021
Siirretty Info.js tiedostosta erilliseen komponenttiin

**/

import clsx from "clsx";
import * as React from "react";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    padding: "10px",
  },
  dangerImage: {
    verticalAlign: "middle",
  },
  snowInfoTexts: {
    maxWidth: 300,
    color: "black",
  },
  boldedText: {
    fontFamily: "Segoe UI",
    fontWeight: 500,
  },
  normalText: {
    fontFamily: "Segoe UI",
    fontWeight: 300,
  },
  icon: {
    verticalAlign: "middle",
    maxWidth: "100%",
  },
  cardImage: {
    maxHeight: "100px",
  },
  media: {
    height: "100%",
    width: "100%",
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
      dangerimage = <img className={classes.icon} src={process.env.PUBLIC_URL + "/lumilogot/!.png"} alt="lumivyöryvaaran logo"/>;
      dangertext = <Typography className={classes.normalText} variant="subtitle1" color="error" display="inline">Lumivyöryherkkä alue, tarkista lumivyörytilanne!</Typography>;
    } else {
      dangerimage = <div />;
      dangertext = null;
    }
  }

  return (
    <Grid container className={classes.root}>
      {/* Segmentin nimi*/}
      <Grid item xs={12} md={12}>
        <Typography className={classes.boldedText} variant="h5" align="center" component="p">
          {segmentdata === null ? "Ei nimitietoa" : segmentdata.Nimi}
        </Typography>
      </Grid>

      {/* Lumivyöryvaarasta kertova teksti, mikäli kyseessä lumivyöryherkkä segmentti */}
      <Grid item xs={12} md={12} align="center">
        {/* Lumivyöryvaarasta ilmoitetaan logolla */}
        {segmentdata === null ? null : dangertext}
        {segmentdata === null ? null : dangerimage}
      </Grid>

      {/* Pohjamaasto, kommentoi näkyviin jos halutaan näyttää */}
      {/* <Typography variant="subtitle1" className={classes.snowInfoTexts} align="center" component="p">
          {segmentdata === null ? "Ei tietoa pohjamaastosta" : segmentdata.Maasto}
      </Typography> */}

      
      <Grid item xs={12} md={5} container>
        <Grid item xs={6} md={6}>
          {/* Segmentin logon tulee olla nimetty segmentin ID:n kanssa yhtenevästi */}
          {segmentdata.update === null || segmentdata.update === undefined ? <div /> : 
            <CardMedia
              component={"img"}
              className={clsx(classes.media)}
              src={process.env.PUBLIC_URL + "/snowicons/icon_uusi_marka.svg"}
              alt="lumityypin logo"
            />
          }
        </Grid>
        <Grid item xs={6} md={6}>
          <Typography className={classes.boldedText} variant="body1" component="p">
            {segmentdata.update === null || segmentdata.update === undefined ? "Ei tietoa" : segmentdata.update.Lumi.Nimi}
          </Typography>
          <Typography className={classes.normalText} variant="body1" component="p">
            Keskimääräinen hiihdettävyys
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12} md={7} container>
        <Grid item xs={4} md={2}>
          <Typography className={classes.boldedText} variant="subtitle1" component="p" display="inline" align="bottom">Alatyypit</Typography>
        </Grid>
        <Grid item xs={8} md={10}>
          <CardMedia
            component={"img"}
            className={clsx(classes.media)}
            src={`${process.env.PUBLIC_URL}snow-divider.png`}
            alt="divider"
          />
        </Grid>
        {/* Alalumityypit */}
        {/* TODO: Add loop for sub snowtypes */}
        <Grid item xs={12} md={6} container>
          <Grid item xs={6} md={6}>
            {segmentdata.update === null || segmentdata.update === undefined ? <div /> : 
              <CardMedia
                component={"img"}
                className={clsx(classes.media)}
                src={process.env.PUBLIC_URL + "/snowicons/icon_uusi.svg"}
                alt="lumityypin logo"
              />
            }
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography className={classes.boldedText} variant="body1" component="p">
              {segmentdata.update === null || segmentdata.update === undefined ? "" : segmentdata.update.Lumi.Nimi}
            </Typography>
            <Typography className={classes.normalText} variant="body1" component="p">
              Hiihdettävyys
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} container>
          <Grid item xs={6} md={6}>
            {segmentdata.update === null || segmentdata.update === undefined ? <div /> : 
              <CardMedia
                component={"img"}
                className={clsx(classes.media)}
                src={process.env.PUBLIC_URL + "/snowicons/icon_uusi.svg"}
                alt="lumityypin logo"
              />
            }
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography className={classes.boldedText} variant="body1" component="p">
              {segmentdata.update === null || segmentdata.update === undefined ? "" : segmentdata.update.Lumi.Nimi}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={12} container>
        <Grid item xs={6} md={6}>
          <Typography className={classes.normalText} align="center" variant="caption" component="p">
            {segmentdata.update === null || segmentdata.update === undefined ? "" : updateInfo}
          </Typography>
        </Grid>
        <Grid item xs={6} md={6}>
          <Typography className={classes.normalText} variant="body2" component="p">
            {segmentdata.update === null || segmentdata.update === undefined ? "Ei kuvausta" : segmentdata.update.Teksti}
          </Typography>
        </Grid>
      </Grid >
    </Grid>
  );
}

export default SnowRecordView;