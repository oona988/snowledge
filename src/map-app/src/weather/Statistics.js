/**
Element to show long term and average weather statistics

Created: Oona Laitamaki

Latest update

31.10.2021 Oona Laitamaki
Create initial components for showing weather statistics

**/

import * as React from "react";
import {toDegrees} from "./DataCalculations";

 
function Statistics({weatherState}) {


  return (
    <div>
      <p style={{display: "none"}}>{toDegrees(Math.atan2(weatherState.winter.strongWindDirectionY, weatherState.winter.strongWindDirectionX))}</p>
    </div>
  );
}
 
export default Statistics;