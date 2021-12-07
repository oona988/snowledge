/**
Kirjautumispainike ja sen toiminnallisuus

Luonut: Markku Nirkkonen

Viimeisin päivitys

Markku Nirkkonen 26.11.2020
Suomennoksia, ei siis käytännön muutoksia

Markku Nirkkonen 17.11.
Pieniä muotoiluseikkoja säädetty

**/

import * as React from "react";
import IconButton from "@material-ui/core/IconButton";
// eslint-disable-next-line no-unused-vars
import VpnKeyIcon from "@material-ui/icons/VpnKey";
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
// eslint-disable-next-line no-unused-vars
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
// eslint-disable-next-line no-unused-vars
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import SnowIcon from "@material-ui/icons/AcUnit";

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
  }
}));


function Login(props) {

  // Hooks
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginOpen, setLoginOpen] = React.useState(false);

  /*
   * Event handlers
   */
  
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
      console.log(res.user);
      props.updateUser(res.user);
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
            <SnowIcon style={{color: "#4d4d4d"}} />
          </IconButton>}
      </div>
      
      {/* Kirjautumisdialogi */}
      <Dialog 
        onClose={closeLogin} 
        open={loginOpen}
      >
        <DialogTitle id="login-dialog">Kirjaudu sisään</DialogTitle>
        <TextField id="email" label="email" value={email} onChange={updateEmail} className={styledClasses.email}/>
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
    </div>
  );

}
 
export default Login;
