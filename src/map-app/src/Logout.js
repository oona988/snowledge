/**
Uloskirjautumispainike ja sen toiminnallisuudet

Luonut: Markku Nirkkonen

Viimeisin päivitys
Markku Nirkkonen 26.11.2020
Suomennoksia, ei siis käytännön muutoksia

2.12.2020 Markku Nirkkonen
Korjattu niin, että uloskirjautuessa näkymä palaa karttaan

**/

import * as React from "react";
import Button from "@material-ui/core/IconButton";
// eslint-disable-next-line no-unused-vars
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
// eslint-disable-next-line no-unused-vars
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import SnowIcon from "@material-ui/icons/AcUnit";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(() => ({
  snowIcon: {
    position: "absolute",
    top: "5px",
    right: "5px"
  }
}));

function Logout(props) {
  // Hooks
  const [logoutOpen, setLogoutOpen] = React.useState(false);

  // Event handlers

  //Avaa kirjautumisdialogin
  const openLogout = () => {
    setLogoutOpen(true);
  };

  // Sulkee kirjautumisdialogin
  const closeLogout = () => {
    setLogoutOpen(false);
  };
   
  //  Uloskirjautuminen nollaa tokenin ja kirjautuneen käyttäjän
  const logout = () => {
    props.updateToken(null);
    props.updateUser(null);
    if (props.showManagement) {
      props.updateShown(0);
    }   
  };

  const styledClasses = useStyles();

  return (
    <div className="logout">
      <div className={styledClasses.snowIcon} >
        <IconButton 
          onClick={openLogout}
        >
          <SnowIcon style={{color: "#4d4d4d"}} />
        </IconButton>
      </div>
      <Dialog 
        onClose={closeLogout} 
        open={logoutOpen}
      >
        <DialogTitle id="logout-dialog">Kirjaudu ulos?</DialogTitle>
        <DialogActions>
          <Divider/>
          <Button id={"dialogClose"} onClick={closeLogout}>Peruuta</Button>
          <Button color="primary" id={"dialogOK"} onClick={logout}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );

}
 
export default Logout;
