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
import Paper from "@material-ui/core/Paper";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {toDegrees} from "./DataCalculations";

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
    partialVisibilityGutter: 30,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    partialVisibilityGutter: 30,
  }
};


const useStyles = makeStyles(() => ({
  card: {
    paddingLeft: "5%",
    paddingRight: "5%",
    margin: "5%",
    align: "center",
  },
}));

function KeyValuePair({keyName, value}) {
  return (
    <p style={{textAlign: "left"}}>{keyName}
      <span style={{float: "right"}}>{value}</span>
    </p>
  );
}

function Item(props) {
  const classes = useStyles();
  const isXS = useMediaQuery({ query: "(max-width: 599px)" });

  if (props.item.name === "Lähipäivien sää") {
    return (
      <Paper style={isXS ? {marginLeft: "5%", marginRight: "5%", paddingTop: "1%", paddingBottom: "1%"} : {marginLeft: "20%", marginRight: "20%", paddingTop: "1%", paddingBottom: "1%"}} align="center">
        <h2>{props.item.name}</h2>

        <Card className={classes.card}>
          <p>Lumensyvyyden kasvu</p>
          <KeyValuePair keyName="7 vuorokauden aikana" value={props.weatherState.snowdepth.sevenDaysGrowth}/>
        </Card>
        <Card className={classes.card}>
          <p>Lämpötila</p>
          <KeyValuePair keyName="korkein" value={props.weatherState.temperature.threeDaysHighest}/>
          <KeyValuePair keyName="matalin" value={props.weatherState.temperature.threeDaysLowest}/>
          <KeyValuePair keyName="suojapäivät" value={props.weatherState.temperature.thawDaysOutOfThree}/>
        </Card>
        <Card className={classes.card}>
          <p>Tuuli</p>
          <KeyValuePair keyName="kesk. nopeus" value={props.weatherState.windspeed.threeDaysAverage}/>
          <KeyValuePair keyName="kesk. suunta" value={props.weatherState.winddirection.threeDaysAverage}/>
          <KeyValuePair keyName="kovin tuuli" value={props.weatherState.windspeed.threeDaysHighest}/>
        </Card>
      </Paper>
    );
  } else if (props.item.name === "Talven säähavainnot") {
    return (
      <Paper style={isXS ? {marginLeft: "5%", marginRight: "5%", paddingTop: "1%", paddingBottom: "1%"} : {marginLeft: "20%", marginRight: "20%", paddingTop: "1%", paddingBottom: "1%"}} align="center">
        <h2>{props.item.name}</h2>

        <Card className={classes.card}>
          <p>Lämpötila</p>
          <KeyValuePair keyName="suojapäivät" value={props.weatherState.winter.thawDays}/>
          <KeyValuePair keyName="mediaani" value={props.weatherState.winter.median}/>
        </Card>
        <Card className={classes.card}>
          <p>Tuuli (yli 10 m/s)</p>
          <KeyValuePair keyName="kovin tuuli" value={props.weatherState.winter.maxWind}/>
          <KeyValuePair keyName="kesk. suunta" value={toDegrees(Math.atan2(props.weatherState.winter.strongWindDirectionY, props.weatherState.winter.strongWindDirectionX))}/>
          <KeyValuePair keyName="päivien lkm" value={props.weatherState.winter.strongWindDays}/>
        </Card>

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
    <Carousel responsive={responsive} swipeable={true} draggable={true} showDots={true} autoPlay={false} navButtonsAlwaysVisible="true" partialVisible={true}>
      <Item key={0} item={items[0]} weatherState={weatherState}/>
      <Item key={1} item={items[1]} weatherState={weatherState}/>
    </Carousel>
  );
}
 
export default Statistics;