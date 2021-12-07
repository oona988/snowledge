/**

Element to show short interval and winter weather statistics

Created: Oona Laitamaki

Latest update

28.11.2021 Oona Laitamaki
Create user interface for showing weather statistics on mobile and laptop view

31.10.2021 Oona Laitamaki
Create initial components for showing weather statistics

**/

import * as React from "react";
import { useMediaQuery } from "react-responsive";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import Paper from "@material-ui/core/Paper";
import Carousel from "react-material-ui-carousel";
import {toDegrees, getWindDirection} from "./DataCalculations";


const useStyles = makeStyles(() => ({
  card: {
    paddingLeft: "5%",
    paddingRight: "5%",
    align: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: "10px",
  },
  paper: {
    borderRadius: "10px",
    paddingTop: "1%",
    marginTop: "2%",
    paddingBottom: "1%",
    backgroundColor: "rgba(255,255,255,0.7)",
    marginLeft: "10%",
    marginRight: "10%",
  },
  paperHeader: {
    fontFamily: "Donau",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: 600,
    display: "block",
    fontSize: "2.5vh",
  },
  cardHeader: {
    fontFamily: "Donau",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: 600,
    display: "block",
    fontSize: "large",
  },
  text: {
    fontFamily: "Donau",
    letterSpacing: 2,
    fontWeight: 600,
    display: "block",
    fontSize: "2.2vh",
  },
  divider: {
    border: "thin solid transparent",
    background: "rgba(0, 0, 0, 0.1)",
    height: 0.4,
  },
}));


// Text element for displaying weather statistics key and value
function KeyValuePair({keyName, value}) {
  const classes = useStyles();

  return (
    <p className={classes.text} style={{textAlign: "left", margin: "3px", paddingLeft: "3%"}}>{keyName}
      <span className={classes.text} style={{float: "right", paddingRight: "3%", whiteSpace: "pre"}}>{value}</span>
    </p>
  );
}


// Paper for displaying 3 to 7 days weather statistics
function ShortIntervalStatsPaper({weatherState}) {
  const classes = useStyles();
  const isXS = useMediaQuery({ query: "(max-width: 999px)" });

  return (
    <Paper className={classes.paper} style={isXS ? {minHeight: "550px"} : {minHeight: "95%"}} align="center">

      <h2 className={classes.paperHeader}>Lähipäivien sää</h2>

      {/* Snow depth growth during last seven days */}
      <Card className={classes.card} style={isXS ? {margin: "6%"} : {margin: "3%"}}>
        <p className={classes.cardHeader}>Lumensyvyyden kasvu</p>
        <KeyValuePair keyName="7 vuorokauden aikana" value={weatherState.snowdepth.sevenDaysGrowth + " cm"}/>
      </Card>

      {/* Temperature statistics during last three days */}
      <Card className={classes.card} style={isXS ? {margin: "6%"} : {margin: "3%"}}>
        <p className={classes.cardHeader}>Lämpötila 3 vuorokauden aikana</p>
        <KeyValuePair keyName="korkein" value={weatherState.temperature.threeDaysHighest + " \xB0C"}/>
        <Divider className={classes.divider}/>
        <KeyValuePair keyName="matalin" value={weatherState.temperature.threeDaysLowest + " \xB0C"}/>
        <Divider className={classes.divider}/>
        <KeyValuePair keyName="suojapäivien määrä" value={`${weatherState.temperature.thawDaysOutOfThree} kpl`}/>
        {weatherState.temperature.thawDays.length !== 0 &&
        <div style={{paddingBottom: "50px"}}>
          <Divider className={classes.divider}/>
          <KeyValuePair keyName="suojapäivät" value={weatherState.temperature.thawDays.join("\r\n")}/>
        </div>}
      </Card>

      {/* Wind speed and direction statistics during last three days */}
      <Card className={classes.card} style={isXS ? {margin: "6%"} : {margin: "3%"}}>
        <p className={classes.cardHeader}>Tuuli 3 vuorokauden aikana</p>
        <KeyValuePair keyName="kesk. nopeus" value={weatherState.windspeed.threeDaysAverage.toFixed(1) + " m/s"}/>
        <Divider className={classes.divider}/>
        <KeyValuePair keyName="kesk. suunta" value={getWindDirection(weatherState.winddirection.threeDaysAverage)}/>
        <Divider className={classes.divider}/>
        <KeyValuePair keyName="kovin tuuli" value={weatherState.windspeed.threeDaysHighest + " m/s"}/>
      </Card>

    </Paper>
  );
}


// Paper for displaying winter weather statistics
function WinterStatsPaper({weatherState}) {
  const classes = useStyles();
  const isXS = useMediaQuery({ query: "(max-width: 999px)" });

  return (
    <Paper className={classes.paper} style={isXS ? {minHeight: "550px"} : {minHeight: "95%"}} align="center">

      {weatherState.winter.season === true ?
        <div>

          <h2 className={classes.paperHeader}>Talven säähavainnot</h2>

          {/* Temperature statistics during winter */}
          <Card className={classes.card} style={isXS ? {margin: "6%"} : {margin: "3%"}}>
            <p className={classes.cardHeader}>Lämpötila</p>
            <KeyValuePair keyName="suojapäivät" value={weatherState.winter.thawDays + " kpl"}/>
            <Divider className={classes.divider}/>
            <KeyValuePair keyName="mediaani" value={weatherState.winter.median + " \xB0C"}/>
          </Card>
          
          {/* Wind direction and speed statistics during winter */}
          <Card className={classes.card} style={isXS ? {margin: "6%"} : {margin: "3%"}}>
            <p className={classes.cardHeader}>Tuuli (yli 10 m/s)</p>
            <KeyValuePair keyName="kovin tuuli" value={weatherState.winter.maxWind + " m/s"}/>
            <Divider className={classes.divider}/>
            <KeyValuePair keyName="kesk. suunta" value={getWindDirection((toDegrees(Math.atan2(weatherState.winter.strongWindDirectionY, weatherState.winter.strongWindDirectionX)) + 360) % 360)}/>
            <Divider className={classes.divider}/>
            <KeyValuePair keyName="päivien lkm" value={weatherState.winter.strongWindDays}/>
          </Card>

        </div> :
        <h2 className={classes.cardHeader}>Talven säähavainnot ovat saatavilla talviaikana (2.12.-31.5.)</h2>
      }
    </Paper>
  );
}


// Element for displaying short interval and winter weather statistics
function Statistics({weatherState, handleReturnClick}) {
  const isXS = useMediaQuery({ query: "(max-width: 999px)" });

  return (
    <div>
      {isXS ?
        <div>
          <Carousel
            autoPlay={false}
            animation="slide"
            cycleNavigation={false}
            navButtonsAlwaysVisible={true}
            fullHeightHover={false}
            indicators={false}
            showThumbs={false}
            showArrows={false}
            NextIcon={<NavigateNextIcon style={{fontSize: "40px"}}/>}
            PrevIcon={<NavigateBeforeIcon style={{fontSize: "40px"}}/>}
            navButtonsProps={{
              style: {
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: "5px",
                borderRadius: 50,
                color: "black",
              }
            }}
          >
            <ShortIntervalStatsPaper weatherState={weatherState}/>
            <WinterStatsPaper weatherState={weatherState}/>
          </Carousel>
          <Button
            onClick={handleReturnClick}
            variant="contained"
            style={{
              backgroundColor: "rgba(255,255,255,0.6)",
              position: "absolute",
              right: 5,
              top: 450,
              borderRadius: "100%",
              padding: "15px"}}
          >
            <NavigateBeforeIcon style={{fontSize: "5vh"}}/>
          </Button>
        </div> : 
        <Grid item xs={12} sm={12} container style={{padding: "20px", position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
          <Grid item xs={6} sm={6}>
            <ShortIntervalStatsPaper weatherState={weatherState}/>
          </Grid>
          <Grid item xs={6} sm={6}>
            <WinterStatsPaper weatherState={weatherState}/>
          </Grid>
          <Grid item xs={12} sm={12} container style={{justifyContent: "end", paddingTop: "2%", paddingBottom: "5%", paddingRight: "8%"}}>
            <Button
              onClick={handleReturnClick}
              variant="contained"
              color="inherit"
              style={{
                backgroundColor: "rgba(255,255,255,0.6)",
                borderColor: "transparent",
                fontFamily: "Donau",
                textTransform: "unset",
                fontSize: "3vh"}}
              startIcon={<NavigateBeforeIcon/>}
            >
              Takaisin
            </Button>
          </Grid>
        </Grid>
      }
    </div>
  );
}
 
export default Statistics;