/**
Segmenttien hallintanäkymän runko


Luonut: Markku Nirkkonen 26.11.2020

Muutosloki:

Markku Nirkkonen 18.12.2020
Lisätty Käyttäjät välilehti ja samalla siirretty segmenttihallinnan
ja käyttäjähallinnan koodit omiin moduuleihinsa

Markku Nirkkonen 8.12.2020
Segmentin muokkaaminen (ei syötetarkistuksia) toimintakuntoinen

Markku Nirkkonen 6.12.2020
Alettu lisätä segmentin lisäystoimintoa

Markku Nirkkonen 4.12.2020
Segmentin poisto toimivaksi, lisätty varmistusdialogi poistamiseen

26.11.2020
Pohja, segmenttien listaus, segmentin poisto
Segmentin muokkaus ja niiden lisääminen puuttuu vielä

**/

import * as React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import SegmentManage from "./SegmentManage";
import UserManage from "./UserManage";


const useStyles = makeStyles(() => ({
  tabs: {
    display: "flex",
  },
  tabLinks: {
    margin: "auto"
  }
}));

function Manage(props) {

  const classes = useStyles();

  // Hooks
  const [showSegments, setShowSegments] = React.useState(true);
  const disabled = Boolean(showSegments);
  
  /*
   * Event handlers
   */

  // Näkymän vaihto käyttäjähallintaan
  const handleUser = () => {
    setShowSegments(false);
  };

  // Näkymän vaihto segmenttihallintaan
  const handleSegment = () => {
    setShowSegments(true);
  };

  // Renderöinti
  return (  
    <div>
      {/* Hallintanäkymän valinta käyttäjät / segmentit */}
      <Box className={classes.tabs}>
        <Button className={classes.tabLinks} disabled={disabled} onClick={handleSegment}>Segmentit</Button>
        <Button className={classes.tabLinks} disabled={!disabled} onClick={handleUser}>Käyttäjät</Button>      
      </Box>
      <Divider />

      {/* Näytetään muuttujan showSegments (boolean) mukaan joko segmenttienhallinta tai käyttäjienhallinta */}
      {
        showSegments 
          ? 
          <SegmentManage 
            segments={props.segments}
            token={props.token}
            onUpdate={props.onUpdate}
            updateSegments={props.updateSegments}
            shownSegment={props.shownSegment}
            updateWoods={props.updateWoods}
          /> 
          : 
          <UserManage token={props.token} role={props.role} />
      }
      <div style={{height: "60px"}}></div>
    </div>
  );
}

export default Manage;