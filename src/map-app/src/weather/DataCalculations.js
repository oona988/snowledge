export function toDegrees(angle) {
  return angle * (180 / Math.PI);
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}


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

/*
Returns latest three day average wind directions
First day: day before yesterday
Second day: yesterday
Third day: today
*/
export function getThreeDayWindStatistics(data) {
  var measurements = data.firstElementChild.getElementsByTagName("wml2:MeasurementTVP");

  var firstDayCountX = 0;
  var firstDayCountY = 0;
  for (let i = 0; i < 24; i++) {
    let direction = Number(measurements[i].lastElementChild.innerHTML);
    firstDayCountX += Math.cos(toRadians(direction));
    firstDayCountY += Math.sin(toRadians(direction));
  }

  var secondDayCountX = 0;
  var secondDayCountY = 0;
  for (let i = 24; i < 48; i++) {
    let direction = Number(measurements[i].lastElementChild.innerHTML);
    secondDayCountX += Math.cos(toRadians(direction));
    secondDayCountY += Math.sin(toRadians(direction));
  }

  var thirdDayCountX = 0;
  var thirdDayCountY = 0;
  for (let i = 48; i < measurements.length; i++) {
    let direction = Number(measurements[i].lastElementChild.innerHTML);
    thirdDayCountX += Math.cos(toRadians(direction));
    thirdDayCountY += Math.sin(toRadians(direction));
  }

  return {
    firstDayAverage: (toDegrees(Math.atan2(firstDayCountY, firstDayCountX)) + 360) % 360,
    secondDayAverage: (toDegrees(Math.atan2(secondDayCountY, secondDayCountX)) + 360) % 360,
    thirdDayAverage: (toDegrees(Math.atan2(thirdDayCountY, thirdDayCountX)) + 360) % 360,
    threeDaysAverage: (toDegrees(Math.atan2(firstDayCountY + secondDayCountY + thirdDayCountY, firstDayCountX + secondDayCountX +  thirdDayCountX)) + 360) % 360
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

  >= 0.1 hPa fall per hour : direction 135 (down)
  < 0.1 hPa change in 3hrs : direction 90 (steady)
  >= 0.1 hPa rise per hour : direction 45 (up)

  */

  var current = Number(measurements[measurements.length - 1].lastElementChild.innerHTML);

  var hourAgo = Number(measurements[measurements.length - 7].lastElementChild.innerHTML);

  var threeHoursAgo = Number(measurements[measurements.length - 19].lastElementChild.innerHTML);

  var direction = 90;
  if (Math.abs(current - threeHoursAgo) < 0.1) {
    direction = 90;
  } else {
    var changeDuringOneHour = current - hourAgo;
    if (changeDuringOneHour >= 0.1) {
      direction = 45;
    } else if (changeDuringOneHour <= -0.1) {
      direction = 135;
    }
  }

  return { current: current, direction: direction };
}

// Calculate daily winter temperatures from December to May
export function getWinterTemperatures(data) {
  var measurements = data.firstElementChild.getElementsByTagName("wml2:MeasurementTVP");

  var thawDays = 0;
  var array = [];

  for (let i = 0; i < measurements.length - 1; i++) {
    var temp = Number(measurements[i].lastElementChild.innerHTML);

    var roundedTemp = Math.round(temp);
    if (roundedTemp === 0) {
      roundedTemp = 0;
    }
    array.push(roundedTemp);
    if (temp > 0) {
      ++thawDays;
    }
  }

  const sortedArray = array.sort(function(a,b){return a-b;});
  const len = sortedArray.length;
  const mid = Math.ceil(len / 2);
  var median = len % 2 === 0 ? (sortedArray[mid] + sortedArray[mid - 1]) / 2 : sortedArray[mid];

  if (len === 1) {
    median = sortedArray[0];
  }

  return { thawDays: thawDays, median: median };
}

// Calculate hourly winter wind statistics for every month from December to May
export function getWinterWindStats(speeds, directions) {
  var speedMeasurements = speeds.firstElementChild.getElementsByTagName("wml2:MeasurementTVP");
  var directionMeasurements = directions.firstElementChild.getElementsByTagName("wml2:MeasurementTVP");

  var maxWind = 0;
  var dayCount = 0;
  var directionX = 0;
  var directionY = 0;
  
  var directionIndex = 0;
  var speedIndex = 0;
  
  var previouslySavedDay = null;

  for (let i = 0; i < [speedMeasurements.length < directionMeasurements.length ? speedMeasurements.length : directionMeasurements.length]; i++) {
    let speed = Number(speedMeasurements[i].lastElementChild.innerHTML);

    let apiDate = new Date(directionMeasurements[i].getElementsByTagName("wml2:time")[0].innerHTML);
    apiDate.setHours(apiDate.getHours() + 2);
    let date = apiDate.toISOString().split("T")[0];

    if (speed > 10) {
      let direction = Number(directionMeasurements[i].lastElementChild.innerHTML);

      if (speed > maxWind) {
        maxWind = speed;
      }

      // There is no previous strong winds for this month
      if (previouslySavedDay === null) {
        ++dayCount;

        directionIndex = direction;
        speedIndex = speed;
      }

      // There is no previous strong winds for this day
      // If there are some statistics for previous days, these should be saved
      else if (date !== previouslySavedDay) {
        ++dayCount;

        // Add previous direction to direction sum from index
        directionX += Math.cos(toRadians(directionIndex));
        directionY += Math.sin(toRadians(directionIndex));

        directionIndex = direction;
        speedIndex = speed;
      }

      // There is already strong wind saved from this day
      // So check if wind speed has increased
      else {
        if (speed > speedIndex) {
          speedIndex = speed;
          directionIndex = direction;
        }
      }

      previouslySavedDay = date;
    }
  }

  // Get index statistics from previously saved day
  if (previouslySavedDay !== null && dayCount !== 0) {
    directionX += Math.cos(toRadians(directionIndex));
    directionY += Math.sin(toRadians(directionIndex));
  }

  return { maxWind: maxWind, strongWindDirectionX: directionX, strongWindDirectionY: directionY, strongWindDays: dayCount };
}

// Return verbal wind direction for degrees
export function getWindDirection(degrees) {
  const directions = ["pohjoinen", "koillinen", "itä", "kaakko", "etelä", "lounas", "länsi", "luode"];
  return directions[Math.round(degrees / 45) % 8];
}
