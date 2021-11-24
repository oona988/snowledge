/**
Element to show long term and average weather statistics

Created: Oona Laitamaki

Latest update

31.10.2021 Oona Laitamaki
Create initial components for showing weather statistics

**/

import * as React from "react";

 
function Statistics({weatherState}) {

  return (
    <div>
      <p style={{display: "none"}}>{weatherState !== null && weatherState.temperature !== undefined && weatherState.temperature.threeDaysAverage !== undefined ? weatherState.temperature.threeDaysAverage: "Lataa"}</p>
    </div>
  );
}
 
export default Statistics;