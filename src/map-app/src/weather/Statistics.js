/**
Element to show long term and average weather statistics

Created: Oona Laitamaki

Latest update

31.10.2021 Oona Laitamaki
Create initial components for showing weather statistics

**/

import * as React from "react";
//import Typography from "@material-ui/core/Typography";

 
function Statistics({weatherState}) {
  console.log(weatherState);

  return (
    <div>
      {/* <Typography variant="subtitle1">{weatherState !== null && weatherState.winddirection !== undefined ? `EXAMPLE: Three day average of wind direction ${weatherState.winddirection.threeDaysAverage}` : "NULL"}</Typography> */}
    </div>
  );
}
 
export default Statistics;