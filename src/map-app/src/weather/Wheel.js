/**
Element to show weather data during past three days (wheel of weather)

Created: Oona Laitamaki

Latest update

31.10.2021 Oona Laitamaki
Create initial components for showing weather statistics

**/

import * as React from "react";
//import Typography from "@material-ui/core/Typography";

 
function Wheel({weatherState}) {
  console.log(weatherState);
  
  return (
    <div>
      {/* <Typography variant="subtitle1">{weatherState !== null && weatherState.temperature !== undefined ? `EXAMPLE: Average temperature two days ago ${weatherState.temperature.firstDayAverage}` : "NULL"}</Typography> */}
    </div>
  );
}
 
export default Wheel;