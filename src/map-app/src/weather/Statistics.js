/**
Element to show long term and average weather statistics

Created: Oona Laitamaki

Latest update

31.10.2021 Oona Laitamaki
Show weather statistics in carousel element

31.10.2021 Oona Laitamaki
Create initial components for showing weather statistics

**/

import * as React from "react";
import { useMediaQuery } from "react-responsive";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {toDegrees, getWindDirection} from "./DataCalculations";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
    partialVisibilityGutter: 10,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    partialVisibilityGutter: 10,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    partialVisibilityGutter: 10,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    partialVisibilityGutter: 10,
  }
};

const useStyles = makeStyles(() => ({
  card: {
    paddingLeft: "5%",
    paddingRight: "5%",
    margin: "5%",
    align: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: "10px",
  },
  paper: {
    borderRadius: "10px",
    paddingTop: "1%",
    marginTop: "4%",
    paddingBottom: "1%",
    backgroundColor: "rgba(255,255,255,0.6)",
    minHeight: "600px",
    //width: "80%",
    //maxWidth: "500px",
    //margin: 0,
    //msTransform: "translate(0%, 0%)",
    //transform: "translate(0%, 0%)",
    //left: "50%",
  },
  paperHeader: {
    fontFamily: "Donau",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: 600,
    display: "block",
    fontSize: "large",
  },
  cardHeader: {
    fontFamily: "Donau",
    letterSpacing: 2,
    fontWeight: 600,
    display: "block",
    fontSize: "large",
  },
  text: {
    fontFamily: "Donau",
    letterSpacing: 2,
    fontWeight: 400,
    display: "block",
    fontSize: "medium",
  },
}));

function KeyValuePair({keyName, value}) {
  const classes = useStyles();

  return (
    <p className={classes.text} style={{textAlign: "left", paddingLeft: "3%"}}>{keyName}
      <span className={classes.text} style={{float: "right", paddingRight: "3%"}}>{value}</span>
    </p>
  );
}

function Item(props) {
  const classes = useStyles();
  const isXS = useMediaQuery({ query: "(max-width: 599px)" });

  if (props.item.name === "Lähipäivien sää") {
    return (
      <Paper style={isXS ? {marginLeft: "5%", marginRight: "5%"} : {marginLeft: "20%", marginRight: "20%"}} className={classes.paper} align="center">
        <h2 className={classes.paperHeader}>{props.item.name}</h2>

        <Card className={classes.card}>
          <p className={classes.cardHeader}>Lumensyvyyden kasvu</p>
          <KeyValuePair keyName="7 vuorokauden aikana" value={props.weatherState.snowdepth.sevenDaysGrowth + " cm"}/>
        </Card>
        <Card className={classes.card}>
          <p className={classes.cardHeader}>Lämpötila 3 vuorokauden aikana</p>
          <KeyValuePair keyName="korkein" value={props.weatherState.temperature.threeDaysHighest + " \xB0C"}/>
          <Divider/>
          <KeyValuePair keyName="matalin" value={props.weatherState.temperature.threeDaysLowest + " \xB0C"}/>
          <Divider/>
          <KeyValuePair keyName="suojapäivät" value={props.weatherState.temperature.thawDaysOutOfThree + " kpl"}/>
          {props.weatherState.temperature.thawDays.map(day =>
            (<p className={classes.text} key={day}>{day}</p>)
          )}
        </Card>
        <Card className={classes.card}>
          <p className={classes.cardHeader}>Tuuli 3 vuorokauden aikana</p>
          <KeyValuePair keyName="kesk. nopeus" value={props.weatherState.windspeed.threeDaysAverage.toFixed(1) + " m/s"}/>
          <Divider/>
          <KeyValuePair keyName="kesk. suunta" value={getWindDirection(props.weatherState.winddirection.threeDaysAverage)}/>
          <Divider/>
          <KeyValuePair keyName="kovin tuuli" value={props.weatherState.windspeed.threeDaysHighest + " m/s"}/>
        </Card>
      </Paper>
    );
  } else if (props.item.name === "Talven säähavainnot") {
    return (
      <Paper style={isXS ? {marginLeft: "5%", marginRight: "5%"} : {marginLeft: "20%", marginRight: "20%"}} className={classes.paper} align="center">

        {props.weatherState.winter.season === true ?
          <div>
            <h2 className={classes.paperHeader}>{props.item.name}</h2>

            <Card className={classes.card}>
              <p className={classes.cardHeader}>Lämpötila</p>
              <KeyValuePair keyName="suojapäivät" value={props.weatherState.winter.thawDays + " kpl"}/>
              <Divider/>
              <KeyValuePair keyName="mediaani" value={props.weatherState.winter.median + " \xB0C"}/>
            </Card>
            <Card className={classes.card}>
              <p className={classes.cardHeader}>Tuuli (yli 10 m/s)</p>
              <KeyValuePair keyName="kovin tuuli" value={props.weatherState.winter.maxWind + " m/s"}/>
              <Divider/>
              <KeyValuePair keyName="kesk. suunta" value={getWindDirection((toDegrees(Math.atan2(props.weatherState.winter.strongWindDirectionY, props.weatherState.winter.strongWindDirectionX)) + 360) % 360)}/>
              <Divider/>
              <KeyValuePair keyName="päivien lkm" value={props.weatherState.winter.strongWindDays}/>
            </Card>
          </div> :
          <h2 className={classes.cardHeader}>Talven säähavainnot ovat saatavilla talviaikana (2.12.-31.5.)</h2>
        }

      </Paper>
    );
  } else {
    return (
      <div></div>
    );
  }
}

function Statistics({weatherState}) {

  //const isXS = useMediaQuery({ query: "(max-width: 1200px)" });

  var items = [
    {
      name: "Lähipäivien sää"
    },
    {
      name: "Talven säähavainnot"
    }
  ];

  return (
    <Carousel responsive={responsive} swipeable={true} draggable={true} showDots={true} autoPlay={false} navButtonsAlwaysVisible="true" center={true} infinite={true}>
      <Item align="center" key={0} item={items[0]} weatherState={weatherState}/>
      <Item align="center" key={1} item={items[1]} weatherState={weatherState}/>
    </Carousel>
  );
}
 
export default Statistics;