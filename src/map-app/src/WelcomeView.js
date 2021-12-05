/**
Welcome view of the application.
Has text that contains information about the application and a spot for sponsor logos.

Recent changes:

1.12 Emil Calonius
Created component

 **/

import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import welcomeText from "./welcome_text.txt";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "#292929",
    height: "100vh",
    display: "flex",
    flexFlow: "column"
  },
  textContainer: {
    overflowY: "scroll",
    marginRight: "50px",
    marginLeft: "50px",
    flex: 4
  },
  text: {
    color: "white",
    padding: "5px",
    display: "block",
    fontSize: 20,
    fontFamily: "Donau"
  },
  icon: {
    height: "89px",
    width: "144px",
  },
  iconContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  sponsorContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  sponsor: {
    width: "100px",
    height: "100px",
    padding: "10px"
  }
}));

function WelcomeView() {
  const [ text, setText ] = React.useState([]);

  React.useEffect(() => {
    // Reads the file welcome_text.txt located in the same folder
    // splits it on newlines and sets the "text"-variable as the resiulting array
    const readText = async () => {
      fetch(welcomeText)
        .then((r) => r.text())
        .then(text => setText(text.split("\n")));
    };
    readText();
  }, []);

  const styledClasses = useStyles();

  return(
    <Box className={styledClasses.root}>
      <Box className={styledClasses.iconContainer}>
        <img src="pallaksen_pollot_logo_white.png" alt="Pallaksen pöllöt logo" className={styledClasses.icon} />
      </Box>
      <Box className={styledClasses.textContainer}>
        {
          text.map((paragraph, index) => {
            return <Typography key={index} className={styledClasses.text}>{paragraph}</Typography>;
          })
        }
      </Box>
      <Box className={styledClasses.sponsorContainer}>
        {/* <a href="https://www.google.com/" target="_blank" rel="noopener noreferrer">
          <img src="sponsor.png" alt="Sponsor logo" className={styledClasses.sponsor} />
        </a>
        <a href="https://www.google.fi/maps/" target="_blank" rel="noopener noreferrer">
          <img src="sponsor2.png" alt="Sponsor logo" className={styledClasses.sponsor} />
        </a> */}
      </Box>
    </Box>
  );
}

export default WelcomeView;