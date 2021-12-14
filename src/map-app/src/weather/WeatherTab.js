/**
Weather information tab

Created: Oona Laitamaki

Latest update

10.11.2021 Oona Laitamaki
Calculated current weather statistics and weather statistics for winter time

7.11.2021 Oona Laitamaki
Calculated weather statistics that are shown in Statistics.js and Wheel.js

31.10.2021 Oona Laitamaki
Fetched weather data from Ilmatieteenlaitos and create initial components for showing weather statistics

**/


import * as React from "react";
import WeatherInfo from "./WeatherInfo";
import Statistics from "./Statistics";
import {getThreeDayStatistics, getThreeDayWindStatistics, getThreeDaysHighest, getThreeDaysLowest, getSnowDepthStatistics, getCurrentAirPressureInfo, getWinterTemperatures, getWinterWindStats} from "./DataCalculations";
 

function WeatherTab() {
  var initialState = {
    dates: {
      firstDay: "",
      secondDay: "",
      thirdDay: "",
    }, temperature: 
    { current: "",
      firstDayAverage: 0,
      secondDayAverage: 0,
      thirdDayAverage: 0,
      threeDaysAverage: 0,
      threeDaysHighest: "",
      threeDaysLowest: "",
      thawDaysOutOfThree: 0,
      thawDays: []
    }, windspeed: { 
      current: "",
      firstDayAverage: 0,
      secondDayAverage: 0,
      thirdDayAverage: 0,
      threeDaysAverage: 0,
      threeDaysHighest: ""
    }, winddirection: {
      current: "",
      firstDayAverage: 0,
      secondDayAverage: 0,
      thirdDayAverage: 0,
      threeDaysAverage: 0
    }, snowdepth: {
      firstDay: "",
      secondDay: "",
      thirdDay: "",
      sevenDaysGrowth: 0
    }, airpressure: {
      current: "",
      direction: "",
      firstDayAverage: 0,
      secondDayAverage: 0,
      thirdDayAverage: 0,
      threeDaysAverage: 0
    }, winter: {
      season: false,
      median: 0,
      thawDays: 0,
      maxWind: 0,
      strongWindDays: 0,
      strongWindDirectionX: 0,
      strongWindDirectionY: 0,
      months: 0
    } };

  const [ weatherState, setWeatherState ] = React.useState(initialState);
  const [ displayWeatherStatistics, setDisplayWeatherStatistics ] = React.useState(false);

  const fetchWeather = async () => {

    // Initialize weather structure
    // Month statistics are not here because all of the data might not be collected
    var weather = initialState;

    const currentDate = new Date();

    weather.dates.thirdDay = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.`;

    var firstDayStart = new Date(currentDate.getTime());
    firstDayStart.setDate(firstDayStart.getDate() - 2);
    firstDayStart.setHours(0,0,0,0);

    weather.dates.firstDay = `${firstDayStart.getDate()}.${firstDayStart.getMonth() + 1}.`;

    var secondDay = new Date(currentDate.getTime());
    secondDay.setDate(secondDay.getDate() - 1);

    weather.dates.secondDay = `${secondDay.getDate()}.${secondDay.getMonth() + 1}.`;

    var snowDataStart = new Date(currentDate.getTime());
    snowDataStart.setDate(snowDataStart.getDate() - 6);
    snowDataStart.setHours(snowDataStart.getHours() - 2);
    snowDataStart.setMinutes(0,0,0);

    var decemberStart = new Date(currentDate.getTime());
    var decemberEnd = new Date(currentDate.getTime());
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    var winterSeason = false;

    if (currentMonth < 5) {
      winterSeason = true;
      weather.winter = { ...weather.winter, season: true };
      decemberStart.setFullYear(currentDate.getFullYear() - 1, 11, 1);
      decemberStart.setHours(0,0,0,0);
      decemberEnd.setFullYear(currentDate.getFullYear() - 1, 11, 31);
      decemberEnd.setHours(0,0,0,0);
    } else if (currentMonth === 11 && currentDay !== 1) {
      winterSeason = true;
      weather.winter = { ...weather.winter, season: true };
      decemberStart.setFullYear(currentDate.getFullYear(), 11, 1);
      decemberStart.setHours(0,0,0,0);
      decemberEnd.setFullYear(currentDate.getFullYear(), 11, 31);
      decemberEnd.setHours(0,0,0,0);
    }

    //console.log(winterSeason);
    //console.log(decemberStart.toISOString());

    // Fetch latest weather from Muonio Laukukero station
    fetch("https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&storedquery_id=fmi::observations::weather::timevaluepair&fmisid=101982&")
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
            setWeatherState({...weatherState, ...weather.temperature});
            break;

          // Current wind speed
          case "obs-obs-1-1-ws_10min":
            weather.windspeed = { ...weather.windspeed, current: result.firstElementChild.lastElementChild.lastElementChild.lastElementChild.innerHTML };
            setWeatherState({...weatherState, ...weather.windspeed});
            break;

          // Current wind direction
          // Wind's income direction as degrees (360 = north)
          case "obs-obs-1-1-wd_10min":
            weather.winddirection = { ...weather.winddirection, current: result.firstElementChild.lastElementChild.lastElementChild.lastElementChild.innerHTML };
            setWeatherState({...weatherState, ...weather.winddirection});
            break;

          // Air pressure as hPA / mBar
          case "obs-obs-1-1-p_sea":
            weather.airpressure = { ...weather.airpressure, ...getCurrentAirPressureInfo(result) };
            setWeatherState({...weatherState, ...weather.airpressure});
            break;

          default:
            break;
          }
        }
      }).catch((error) => {
        console.log(error);
      });
   
    // Fetch info from Muonio Laukukero station during past three days
    fetch(`https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&starttime=${firstDayStart.toISOString()}&storedquery_id=fmi::observations::weather::hourly::timevaluepair&fmisid=101982&`)
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
            setWeatherState({...weatherState, ...weather.temperature});
            break;

          // Highest temperature
          case "obs-obs-1-1-TA_PT1H_MAX":
            weather.temperature = { ...weather.temperature, ...getThreeDaysHighest(result) };
            setWeatherState({...weatherState, ...weather.temperature});
            break;

          // Lowest temperature
          case "obs-obs-1-1-TA_PT1H_MIN":
            weather.temperature = { ...weather.temperature, ...getThreeDaysLowest(result) };
            setWeatherState({...weatherState, ...weather.temperature});
            break;

          // Average wind speeds
          case "obs-obs-1-1-WS_PT1H_AVG":
            weather.windspeed = { ...weather.windspeed, ...getThreeDayStatistics(result) };
            setWeatherState({...weatherState, ...weather.windspeed});
            break;

          // Greatest wind speed
          case "obs-obs-1-1-WS_PT1H_MAX":
            weather.windspeed = { ...weather.windspeed, ...getThreeDaysHighest(result) };
            setWeatherState({...weatherState, ...weather.windspeed});
            break;

          // Average wind directions
          // Wind's income direction as degrees (360 = north)
          case "obs-obs-1-1-WD_PT1H_AVG":
            weather.winddirection = { ...weather.winddirection, ...getThreeDayWindStatistics(result) };
            setWeatherState({...weatherState, ...weather.winddirection});
            break;
            
          // Air pressure as hPA / mBar
          case "obs-obs-1-1-PA_PT1H_AVG":
            weather.airpressure = { ...weather.airpressure, ...getThreeDayStatistics(result) };
            setWeatherState({...weatherState, ...weather.airpressure});
            break;

          default:
            break;
          }
        }

        // Calculate how many thaw (+0 degrees) days there are out of three
        var thawDays = 0;
        
        if (weather.temperature.firstDayAverage >= 0) {
          ++thawDays;
          weather.temperature.thawDays.push(`${firstDayStart.getDate()}.${firstDayStart.getMonth() + 1}.  ${weather.temperature.firstDayAverage.toFixed()}\xB0C`);
        }
        if (weather.temperature.secondDayAverage >= 0) {
          ++thawDays;
          weather.temperature.thawDays.push(`${secondDay.getDate()}.${secondDay.getMonth() + 1}.  ${weather.temperature.secondDayAverage.toFixed()}\xB0C`);
        }
        if (weather.temperature.thirdDayAverage >= 0) {
          ++thawDays;
          weather.temperature.thawDays.push(`${currentDate.getDate()}.${currentDate.getMonth() + 1}.  ${weather.temperature.thirdDayAverage.toFixed()}\xB0C`);
        }

        weather.temperature = { ...weather.temperature, thawDaysOutOfThree: thawDays };
        setWeatherState({...weatherState, ...weather.temperature});
      }).catch((error) => {
        console.log(error);
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
            setWeatherState({...weatherState, ...weather.snowdepth});
            break;

          default:
            break;
          }
        }
      }).catch((error) => {
        console.log(error);
      });


    // Winter weather statistics are fetched from Muonio Laukukero station if its winter season currently
    if (winterSeason) {

      // Fetch daily winter temperature statistics from last December and after that
      fetch(`https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&starttime=${decemberStart.toISOString()}&storedquery_id=fmi::observations::weather::daily::timevaluepair&fmisid=101982&`)
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
              setWeatherState({...weatherState, ...weather.winter});
              break;

            default:
              break;
            }
          }
        }).catch((error) => {
          console.log(error);
        });

      // Fetch hourly winter wind statistics in last December
      fetch(`https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&starttime=${decemberStart.toISOString()}&endtime=${decemberEnd.toISOString()}&storedquery_id=fmi::observations::weather::hourly::timevaluepair&fmisid=101982&`)
        .then((response) => response.text())
        .then((response) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response,"text/xml");
          const results = xmlDoc.getElementsByTagName("om:result");
          let windspeeds;
          let winddirections;

          for (let result of results) {
            switch (result.firstElementChild.getAttribute("gml:id")) {
                
            // Wind speeds
            case "obs-obs-1-1-WS_PT1H_AVG":
              windspeeds = result;
              break;

            // Wind directions
            case "obs-obs-1-1-WD_PT1H_AVG":
              winddirections = result;
              break;

            default:
              break;
            }
          }
          weather.december = { ...weather.december, ...getWinterWindStats(windspeeds, winddirections)};
          setWeatherState({...weatherState, ...weather.december});

          let maxWind = weather.winter.maxWind;
          if (weather.december.maxWind > maxWind) {
            maxWind = weather.december.maxWind;
          }
          weather.winter = { ...weather.winter, maxWind: maxWind, strongWindDirectionX: weather.winter.strongWindDirectionX += weather.december.strongWindDirectionX, strongWindDirectionY: weather.winter.strongWindDirectionY += weather.december.strongWindDirectionY, strongWindDays: weather.winter.strongWindDays += weather.december.strongWindDays, months: ++weather.winter.months };
          setWeatherState({...weatherState, ...weather.winter});
        }).catch((error) => {
          console.log(error);
        });
      
      if (currentMonth >= 0 && currentMonth !== 11) {
        var januaryStart = new Date();
        januaryStart.setFullYear(currentDate.getFullYear(), 0, 1);
        januaryStart.setHours(0,0,0,0);
        var januaryEnd = new Date();
        januaryEnd.setFullYear(currentDate.getFullYear(), 0, 31);
        januaryEnd.setHours(0,0,0,0);

        // Fetch hourly winter wind statistics in last January
        fetch(`https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&starttime=${januaryStart.toISOString()}&endtime=${januaryEnd.toISOString()}&storedquery_id=fmi::observations::weather::hourly::timevaluepair&fmisid=101982&`)
          .then((response) => response.text())
          .then((response) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response,"text/xml");
            const results = xmlDoc.getElementsByTagName("om:result");
            let windspeeds;
            let winddirections;

            for (let result of results) {
              switch (result.firstElementChild.getAttribute("gml:id")) {
                  
              // Wind speeds
              case "obs-obs-1-1-WS_PT1H_AVG":
                windspeeds = result;
                break;

              // Wind directions
              case "obs-obs-1-1-WD_PT1H_AVG":
                winddirections = result;
                break;

              default:
                break;
              }
            }
            weather.january = { ...weather.january, ...getWinterWindStats(windspeeds, winddirections)};
            setWeatherState({...weatherState, ...weather.january});

            let maxWind = weather.winter.maxWind;
            if (weather.january.maxWind > maxWind) {
              maxWind = weather.january.maxWind;
            }
            weather.winter = { ...weather.winter, maxWind: maxWind, strongWindDirectionX: weather.winter.strongWindDirectionX += weather.january.strongWindDirectionX, strongWindDirectionY: weather.winter.strongWindDirectionY += weather.january.strongWindDirectionY, strongWindDays: weather.winter.strongWindDays += weather.january.strongWindDays, months: ++weather.winter.months };
            setWeatherState({...weatherState, ...weather.winter});
          }).catch((error) => {
            console.log(error);
          });
      }
    
      if (currentMonth > 0 && currentMonth !== 11) {
        var februaryStart = new Date();
        februaryStart.setFullYear(currentDate.getFullYear(), 1, 1);
        februaryStart.setHours(0,0,0,0);
        var februaryEnd = new Date();
        februaryEnd.setFullYear(currentDate.getFullYear(), 1, 28);
        februaryEnd.setHours(0,0,0,0);

        // Fetch hourly winter wind statistics in last February
        fetch(`https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&starttime=${februaryStart.toISOString()}&endtime=${februaryEnd.toISOString()}&storedquery_id=fmi::observations::weather::hourly::timevaluepair&fmisid=101982&`)
          .then((response) => response.text())
          .then((response) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response,"text/xml");
            const results = xmlDoc.getElementsByTagName("om:result");
            let windspeeds;
            let winddirections;

            for (let result of results) {
              switch (result.firstElementChild.getAttribute("gml:id")) {
                  
              // Wind speeds
              case "obs-obs-1-1-WS_PT1H_AVG":
                windspeeds = result;
                break;

              // Wind directions
              case "obs-obs-1-1-WD_PT1H_AVG":
                winddirections = result;
                break;

              default:
                break;
              }
            }
            weather.february = { ...weather.february, ...getWinterWindStats(windspeeds, winddirections)};
            setWeatherState({...weatherState, ...weather.february});

            let maxWind = weather.winter.maxWind;
            if (weather.february.maxWind > maxWind) {
              maxWind = weather.february.maxWind;
            }
            weather.winter = { ...weather.winter, maxWind: maxWind, strongWindDirectionX: weather.winter.strongWindDirectionX += weather.february.strongWindDirectionX, strongWindDirectionY: weather.winter.strongWindDirectionY += weather.february.strongWindDirectionY, strongWindDays: weather.winter.strongWindDays += weather.february.strongWindDays, months: ++weather.winter.months };
            setWeatherState({...weatherState, ...weather.winter});
          }).catch((error) => {
            console.log(error);
          });
      }

      if (currentMonth > 1 && currentMonth !== 11) {
        var marchStart = new Date();
        marchStart.setFullYear(currentDate.getFullYear(), 2, 1);
        marchStart.setHours(0,0,0,0);
        var marchEnd = new Date();
        marchEnd.setFullYear(currentDate.getFullYear(), 2, 31);
        marchEnd.setHours(0,0,0,0);

        // Fetch hourly winter wind statistics in last March
        fetch(`https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&starttime=${marchStart.toISOString()}&endtime=${marchEnd.toISOString()}&storedquery_id=fmi::observations::weather::hourly::timevaluepair&fmisid=101982&`)
          .then((response) => response.text())
          .then((response) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response,"text/xml");
            const results = xmlDoc.getElementsByTagName("om:result");
            let windspeeds;
            let winddirections;

            for (let result of results) {
              switch (result.firstElementChild.getAttribute("gml:id")) {
                  
              // Wind speeds
              case "obs-obs-1-1-WS_PT1H_AVG":
                windspeeds = result;
                break;

              // Wind directions
              case "obs-obs-1-1-WD_PT1H_AVG":
                winddirections = result;
                break;

              default:
                break;
              }
            }
            weather.march = { ...weather.march, ...getWinterWindStats(windspeeds, winddirections)};
            setWeatherState({...weatherState, ...weather.march});

            let maxWind = weather.winter.maxWind;
            if (weather.march.maxWind > maxWind) {
              maxWind = weather.march.maxWind;
            }
            weather.winter = { ...weather.winter, maxWind: maxWind, strongWindDirectionX: weather.winter.strongWindDirectionX += weather.march.strongWindDirectionX, strongWindDirectionY: weather.winter.strongWindDirectionY += weather.march.strongWindDirectionY, strongWindDays: weather.winter.strongWindDays += weather.march.strongWindDays, months: ++weather.winter.months };
            setWeatherState({...weatherState, ...weather.winter});
          }).catch((error) => {
            console.log(error);
          });
      }

      if (currentMonth > 2 && currentMonth !== 11) {
        var aprilStart = new Date();
        aprilStart.setFullYear(currentDate.getFullYear(), 3, 1);
        aprilStart.setHours(0,0,0,0);
        var aprilEnd = new Date();
        aprilEnd.setFullYear(currentDate.getFullYear(), 3, 30);
        aprilEnd.setHours(0,0,0,0);

        // Fetch hourly winter wind statistics in last April
        fetch(`https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&starttime=${aprilStart.toISOString()}&endtime=${aprilEnd.toISOString()}&storedquery_id=fmi::observations::weather::hourly::timevaluepair&fmisid=101982&`)
          .then((response) => response.text())
          .then((response) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response,"text/xml");
            const results = xmlDoc.getElementsByTagName("om:result");
            let windspeeds;
            let winddirections;

            for (let result of results) {
              switch (result.firstElementChild.getAttribute("gml:id")) {
                  
              // Wind speeds
              case "obs-obs-1-1-WS_PT1H_AVG":
                windspeeds = result;
                break;

              // Wind directions
              case "obs-obs-1-1-WD_PT1H_AVG":
                winddirections = result;
                break;

              default:
                break;
              }
            }
            weather.april = { ...weather.april, ...getWinterWindStats(windspeeds, winddirections)};
            setWeatherState({...weatherState, ...weather.april});

            let maxWind = weather.winter.maxWind;
            if (weather.april.maxWind > maxWind) {
              maxWind = weather.april.maxWind;
            }
            weather.winter = { ...weather.winter, maxWind: maxWind, strongWindDirectionX: weather.winter.strongWindDirectionX += weather.april.strongWindDirectionX, strongWindDirectionY: weather.winter.strongWindDirectionY += weather.april.strongWindDirectionY, strongWindDays: weather.winter.strongWindDays += weather.april.strongWindDays, months: ++weather.winter.months };
            setWeatherState({...weatherState, ...weather.winter});
          }).catch((error) => {
            console.log(error);
          });
      }

      if (currentMonth > 3 && currentMonth !== 11) {
        var mayStart = new Date();
        mayStart.setFullYear(currentDate.getFullYear(), 4, 1);
        mayStart.setHours(0,0,0,0);
        var mayEnd = new Date();
        mayEnd.setFullYear(currentDate.getFullYear(), 4, 31);
        mayEnd.setHours(0,0,0,0);

        // Fetch hourly winter wind statistics in last May
        fetch(`https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&starttime=${mayStart.toISOString()}&endtime=${mayEnd.toISOString()}&storedquery_id=fmi::observations::weather::hourly::timevaluepair&fmisid=101982&`)
          .then((response) => response.text())
          .then((response) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response,"text/xml");
            const results = xmlDoc.getElementsByTagName("om:result");
            let windspeeds;
            let winddirections;

            for (let result of results) {
              switch (result.firstElementChild.getAttribute("gml:id")) {
                  
              // Wind speeds
              case "obs-obs-1-1-WS_PT1H_AVG":
                windspeeds = result;
                break;

              // Wind directions
              case "obs-obs-1-1-WD_PT1H_AVG":
                winddirections = result;
                break;

              default:
                break;
              }
            }
            weather.may = { ...weather.may, ...getWinterWindStats(windspeeds, winddirections)};
            setWeatherState({...weatherState, ...weather.may});

            let maxWind = weather.winter.maxWind;
            if (weather.may.maxWind > maxWind) {
              maxWind = weather.may.maxWind;
            }
            weather.winter = { ...weather.winter, maxWind: maxWind, strongWindDirectionX: weather.winter.strongWindDirectionX += weather.may.strongWindDirectionX, strongWindDirectionY: weather.winter.strongWindDirectionY += weather.may.strongWindDirectionY, strongWindDays: weather.winter.strongWindDays += weather.may.strongWindDays, months: ++weather.winter.months };
            setWeatherState({...weatherState, ...weather.winter});
          }).catch((error) => {
            console.log(error);
          });
      }
    }
  };

  React.useEffect(() => {
    fetchWeather();
  }, []);

  const handleReturnClick = () => {
    setDisplayWeatherStatistics(false);
  };

  const handleMoreInformationClick = () => {
    setDisplayWeatherStatistics(true);
  };

  return (
    <div>
      {!displayWeatherStatistics ?
        <WeatherInfo weatherState={weatherState} handleMoreInformationClick={handleMoreInformationClick}/> :
        <Statistics weatherState={weatherState} handleReturnClick={handleReturnClick}/>}
    </div>
  );
}
 
export default WeatherTab;