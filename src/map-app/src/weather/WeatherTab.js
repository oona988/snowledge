/**
Weather information tab

Created: Oona Laitamaki

Latest update

7.11.2021 Oona Laitamaki
Calculated weather statistics that are shown in Statistics.js and Wheel.js

31.10.2021 Oona Laitamaki
Fetched weather data from Ilmatieteenlaitos and create initial components for showing weather statistics

**/


import * as React from "react";
import Wheel from "./Wheel";
import Statistics from "./Statistics";
import {getThreeDayStatistics, getThreeDaysHighest, getThreeDaysLowest, getSnowDepthStatistics, getCurrentAirPressureInfo, getWinterTemperatures} from "./utils";
 
function WeatherTab() {

  const [ weatherState, setWeatherState ] = React.useState(null);

  const fetchWeather = async () => {
    var weather = {};

    const currentDate = new Date();

    var firstDayStart = new Date(currentDate.getTime());
    firstDayStart.setDate(firstDayStart.getDate() - 2);
    firstDayStart.setHours(0,0,0,0);

    var snowDataStart = new Date(currentDate.getTime());
    snowDataStart.setDate(snowDataStart.getDate() - 6);
    snowDataStart.setHours(snowDataStart.getHours() - 2);
    snowDataStart.setMinutes(0,0,0);

    console.log(currentDate);
    console.log(currentDate.getMonth());
    console.log(currentDate.getDate());

    var winterDataStart = new Date(currentDate.getTime());
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    var winterSeason = false;
    if (currentMonth < 11) {
      console.log("winter time");
      winterSeason = true;
      winterDataStart.setFullYear(currentDate.getFullYear() - 1, 11, 1);
      winterDataStart.setHours(0,0,0,0);
    } else if (currentMonth === 11 && currentDay !== 1) {
      console.log("december");
      winterSeason = true;
      winterDataStart.setFullYear(currentDate.getFullYear(), 11, 1);
      winterDataStart.setHours(0,0,0,0);
    }

    console.log(winterSeason);
    console.log(winterDataStart.toISOString());

    // Fetch latest weather from Muonio Laukokero station
    fetch("http://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&storedquery_id=fmi::observations::weather::timevaluepair&fmisid=101982&")
      .then((response) => response.text())
      .then((response) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response,"text/xml");
        const results = xmlDoc.getElementsByTagName("om:result");

        for(let result of results) {
          switch (result.firstElementChild.getAttribute("gml:id")) {

          // Current temperature
          case "obs-obs-1-1-t2m":
            weather.temperature = { ...weather.temperature, current: result.firstElementChild.lastElementChild.lastElementChild.lastElementChild.innerHTML };
            break;

          // Current wind speed
          case "obs-obs-1-1-ws_10min":
            weather.windspeed = { ...weather.windspeed, current: result.firstElementChild.lastElementChild.lastElementChild.lastElementChild.innerHTML };
            break;

          // Current wind direction
          // Wind's income direction as degrees (360 = north)
          case "obs-obs-1-1-wd_10min":
            weather.winddirection = { ...weather.winddirection, current: result.firstElementChild.lastElementChild.lastElementChild.lastElementChild.innerHTML };
            break;

          // Air pressure as hPA / mBar
          case "obs-obs-1-1-p_sea":
            weather.airpressure = { ...weather.airpressure, ...getCurrentAirPressureInfo(result) };
            break;

          default:
            break;
          }
        }
      });
   
    // Fetch info from Muonio Laukokero station during past three days
    fetch(`http://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&starttime=${firstDayStart.toISOString()}&storedquery_id=fmi::observations::weather::hourly::timevaluepair&fmisid=101982&`)
      .then((response) => response.text())
      .then((response) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response,"text/xml");
        const results = xmlDoc.getElementsByTagName("om:result");
        
        for (let result of results) {
          switch (result.firstElementChild.getAttribute("gml:id")) {
            
          // Average temperatures
          case "obs-obs-1-1-TA_PT1H_AVG":
            weather.temperature = { ...weather.temperature, ...getThreeDayStatistics(result) };
            break;

          // Highest temperature
          case "obs-obs-1-1-TA_PT1H_MAX":
            weather.temperature = { ...weather.temperature, ...getThreeDaysHighest(result) };
            break;

          // Lowest temperature
          case "obs-obs-1-1-TA_PT1H_MIN":
            weather.temperature = { ...weather.temperature, ...getThreeDaysLowest(result) };
            break;

          // Average wind speeds
          case "obs-obs-1-1-WS_PT1H_AVG":
            weather.windspeed = { ...weather.windspeed, ...getThreeDayStatistics(result) };
            break;

          // Greatest wind speed
          case "obs-obs-1-1-WS_PT1H_MAX":
            weather.windspeed = { ...weather.windspeed, ...getThreeDaysHighest(result) };
            break;

          // Average wind directions
          // Wind's income direction as degrees (360 = north)
          case "obs-obs-1-1-WD_PT1H_AVG":
            weather.winddirection = { ...weather.winddirection, ...getThreeDayStatistics(result) };
            break;
            
          // Air pressure as hPA / mBar
          case "obs-obs-1-1-PA_PT1H_AVG":
            weather.airpressure = { ...weather.airpressure, ...getThreeDayStatistics(result) };
            break;

          default:
            break;
          }
        }

        // Calculate how many thaw (+0 degrees) days there are out of three
        var thawDays = 0;
        if (weather.temperature.firstDayAverage >= 0) {
          ++thawDays;
        }
        if (weather.temperature.secondDayAverage >= 0) {
          ++thawDays;
        }
        if (weather.temperature.thirdDayAverage >= 0) {
          ++thawDays;
        }
        weather.temperature = { ...weather.temperature, thawDaysOutOfThree: thawDays };
      });

    // Fetch info from Kittila Kenttarova station during past 7 days
    fetch(`https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&starttime=${snowDataStart.toISOString()}&storedquery_id=fmi::observations::weather::timevaluepair&fmisid=101987&`)
      .then((response) => response.text())
      .then((response) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response,"text/xml");
        const results = xmlDoc.getElementsByTagName("om:result");
        
        for(let result of results) {
          switch (result.firstElementChild.getAttribute("gml:id")) {
            
          // Snow depth data from last seven days
          case "obs-obs-1-1-snow_aws":
            weather.snowdepth = { ...weather.snowdepth, ...getSnowDepthStatistics(result, currentDate)};
            break;

          default:
            break;
          }
        }
      });

    // Fetch winter temperature statistics
    
    if (winterSeason) {
      fetch(`https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&starttime=${winterDataStart.toISOString()}&storedquery_id=fmi::observations::weather::daily::timevaluepair&fmisid=101982&`)
        .then((response) => response.text())
        .then((response) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response,"text/xml");
          const results = xmlDoc.getElementsByTagName("om:result");

          for (let result of results) {
            switch (result.firstElementChild.getAttribute("gml:id")) {
                
            // Daily temperatures during winter
            case "obs-obs-1-1-tday":
              weather.winter = { ...weather.winter, ...getWinterTemperatures(result)};
              break;

            default:
              break;
            }
          }
        });
    }
    
  
    
    
    // If there is no weather data yet, it will be stored into React hook state
    if (weatherState === null) {
      setWeatherState(weather);
    }
  };
  
  fetchWeather();

  return (
    <div>
      <Wheel weatherState={weatherState}></Wheel>
      <Statistics weatherState={weatherState}></Statistics>
    </div>
  );
}
 
export default WeatherTab;