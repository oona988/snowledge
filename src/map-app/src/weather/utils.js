/*
Returns latest three day average statistics
First day: day before yesterday
Second day: yesterday
Third day: today
*/
export function getThreeDayStatistics(data) {
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

// Returns highest value during last three days
export function getThreeDaysHighest(data) {
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
export function getThreeDaysLowest(data) {
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
export function getSnowDepthStatistics(data, currentDate) {
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

// Calculate recent air pressure change and current value
export function getCurrentAirPressureInfo(data) {
  var measurements = data.firstElementChild.getElementsByTagName("wml2:MeasurementTVP");

  /*
  Air pressure direction according to change during three hours

  >= 0.1 hPa fall per hour : direction 1 (down)
  < 0.1 hPa change in 3hrs : direction 2 (steady)
  >= 0.1 hPa rise per hour : direction 3 (up)

  */

  var current = Number(measurements[measurements.length - 1].lastElementChild.innerHTML);

  var hourAgo = Number(measurements[measurements.length - 7].lastElementChild.innerHTML);

  var threeHoursAgo = Number(measurements[measurements.length - 19].lastElementChild.innerHTML);

  var direction = 2;
  if (Math.abs(current - threeHoursAgo) < 0.1) {
    direction = 2;
  } else {
    var changeDuringOneHour = current - hourAgo;
    if (changeDuringOneHour >= 0.1) {
      direction = 3;
    } else if (changeDuringOneHour <= -0.1) {
      direction = 1;
    }
  }

  return { current: current, direction: direction };
}

// Calculate winter temperatures from December to May
export function getWinterTemperatures(data) {
  var measurements = data.firstElementChild.getElementsByTagName("wml2:MeasurementTVP");

  var thawDays = 0;
  var array = [];
  for (let i = 0; i < measurements.length; i++) {
    var temp = Number(measurements[i].lastElementChild.innerHTML);
    array.push(Math.round(temp));
    if (temp > 0) {
      ++thawDays;
    }
  }

  const sortedArray = array.sort();
  const len = array.length;
  const mid = Math.ceil(len / 2);
  const median = len % 2 == 0 ? (sortedArray[mid] + sortedArray[mid - 1]) / 1 : sortedArray[mid - 1];

  return { thawDays: thawDays, median: median };
}

// Calculate winter wind statistics for every month from December to May
export function getWinterWindStats(speeds, directions) {
  var speedMeasurements = speeds.firstElementChild.getElementsByTagName("wml2:MeasurementTVP");
  var directionMeasurements = directions.firstElementChild.getElementsByTagName("wml2:MeasurementTVP");

  var dayCount = 0;
  var directionSum = 0;
  var maxWind = 0;
  var previouslySavedDay = null;

  if (speedMeasurements < directionMeasurements) {
    for (let i = 0; i < speedMeasurements.length; i++) {
      let speed = Number(speedMeasurements[i].lastElementChild.innerHTML);
      let date = directionMeasurements[i].getElementsByTagName("wml2:time")[0].innerHTML.split("T")[0];
      if (date !== previouslySavedDay) {
        if (speed > 10) {
          let direction = Number(directionMeasurements[i].lastElementChild.innerHTML);
          previouslySavedDay = directionMeasurements[i].getElementsByTagName("wml2:time")[0].innerHTML;
          ++dayCount;
          directionSum += direction;
        }

        if (speed > maxWind) {
          maxWind = speed;
        }
      }
    }
  } else {
    for (let i = 0; i < directionMeasurements.length; i++) {
      let speed = Number(speedMeasurements[i].lastElementChild.innerHTML);
      let date = directionMeasurements[i].getElementsByTagName("wml2:time")[0].innerHTML.split("T")[0];
      if (date !== previouslySavedDay) {
        previouslySavedDay = date;

        if (speed > 10) {
          let direction = Number(directionMeasurements[i].lastElementChild.innerHTML);
          ++dayCount;
          directionSum += direction;
        }

        if (speed > maxWind) {
          maxWind = speed;
        }
      }
    }
  }

  return { maxWind: maxWind, strongWindDirectionSum: directionSum, strongWindDays: dayCount };
}