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

/*
Returns latest three day average statistics
First day: day before yesterday
Second day: yesterday
Third day: today
*/
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
/*
function checkThawDays(data) {
  var measurements = data.firstElementChild.getElementsByTagName("wml2:MeasurementTVP");

}
*/

// Returns highest value during last three days
function getThreeDaysHighest(data) {
  var measurements = data.firstElementChild.getElementsByTagName("wml2:MeasurementTVP");

  var highest = measurements[0].lastElementChild.innerHTML;
  for (let i = 0; i < measurements.length; i++) {
    if (highest < Number(measurements[i].lastElementChild.innerHTML)) {
      highest = Number(measurements[i].lastElementChild.innerHTML);
    }
  }

  return { threeDaysHighest: highest };
}

// Returns lowest value during last three days
function getThreeDaysLowest(data) {
  var measurements = data.firstElementChild.getElementsByTagName("wml2:MeasurementTVP");

  var lowest = measurements[0].lastElementChild.innerHTML;
  for (let i = 0; i < measurements.length; i++) {
    if (lowest > Number(measurements[i].lastElementChild.innerHTML)) {
      lowest = Number(measurements[i].lastElementChild.innerHTML);
    }
  }

  return { threeDaysLowest: lowest };
}

// Returns timestamp as a string in FMI API format
function getXMLTimeString(date) {
  var dateString = date.toISOString();
  var result = dateString.slice(0, 19) + dateString.slice(23);
  return result;
}

// Calculate snow depth rise during 7 days
function getSnowDepthStatistics(data, currentDate) {
  var measurements = data.firstElementChild.getElementsByTagName("wml2:MeasurementTVP");

  var currentEvenHour = new Date(currentDate.getTime());
  currentEvenHour.setMinutes(0,0,0);

  var day1 = new Date(currentEvenHour.getTime());
  day1.setDate(day1.getDate() - 6);

  var day2 = new Date(currentEvenHour.getTime());
  day2.setDate(day2.getDate() - 5);

  var day3 = new Date(currentEvenHour.getTime());
  day3.setDate(day3.getDate() - 4);

  var day4 = new Date(currentEvenHour.getTime());
  day4.setDate(day4.getDate() - 3);

  var day5 = new Date(currentEvenHour.getTime());
  day5.setDate(day5.getDate() - 2);

  var day6 = new Date(currentEvenHour.getTime());
  day6.setDate(day6.getDate() - 1);

  var growth = 0;
  for (let measurement of measurements) {
    switch (measurement.getElementsByTagName("wml2:time")[0].innerHTML) {

    // Get snowdepth 6 days ago
    case getXMLTimeString(day1):
      var value1 = measurement.getElementsByTagName("wml2:value")[0].innerHTML;
      break;

    // Get snowdepth 5 days ago
    case getXMLTimeString(day2):
      var value2 = measurement.getElementsByTagName("wml2:value")[0].innerHTML;
      if (value1 < value2) {
        growth += value2 - value1;
      }
      break;

    // Get snowdepth 4 days ago
    case getXMLTimeString(day3):
      var value3 = measurement.getElementsByTagName("wml2:value")[0].innerHTML;
      if (value2 < value3) {
        growth += value3 - value2;
      }
      break;

    // Get snowdepth 3 days ago
    case getXMLTimeString(day4):
      var value4 = measurement.getElementsByTagName("wml2:value")[0].innerHTML;
      if (value3 < value4) {
        growth += value4 - value3;
      }
      break;

    // Get snowdepth 2 days ago
    case getXMLTimeString(day5):
      var value5 = measurement.getElementsByTagName("wml2:value")[0].innerHTML;
      if (value5 < value6) {
        growth += value6 - value5;
      }
      break;

    // Get snowdepth 1 day ago
    case getXMLTimeString(day6):
      var value6 = measurement.getElementsByTagName("wml2:value")[0].innerHTML;
      if (value5 < value6) {
        growth += value6 - value5;
      }
      break;

    // Get current snowdepth
    case getXMLTimeString(currentEvenHour):
      var value7 = measurement.getElementsByTagName("wml2:value")[0].innerHTML;
      if (value6 < value7) {
        growth += value7 - value6;
      }
      break;

    default:
      break;
    }
  }

  return {
    firstDay: value5,
    secondDay: value6,
    thirdDay: value7,
    sevenDaysGrowth: growth
  };
}

 
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

    /*
    var secondDayStart = new Date();
    secondDayStart.setDate(secondDayStart.getDate() - 1);
    secondDayStart.setUTCHours(0,0,0,0);
    var secondDayStartString = secondDayStart.toISOString();
    console.log(secondDayStartString);

    var thirdDayStart = new Date();
    thirdDayStart.setUTCHours(0,0,0,0);
    var thirdDayStartString = thirdDayStart.toISOString();
    console.log(thirdDayStartString);
    */
   
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
            
          // Air pressure as hPA
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

        /*
        // Fetch info about thaw days from Muonio Laukokero station
        fetch(`https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&starttime=2020-10-31T00:00:00.000Z&storedquery_id=fmi::observations::weather::daily::timevaluepair&fmisid=101982&`)
        .then((response) => response.text())
        .then((response) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response,"text/xml");
          const results = xmlDoc.getElementsByTagName("om:result");
          });

          for (let result of results) {
            if result
          }
          */
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