/**
Kirjautumispainike ja sen toiminnallisuus

Luonut: Markku Nirkkonen

Viimeisin päivitys

Emil Calonius 11.12
Lisätty Snackbar ilmoitus kirjautumisen epäonnistuessa

Markku Nirkkonen 26.11.2020
Suomennoksia, ei siis käytännön muutoksia

Markku Nirkkonen 17.11.
Pieniä muotoiluseikkoja säädetty

**/

import * as React from "react";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import SnowIcon from "@material-ui/icons/AcUnit";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import CloseIcon from "@material-ui/icons/Close";

// Tyylejä sisäänkirjautumislomakkeen osille
const useStyles = makeStyles((theme) => ({
  password: {
    padding: theme.spacing(2),
  },
  email: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  snowIcon: {
    position: "absolute",
    top: "5px",
    right: "5px"
  },
  snackbar: {
    position: "absolute",
    bottom: "130px"
  }
}));


function Login(props) {

  // Hooks
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginOpen, setLoginOpen] = React.useState(false);
  // State of snackbar
  const [open, setOpen] = React.useState(false);

  /*
   * Event handlers
   */

  // eslint-disable-next-line no-unused-vars
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  //Avaa kirjautumisdialogin
  const openLogin = () => {
    setLoginOpen(true);
  };

  // Sulkee kirjautumisdialogin
  const closeLogin = () => {
    setLoginOpen(false);
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const updateEmail = (event) => {
    setEmail(event.target.value);
  };

  const updatePassword = (event) => {
    setPassword(event.target.value);
  };

  // Kun lomake lähetetään, tehdään POST-kutsu api/user/login
  const sendForm = () => {
    const data = {
      Sähköposti: email,
      Salasana: password,
    };
    const fetchLogin = async () => {
      setLoading(true);
      const response = await fetch("api/user/login",
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data),
        });
      const res = await response.json();

      props.updateToken(res.token);
      props.updateUser(res.user);
      if(res.user === undefined) setOpen(true);
      setLoading(false);
    };
    fetchLogin();
    closeLogin();
  };

  const styledClasses = useStyles();

  return (
    <div className="login">
      {/* Kirjautumisen avaava ikonipainike */}
      <div className={styledClasses.snowIcon} >
        {loading ? <CircularProgress color="secondary" size={20} /> :
          <IconButton
            onClick={openLogin}
          >
            {/* <Typography variant="button">{(loading ? "Kirjaudutaan" : "Kirjaudu")}</Typography>
            {(loading ? <CircularProgress color="secondary" size={20} /> : <VpnKeyIcon />)} */}
            <SnowIcon style={{ color: "#4d4d4d" }} />
          </IconButton>}
      </div>

      {/* Kirjautumisdialogi */}
      <Dialog
        onClose={closeLogin}
        open={loginOpen}
      >
        <DialogTitle id="login-dialog">Kirjaudu sisään</DialogTitle>
        <TextField id="email" label="email" value={email} onChange={updateEmail} className={styledClasses.email} />
        <FormControl className={styledClasses.password}>
          <InputLabel htmlFor="standard-adornment-password" className={styledClasses.password}>Salasana</InputLabel>
          <Input
            id="standard-adornment-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={updatePassword}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <DialogActions>
          <Divider />
          <Button id={"dialogClose"} onClick={closeLogin}>Sulje</Button>
          <Button variant="contained" color="primary" id={"dialogOK"} onClick={sendForm}>Kirjaudu</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        className={styledClasses.snackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <SnackbarContent
          style={{backgroundColor: "#ed7a72", color: "black"}}
          message="Virheellinen sähköposti tai salasana!" 
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>
    </div>
  );

}

export default Login;
