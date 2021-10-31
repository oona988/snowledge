/**
Weather information tab

Created: Oona Laitamaki

Latest update

31.10.2021 Oona Laitamaki
Fetch weather data from Ilmatieteenlaitos and create initial components for showing weather statistics

**/

import * as React from "react";
import Wheel from "./Wheel";
import Statistics from "./Statistics";

function getThreeDayStatistics(data) {
  var measurements = data.firstElementChild.getElementsByTagName("wml2:MeasurementTVP");

  var firstDayCount = 0;
  for (let i = 0; i < 24; i++) {
    firstDayCount += Number(measurements[i].lastElementChild.innerHTML);
  }

  var secondDayCount = 0;
  for (let i = 24; i < 48; i++) {
    secondDayCount += Number(measurements[i].lastElementChild.innerHTML);
  }

  var thirdDayCount = 0;
  for (let i = 48; i < measurements.length; i++) {
    thirdDayCount += Number(measurements[i].lastElementChild.innerHTML);
  }

  return {
    firstDayAverage: firstDayCount / 24,
    secondDayAverage: secondDayCount / 24,
    thirdDayAverage: thirdDayCount / (measurements.length - 48),
    threeDaysAverage: (firstDayCount + secondDayCount + thirdDayCount) / measurements.length
  };
}

 
function WeatherTab() {

  const [ weatherState, setWeatherState ] = React.useState(null);

  const fetchWeather = async () => {
    var weather = {};

    var firstDayStart = new Date();
    firstDayStart.setDate(firstDayStart.getDate() - 2);
    firstDayStart.setUTCHours(0,0,0,0);
    var firstDayStartString = firstDayStart.toISOString();
    console.log(firstDayStartString);

    var secondDayStart = new Date();
    secondDayStart.setDate(secondDayStart.getDate() - 1);
    secondDayStart.setUTCHours(0,0,0,0);
    var secondDayStartString = secondDayStart.toISOString();
    console.log(secondDayStartString);

    var thirdDayStart = new Date();
    thirdDayStart.setUTCHours(0,0,0,0);
    var thirdDayStartString = thirdDayStart.toISOString();
    console.log(thirdDayStartString);

    // Fetch info from Muonio Laukokero station during past three days
    fetch(`http://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&starttime=${firstDayStartString}&storedquery_id=fmi::observations::weather::hourly::timevaluepair&fmisid=101982&`)
      .then((response) => response.text())
      .then((response) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response,"text/xml");
        const results = xmlDoc.getElementsByTagName("om:result");
        
        for (let result of results) {
          switch (result.firstElementChild.getAttribute("gml:id")) {
            
          // Average temperature
          case "obs-obs-1-1-TA_PT1H_AVG":
            weather.temperature = {};
            weather.temperature = getThreeDayStatistics(result);
            console.log(weather.temperature);
            break;

          // Average wind speed
          case "obs-obs-1-1-WS_PT1H_AVG":
            weather.windspeed = {};
            weather.windspeed = getThreeDayStatistics(result);
            console.log(weather.windspeed);
            break;

          // Average wind direction
          // Wind's income direction as degrees (360 = north)
          case "obs-obs-1-1-WD_PT1H_AVG":
            weather.winddirection = {};
            weather.winddirection = getThreeDayStatistics(result);
            console.log(weather.winddirection);
            break;
            
          // Air pressure as hPA
          case "obs-obs-1-1-PA_PT1H_AVG":
            weather.airpressure = {};
            weather.airpressure = getThreeDayStatistics(result);
            console.log(weather.airpressure);
            break;

          default:
            break;
          }
        }
      });
      
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