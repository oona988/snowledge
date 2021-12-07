/**
Bottom navigation bar of the application.
Choose between map, snowtype information and weather information.

Recent changes:

29.11 Emil Calonius
Created component

 **/

import * as React from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import MapIcon from "@material-ui/icons/Map";
import InfoIcon from "@material-ui/icons/Info";
import CloudIcon from "@material-ui/icons/Cloud";
import { makeStyles } from "@material-ui/core/styles";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";


const useStyles = makeStyles(() => ({
  navbar: {
    display: "flex",
    height: "55px",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    position: "absolute",
    bottom: 0,
    width: "75vw"
  }
}));

const navBarTheme = createTheme({
  palette: {
    primary: {
      main: "#ed7a72"
    },
    text: {
      secondary: "#a1a1a1"
    }
  }
});

function BottomNav(props) {
  // Hooks
  const [value, setValue] = React.useState(0);

  // Use styles
  const styledClasses = useStyles();

  if(props.user === null) {
    return(
      <ThemeProvider theme={navBarTheme}>
        <BottomNavigation
          className={styledClasses.navbar}
          showLabels
          value={value}
          // eslint-disable-next-line no-unused-vars
          onChange={(event, newValue) => {
            setValue(newValue);
            props.updateShown(newValue);
          }}
        >
          <BottomNavigationAction
            className={styledClasses.button}
            label="Kartta"
            icon={<MapIcon />}
          />
          <BottomNavigationAction
            className={styledClasses.button}
            label="Selitteet"
            icon={<InfoIcon />}
          />
          <BottomNavigationAction
            className={styledClasses.button}
            label="Sää"
            icon={<CloudIcon />}
          />
        </BottomNavigation>
      </ThemeProvider>
    );
  }
  else {
    return (
      <ThemeProvider theme={navBarTheme}>
        <BottomNavigation
          className={styledClasses.navbar}
          showLabels
          value={value}
          // eslint-disable-next-line no-unused-vars
          onChange={(event, newValue) => {
            setValue(newValue);
            props.updateShown(newValue);
          }}
        >
          <BottomNavigationAction
            className={styledClasses.button}
            label="Kartta"
            icon={<MapIcon />}
          />
          <BottomNavigationAction
            className={styledClasses.button}
            label="Info"
            icon={<InfoIcon />}
          />
          <BottomNavigationAction
            className={styledClasses.button}
            label="Sää"
            icon={<CloudIcon />}
          />
          <BottomNavigationAction
            className={styledClasses.button}
            label="Hallitse"
            icon={<SettingsIcon />}
          />
        </BottomNavigation>
      </ThemeProvider>
    );
  }
}

export default BottomNav;
