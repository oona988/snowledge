/**

Element to show weather data during past two days and current weather

Created: Oona Laitamaki

Latest update

28.11.2021 Oona Laitamaki
Create user interface for showing weather information on mobile and laptop view

31.10.2021 Oona Laitamaki
Create initial components for showing weather statistics

**/

import * as React from "react";
import { useMediaQuery } from "react-responsive";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import CallMadeIcon from "@material-ui/icons/CallMade";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import Carousel from "react-material-ui-carousel";
import {getWindDirection} from "./DataCalculations";


const useStyles = makeStyles(() => ({
  tabsRoot: {
    flexGrow: 1,
    borderRadius: 0,
    backgroundColor: "rgba(255,255,255,0.0)",
  },
  tabsText: {
    fontFamily: "Donau",
    letterSpacing: 2,
    fontSize: "3vh",
    color: "white",
    textTransform: "uppercase",
    textAlign: "center",
  },
  paper: {
    borderRadius: "10px",
    paddingTop: "1%",
    paddingBottom: "1%",
    backgroundColor: "rgba(255,255,255,0.7)",
    marginLeft: "10%",
    marginRight: "10%",
    minHeight: "95%",
    alignContent: "center",
  },
  upperGridContainer: {
    justifyContent: "center",
    paddingTop: "10px",
  },
  gridContainer: {
    justifyContent: "center",
    paddingBottom: "20px",
    alignItems: "center",
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
    fontSize: "2.5vh",
    textAlign: "left",
    paddingBottom: "10px",
  },
  text: {
    fontFamily: "Donau",
    letterSpacing: 2,
    textTransform: "unset",
    fontWeight: 600,
    display: "block",
    fontSize: "2.6vh",
    textAlign: "left",
    paddingLeft: "20px",
  },
  subText: {
    fontFamily: "Donau",
    letterSpacing: 2,
    textTransform: "unset",
    fontWeight: 400,
    display: "block",
    fontSize: "2.3vh",
    textAlign: "left",
    paddingLeft: "20px",
  },
  navigationIcon: {
    transform: props => "rotate(" + props.windDirection + "deg)",
  },
  airpressureDirection: {
    transform: props => "rotate(" + props.airpressureDirection + "deg)",
    fontSize: "3.4vh"
  }
}));


// Paper for displaying weather info on day before yesterday
function FirstDayWeatherPaper({weatherState}) {
  const classes = useStyles({windDirection: weatherState.winddirection.firstDayAverage - 180});
  const isXS = useMediaQuery({ query: "(max-width: 999px)" });

  return (
    <Paper className={classes.paper} style={isXS && {marginTop: "30px"}} align="center">

      <Grid item xs={12} sm={12} container className={classes.upperGridContainer} >

        {/* Temperature on day before yesterday */}
        <Grid item xs={8} sm={8}>
          <Typography className={classes.cardHeader}>Lämpötila</Typography>
        </Grid>
        <Grid item xs={10} sm={12} container className={classes.gridContainer}>
          <Grid item xs={2} sm={2}>
            <CardMedia
              component={"img"}
              style={{fill: "#FFFFFF"}}
              src={process.env.PUBLIC_URL + "/icons/weather/temperature.svg"}
              alt="temperature icon"
            />
          </Grid>
          <Grid item xs={8} sm={6}>
            <Typography style={{whiteSpace: "pre"}} className={classes.text}>{`${weatherState.temperature.firstDayAverage.toFixed(1)} \xB0C`}</Typography>
          </Grid>
        </Grid>

        {/* Snow depth info on day before yesterday */}
        <Grid item xs={8} sm={8}>
          <Typography className={classes.cardHeader}>Lumen syvyys</Typography>
        </Grid>
        <Grid item xs={10} sm={12} container className={classes.gridContainer}>
          <Grid item xs={2} sm={2}>
            <CardMedia
              component={"img"}
              style={{fill: "#FFFFFF"}}
              src={process.env.PUBLIC_URL + "/icons/weather/snow.svg"}
              alt="snowflake icon"
            />
          </Grid>
          <Grid item xs={8} sm={6}>
            <Typography className={classes.text}>{`${weatherState.snowdepth.firstDay} cm`}</Typography>
          </Grid>
        </Grid>

        {/* Wind direction and speed on day before yesterday */}
        <Grid item xs={8} sm={8}>
          <Typography className={classes.cardHeader}>Tuuli</Typography>
        </Grid>
        <Grid item xs={10} sm={12} container className={classes.gridContainer}>
          <Grid item xs={2} sm={2}>
            <CardMedia
              component={"img"}
              className={classes.navigationIcon}
              src={process.env.PUBLIC_URL + "/icons/weather/winddirection.svg"}
              alt="wind direction icon"
            />
          </Grid>
          <Grid item xs={8} sm={6} style={{alignContent: "center"}}>
            <Typography className={classes.text}>{`${weatherState.windspeed.firstDayAverage.toFixed(1)} m/s`}</Typography>
            <Typography className={classes.subText}>{getWindDirection(weatherState.winddirection.firstDayAverage)}</Typography>
          </Grid>
        </Grid>
        
        {/* Air pressure info on day before yesterday */}
        <Grid item xs={8} sm={8}>
          <Typography className={classes.cardHeader}>Ilmanpaine</Typography>
        </Grid>
        <Grid item xs={10} sm={12} container className={classes.gridContainer}>
          <Grid item xs={2} sm={2}>
            <CardMedia
              component={"img"}
              style={{fill: "#FFFFFF"}}
              src={process.env.PUBLIC_URL + "/icons/weather/airpressure.svg"}
              alt="air pressure icon"
            />
          </Grid>
          <Grid item xs={8} sm={6}>
            <Typography className={classes.text}>{`${weatherState.airpressure.firstDayAverage.toFixed(1)} mBar`}</Typography>
          </Grid>
        </Grid>

      </Grid>

    </Paper>
  );
}


// Paper for displaying weather info on yesterday
function SecondDayWeatherPaper({weatherState}) {
  const classes = useStyles({windDirection: weatherState.winddirection.secondDayAverage - 180});
  const isXS = useMediaQuery({ query: "(max-width: 999px)" });

  return (
    <Paper className={classes.paper} style={isXS && {marginTop: "30px"}} align="center">

      <Grid item xs={12} sm={12} container className={classes.upperGridContainer} >

        {/* Temperature on yesterday */}
        <Grid item xs={8} sm={8}>
          <Typography className={classes.cardHeader}>Lämpötila</Typography>
        </Grid>
        <Grid item xs={10} sm={12} container className={classes.gridContainer}>
          <Grid item xs={2} sm={2}>
            <CardMedia
              component={"img"}
              style={{fill: "#FFFFFF"}}
              src={process.env.PUBLIC_URL + "/icons/weather/temperature.svg"}
              alt="temperature icon"
            />
          </Grid>
          <Grid item xs={8} sm={6}>
            <Typography style={{whiteSpace: "pre"}} className={classes.text}>{`${weatherState.temperature.secondDayAverage.toFixed(1)} \xB0C`}</Typography>
          </Grid>
        </Grid>

        {/* Snow depth info on yesterday */}
        <Grid item xs={8} sm={8}>
          <Typography className={classes.cardHeader}>Lumen syvyys</Typography>
        </Grid>
        <Grid item xs={10} sm={12} container className={classes.gridContainer}>
          <Grid item xs={2} sm={2}>
            <CardMedia
              component={"img"}
              style={{fill: "#FFFFFF"}}
              src={process.env.PUBLIC_URL + "/icons/weather/snow.svg"}
              alt="snowflake icon"
            />
          </Grid>
          <Grid item xs={8} sm={6}>
            <Typography className={classes.text}>{`${weatherState.snowdepth.secondDay} cm`}</Typography>
          </Grid>
        </Grid>

        {/* Wind direction and speed on yesterday */}
        <Grid item xs={8} sm={8}>
          <Typography className={classes.cardHeader}>Tuuli</Typography>
        </Grid>
        <Grid item xs={10} sm={12} container className={classes.gridContainer}>
          <Grid item xs={2} sm={2}>
            <CardMedia
              component={"img"}
              className={classes.navigationIcon}
              src={process.env.PUBLIC_URL + "/icons/weather/winddirection.svg"}
              alt="wind direction icon"
            />
          </Grid>
          <Grid item xs={8} sm={6} style={{alignContent: "center"}}>
            <Typography className={classes.text}>{`${weatherState.windspeed.secondDayAverage.toFixed(1)} m/s`}</Typography>
            <Typography className={classes.subText}>{getWindDirection(weatherState.winddirection.secondDayAverage)}</Typography>
          </Grid>
        </Grid>
        
        {/* Air pressure info on yesterday */}
        <Grid item xs={8} sm={8}>
          <Typography className={classes.cardHeader}>Ilmanpaine</Typography>
        </Grid>
        <Grid item xs={10} sm={12} container className={classes.gridContainer}>
          <Grid item xs={2} sm={2}>
            <CardMedia
              component={"img"}
              style={{fill: "#FFFFFF"}}
              src={process.env.PUBLIC_URL + "/icons/weather/airpressure.svg"}
              alt="air pressure icon"
            />
          </Grid>
          <Grid item xs={8} sm={6}>
            <Typography className={classes.text}>{`${weatherState.airpressure.secondDayAverage.toFixed(1)} mBar`}</Typography>
          </Grid>
        </Grid>

      </Grid>

    </Paper>
  );
}


// Paper for displaying current weather info
function CurrentWeatherPaper({weatherState}) {
  const classes = useStyles({windDirection: weatherState.winddirection.current - 180, airpressureDirection: weatherState.airpressure.direction - 45});
  const isXS = useMediaQuery({ query: "(max-width: 999px)" });

  return (
    <Paper className={classes.paper} style={isXS && {marginTop: "30px"}} align="center">

      <Grid item xs={12} sm={12} container className={classes.upperGridContainer} >

        {/* Current temperature info */}
        <Grid item xs={8} sm={8}>
          <Typography className={classes.cardHeader}>Lämpötila</Typography>
        </Grid>
        <Grid item xs={12} sm={12} container className={classes.gridContainer}>
          <Grid item xs={2} sm={2}>
            <CardMedia
              component={"img"}
              style={{fill: "#FFFFFF"}}
              src={process.env.PUBLIC_URL + "/icons/weather/temperature.svg"}
              alt="temperature icon"
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Typography style={{whiteSpace: "pre"}} className={classes.text}>{`${weatherState.temperature.current} \xB0C`}</Typography>
          </Grid>
        </Grid>

        {/* Current snow depth info */}
        <Grid item xs={8} sm={8}>
          <Typography className={classes.cardHeader}>Lumen syvyys</Typography>
        </Grid>
        <Grid item xs={12} sm={12} container className={classes.gridContainer}>
          <Grid item xs={2} sm={2}>
            <CardMedia
              component={"img"}
              style={{fill: "#FFFFFF"}}
              src={process.env.PUBLIC_URL + "/icons/weather/snow.svg"}
              alt="snowflake icon"
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Typography className={classes.text}>{`${weatherState.snowdepth.thirdDay} cm`}</Typography>
          </Grid>
        </Grid>

        {/* Current wind direction and speed info */}
        <Grid item xs={8} sm={8}>
          <Typography className={classes.cardHeader}>Tuuli</Typography>
        </Grid>
        <Grid item xs={12} sm={12} container className={classes.gridContainer}>
          <Grid item xs={2} sm={2}>
            <CardMedia
              component={"img"}
              className={classes.navigationIcon}
              src={process.env.PUBLIC_URL + "/icons/weather/winddirection.svg"}
              alt="wind direction icon"
            />
          </Grid>
          <Grid item xs={6} sm={6} style={{alignContent: "center"}}>
            <Typography className={classes.text}>{`${weatherState.windspeed.current} m/s`}</Typography>
            <Typography className={classes.subText}>{getWindDirection(weatherState.winddirection.current)}</Typography>
          </Grid>
        </Grid>
        
        {/* Current air pressure info */}
        <Grid item xs={8} sm={8}>
          <Typography className={classes.cardHeader}>Ilmanpaine</Typography>
        </Grid>
        <Grid item xs={12} sm={12} container className={classes.gridContainer}>
          <Grid item xs={2} sm={2}>
            <CardMedia
              component={"img"}
              style={{fill: "#FFFFFF"}}
              src={process.env.PUBLIC_URL + "/icons/weather/airpressure.svg"}
              alt="air pressure icon"
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Typography className={classes.text}>{`${weatherState.airpressure.current} mBar`}</Typography>
            
            <Typography className={classes.subText} style={{verticalAlign: "middle", display: "flex", left: "1%"}}>muutos
              <CallMadeIcon className={classes.airpressureDirection} />
            </Typography>
          </Grid>
        </Grid>

      </Grid>

    </Paper>
  );
}


// Element for displaying three day weather info
function WeatherInfo({weatherState, handleMoreInformationClick}) {
  const carouselRef = React.useRef(null);
  const classes = useStyles({windDirection: weatherState.winddirection.current - 180});
  const isXS = useMediaQuery({ query: "(max-width: 999px)" });
  const [carouselSlide, setCarouselSlide] = React.useState(2);

  const handleChange = (event, newValue) => {
    setCarouselSlide(newValue);
    carouselRef.current.setActive(newValue);
  };


  return (
    <div>
      {isXS ? 
        <div>
          <Paper className={classes.tabsRoot}>
            <Tabs
              value={carouselSlide}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label={<div><Typography className={classes.tabsText}>{weatherState.dates.firstDay}</Typography><Typography className={classes.tabsText}>Toissapäivänä</Typography></div>} />
              <Tab label={<div><Typography className={classes.tabsText}>{weatherState.dates.secondDay}</Typography><Typography className={classes.tabsText}>Eilen</Typography></div>} />
              <Tab label={<div><Typography className={classes.tabsText}>{weatherState.dates.thirdDay}</Typography><Typography className={classes.tabsText}>Nyt</Typography></div>} />
            </Tabs>
          </Paper>
          
          <Carousel
            ref={carouselRef}
            index={2}
            autoPlay={false}
            animation="slide"
            cycleNavigation={false}
            navButtonsAlwaysVisible={true}
            fullHeightHover={false}
            indicators={false}
            showThumbs={false}
            showArrows={false}
            next={(next) => setCarouselSlide(next)}
            prev={(prev) => setCarouselSlide(prev)}
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
            <div>
              <FirstDayWeatherPaper weatherState={weatherState}/>
            </div>
            <div>
              <SecondDayWeatherPaper weatherState={weatherState}/>
            </div>
            <div>
              <CurrentWeatherPaper weatherState={weatherState}/>
            </div>   
          </Carousel>
          <Button
            onClick={handleMoreInformationClick}
            variant="contained"
            style={{
              backgroundColor: "rgba(255,255,255,0.6)",
              position: "absolute",
              right: 5,
              top: 450,
              borderRadius: "100%",
              padding: "18px"}}
          >
            <EqualizerIcon style={{fontSize: "4vh"}}/>
          </Button>
        </div> : 
        <div>
          <Grid item xs={12} sm={12} container style={{padding: "30px", position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            <Grid item xs={4} sm={4}>
              <Typography className={classes.tabsText}>{weatherState.dates.firstDay}</Typography>
              <Typography className={classes.tabsText}>Toissapäivänä</Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Typography className={classes.tabsText}>{weatherState.dates.secondDay}</Typography>
              <Typography className={classes.tabsText}>Eilen</Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <Typography className={classes.tabsText}>{weatherState.dates.thirdDay}</Typography>
              <Typography className={classes.tabsText}>Nyt</Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              <FirstDayWeatherPaper weatherState={weatherState}/>
            </Grid>
            <Grid item xs={4} sm={4}>
              <SecondDayWeatherPaper weatherState={weatherState}/>
            </Grid>
            <Grid item xs={4} sm={4}>
              <CurrentWeatherPaper weatherState={weatherState}/>
            </Grid>
            <Grid item xs={12} sm={12} container style={{justifyContent: "end", paddingTop: "2%", paddingBottom: "5%", paddingRight: "8%"}}>
              <Button
                onClick={handleMoreInformationClick}
                variant="contained"
                color="inherit"
                style={{backgroundColor: "rgba(255,255,255,0.6)",
                  borderColor: "transparent",
                  fontFamily: "Donau",
                  textTransform: "unset",
                  fontSize: "3vh"}}
                startIcon={<EqualizerIcon/>}
              >
                Lisätietoja
              </Button>
            </Grid>
          </Grid>
        </div>
      }
    </div>
  );
}
 
export default WeatherInfo;