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
    marginLeft: "50px"
  },
  text: {
    color: "white",
    padding: "5px",
    display: "block",
    fontSize: 20,
    fontFamily: "Donau"
  },
  icon: {
    height: "81px",
    width: "98px",
    marginRight: "auto",
    marginLeft: "auto",
    display: "block",
    padding: "20px"
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
      <img src="pollo.ico" alt="Pallaksen pöllöt logo" className={styledClasses.icon} />
      <Box className={styledClasses.textContainer}>
        {
          text.map((paragraph, index) => {
            return <Typography key={index} className={styledClasses.text}>{paragraph}</Typography>;
          })
        }
      </Box>
    </Box>
  );
}

export default WelcomeView;