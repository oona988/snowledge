/**
Element to show weather data during past three days (wheel of weather)

Created: Oona Laitamaki

Latest update

31.10.2021 Oona Laitamaki
Create initial components for showing weather statistics

**/

import * as React from "react";

 
function Wheel({weatherState}) {
  console.log(weatherState);
  
  return (
    <div>
      <p style={{display: "none"}}>{weatherState.temperature.threeDaysAverage}</p>
    </div>
  );
}
 
export default Wheel;