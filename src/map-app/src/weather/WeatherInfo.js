/**
Element to show weather data during past three days (wheel of weather)

Created: Oona Laitamaki

Latest update

31.10.2021 Oona Laitamaki
Create initial components for showing weather statistics

**/

import * as React from "react";
import { useMediaQuery } from "react-responsive";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {getWindDirection} from "./DataCalculations";
import { Typography } from "@material-ui/core";
 

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
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: "10px",
  },
  paper: {
    borderRadius: "10px",
    paddingTop: "1%",
    marginTop: "4%",
    paddingBottom: "1%",
    backgroundColor: "rgba(255,255,255,0.7)",
    minHeight: "600px",
    alignContent: "center"
    //width: "80%",
    //maxWidth: "500px",
    //margin: 0,
    //msTransform: "translate(0%, 0%)",
    //transform: "translate(0%, 0%)",
    //left: "50%",
  },
  grid: {
    justifyContent: "center"
  },
  paperHeader: {
    fontFamily: "Donau",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: 600,
    display: "block",
    fontSize: "4vh",
  },
  cardHeader: {
    fontFamily: "Donau",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: 600,
    display: "block",
    fontSize: "3vh",
    textAlign: "left",
  },
  text: {
    fontFamily: "Donau",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: 600,
    display: "block",
    fontSize: "large",
    textAlign: "left",
    paddingLeft: "20px",
  },
  subText: {
    fontFamily: "Donau",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: 400,
    display: "block",
    fontSize: "medium",
    textAlign: "left",
    paddingLeft: "20px",
  },
}));


function WeatherInfo({weatherState}) {
  console.log(weatherState);
  
  const classes = useStyles();
  const isXS = useMediaQuery({ query: "(max-width: 1200px)" });

  return (
    <Carousel responsive={responsive} swipeable={true} draggable={true} showDots={true} autoPlay={false} navButtonsAlwaysVisible="true" center={true} infinite={true}>

      <Paper style={isXS ? {marginLeft: "5%", marginRight: "5%"} : {marginLeft: "20%", marginRight: "20%"}} className={classes.paper} align="center">

        <h2 className={classes.paperHeader}>Pallas</h2>

        <Grid item xs={12} sm={12} container className={classes.grid}>

          <Grid item xs={8} sm={8}>
            <Typography className={classes.cardHeader}>Lumen syvyys</Typography>
          </Grid>
          <Grid item xs={12} sm={12} container className={classes.grid}>
            <Grid item xs={2} sm={2}>
              <CardMedia
                component={"img"}
                style={{fill: "#FFFFFF"}}
                src={process.env.PUBLIC_URL + "/icons/weather/snowflake1.svg"}
                alt="lumityypin logo"
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Typography className={classes.text}>{`${weatherState.snowdepth.thirdDay} cm`}</Typography>
            </Grid>
          </Grid>

          <Grid item xs={8} sm={8}>
            <Typography className={classes.cardHeader}>Lämpötila</Typography>
          </Grid>
          <Grid item xs={12} sm={12} container className={classes.grid}>
            <Grid item xs={2} sm={2}>
              <CardMedia
                component={"img"}
                style={{fill: "#FFFFFF"}}
                src={process.env.PUBLIC_URL + "/icons/weather/snowflake1.svg"}
                alt="lumityypin logo"
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Typography style={{whiteSpace: "pre"}} className={classes.text}>{`${weatherState.temperature.current} \xB0C`}</Typography>
            </Grid>
          </Grid>

          <Grid item xs={8} sm={8}>
            <Typography className={classes.cardHeader}>Tuuli</Typography>
          </Grid>
          <Grid item xs={12} sm={12} container className={classes.grid}>
            <Grid item xs={2} sm={2}>
              <CardMedia
                component={"img"}
                style={{fill: "#FFFFFF"}}
                src={process.env.PUBLIC_URL + "/icons/weather/snowflake1.svg"}
                alt="lumityypin logo"
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Typography className={classes.text}>{`${weatherState.windspeed.current} m/s`}</Typography>
              <Typography className={classes.subText}>{getWindDirection(weatherState.winddirection.current)}</Typography>
            </Grid>
          </Grid>
          
          <Grid item xs={8} sm={8}>
            <Typography className={classes.cardHeader}>Ilmanpaine</Typography>
          </Grid>
          <Grid item xs={12} sm={12} container className={classes.grid}>
            <Grid item xs={2} sm={2}>
              <CardMedia
                component={"img"}
                style={{fill: "#FFFFFF"}}
                src={process.env.PUBLIC_URL + "/icons/weather/snowflake1.svg"}
                alt="lumityypin logo"
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Typography className={classes.text}>{`${weatherState.airpressure.current} mBar`}</Typography>
              <Typography className={classes.subText}>{weatherState.airpressure.direction}</Typography>
            </Grid>
          </Grid>

        </Grid>

      </Paper>

    </Carousel>
  );
}
 
export default WeatherInfo;