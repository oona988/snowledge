/**
Segmenttien hallintanäkymä
Tarkoituksena listata segmentit, mahdollisuus suodattaa niitä hakemalla,
muokata, poistaa, lisätä.

Luonut: Markku Nirkkonen 26.11.2020

Muutosloki

10.1.2021 Markku Nirkkonen
Parannettu segmentien hallinnan ominaisuuksia, erityisesti segmentin muokkauksessa

Siirretty: Markku Nirkkonen 18.12.2020
Siirretty koodi omaan tiedostoonsa, ei toiminnallisia muutoksia

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
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddSegment from "./AddSegment";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const useStyles = makeStyles((theme) => ({
  segmentCard: {
    padding: theme.spacing(1),
    maxWidth: 400,
    margin: "auto",
    marginTop: 10
  },
  cardContainer: {
    flexGrow: 1,
    marginTop: 10,
  },

  coordinateInputs: {
    display: "flex"
  },
}));

function SegmentManage(props) {

  const classes = useStyles();

  // Hooks
  const [anchorElMenu, setAnchorElMenu] = React.useState(null); 
  const [selected, setSelected] = React.useState(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [name, setName] = React.useState(null);
  const [terrain, setTerrain] = React.useState(null);
  const [danger, setDanger] = React.useState(null);
  const [initials, setInitials] = React.useState(null);
  const [points, setPoints] = React.useState(null);
  
  const menuOpen = Boolean(anchorElMenu);
  
  /*
   * Event handlers
   */

  // Haetaan ajantasaiset segmenttien tiedot heti päivittämisen jälkeen
  const fetchData = async () => {
    const snow = await fetch("api/lumilaadut");
    const snowdata = await snow.json();
    const updates = await fetch("api/segments/update");
    const updateData = await updates.json();
    const response = await fetch("api/segments");
    const data = await response.json();
    
    
    await updateData.forEach(update => {
      snowdata.forEach(snow => {
        if (snow.ID === update.Lumilaatu_ID1) {
          update.Lumi1 = snow;
        }
        else if (snow.ID === update.Lumilaatu_ID2) {
          update.Lumi2 = snow;
        }
        else if (snow.ID === update.Toissijainen_ID1) {
          update.Lumi3 = snow;
        }
        else if (snow.ID === update.Toissijainen_ID2) {
          update.Lumi4 = snow;
        }
      });
    });
    
    data.forEach(segment => {
      segment.update = null;
      updateData.forEach(update => {
        if (update.Segmentti === segment.ID) {
          segment.update = update;           
        }
      });
    });

    props.updateSegments(data);

  };

  // Segmentin valikon avaaminen, tarkentaa samalla valitun segmentin 
  const handleMenu = (event, item) => {
    props.onUpdate(item);
    setSelected(item);
    setPoints(item.Points);
    setName(item.Nimi);
    setDanger(item.Lumivyöryvaara);
    setTerrain(item.Maasto);
    
    // Alkuperäisten arvojen alustaminen muutosten perumista varten
    if (!editOpen) {
      var initialName = item.Nimi;
      var initialTerrain = item.Maasto;
      var initialDanger = item.Lumivyöryvaara;
      var initialPoints = item.Points.map(i => {
        return ({lat: i.lat, lng: i.lng});
      });
      setInitials(
        {
          Nimi: initialName,
          Maasto: initialTerrain,
          Lumivyöryvaara: initialDanger,
          Points: initialPoints
        }
      );
    }
    setAnchorElMenu(event.currentTarget);
  };
    
  // Menun sulkeminen nollaa valitut segmentit
  const handleMenuClose = () => {
    setAnchorElMenu(null);
    setSelected(null);
    props.onUpdate(null);
    setPoints(null);
    setInitials(null);
  };
  
  // Segmentin poiston api-kutsu
  const handleDelete = () => {
    const fetchDelete = async () => {
      await fetch("api/segment/" + selected.ID,
        {
          method: "DELETE",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token
          }
        });
      
      // Tieto metsäsegmentin poistosta huomioidaan
      if (selected.Nimi === "Metsä") {
        props.updateWoods(null);
      }
    };
    fetchDelete();

    fetchData();

    closeDelete();
  };
  
  // avataan segmentin poistodialogi
  const openDelete = () => {
    setDeleteOpen(true);
  };

  // Suljetaan poistodialogi ja nollataan segmentin valinta
  const closeDelete = () => {
    setAnchorElMenu(null);
    setDeleteOpen(false);
    setSelected(null);
    props.onUpdate(null);
    setPoints(null);
    setInitials(null);
  };

  // Käsitellää segmentin muokkaus
  // TODO: syötteiden tarkistukset jollakin tavalla? 
  const handleEdit = () => {
    
    // Tiedot  tulevat hookeista
    const data = {
      Nimi: name,
      Maasto: terrain,
      Lumivyöryvaara: danger,
      Points: points,
      ID: selected.ID
    };

    // Segmentin muokkaamisen api-kutsu
    const fetchEditSegment = async () => {
      const response = await fetch("api/segment/"+selected.ID,
        {
          method: "PUT",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token
          },
          body: JSON.stringify(data),
        });
      const res = await response.json();
      console.log(res);
    };
    fetchEditSegment();

    fetchData();
    setAnchorElMenu(null);
    closeEdit();
  };

  // Avataan muokkausdialogi
  const openEdit = () => {
    setEditOpen(true);
  };

  // Kun muokkausdialogi suljetaan, nollataan valinnat ja suljetaan dialogi
  const closeEdit = () => {
    setPoints(null);
    setInitials(null);
    setAnchorElMenu(null);
    setEditOpen(false);
    setSelected(null);
    props.onUpdate(null);
  };

  const updateName = (event) => {
    if (event.target.value === "") {
      setName(initials.Nimi);
    } else {
      setName(event.target.value);
    }
  };

  // Segmentin maastopohjan kuvauksen päivittäminen
  const updateTerrain = (event) => {
    if (event.target.value === "") {
      setTerrain(initials.Maasto);
    } else {
      setTerrain(event.target.value);
    }
  };

  // Lumivyöryvaaran vaihtamienn
  const updateDanger = () => {
    if (danger === null) {
      setDanger(!initials.Lumivyöryvaara);
    } else {
      setDanger(!danger);
    }  
  };

  // Koordinaattipisteiden päivittäminen
  const updatePoints = (index, latOrLng, event) => {
    const pointsNow = [...points];
    if (latOrLng === "lat") {
      
      // Kentän tyhjentäminen kokonaan palauttaa oletusarvon
      if (event.target.value === "") {
        pointsNow[index].lat = parseFloat(initials.Points[index].lat);
      } else {
        pointsNow[index].lat = parseFloat(event.target.value);
      }
    }
    if (latOrLng === "lng") {
      
      // Kentän tyhjentäminen kokonaan palauttaa oletusarvon
      if (event.target.value === "") {
        pointsNow[index].lng = parseFloat(initials.Points[index].lng);
      } else {
        pointsNow[index].lng = parseFloat(event.target.value);
      }
    }
    setPoints(pointsNow);
  };
  
  // Koordinaattipisterivin lisääminen muokkauslomakkeelle (lisäpiste koordinaateille)
  const addNewRow = () => {
    setPoints([...points].concat({lat: null, lng: null}));
  };

  // Koordinaattipisterivin poistaminen
  const removeRow = (index) => {
    setPoints([...points].slice(0, index).concat([...points].slice(index + 1, points.length)));
  };

  // Renderöinti
  return (  
    <div>

      {/* Painike, mistä voi lisätä segmentin */}
      <Box>
        <AddSegment 
          id={null} 
          addSubSegment={false} 
          token={props.token} 
          segments={props.segments} 
          updateSegments={props.updateSegments} 
          updateWoods={props.updateWoods}
        />
      </Box>
      
      {/* Segmenttikortit */}
      <Box className={classes.cardContainer}>
        <Grid container spacing={0}> 
          
          {/* Luodaan jokaiselle segmentille oma kortti */}
          {
            props.segments.map((item, index) => {
              return (
                <Grid key={index} item xs={12} sm={4}>
                  <Card className={classes.segmentCard}>
                    <CardHeader 
                      title={item.Nimi}
                      subheader={"Pohjamaasto: " + item.Maasto}
                      action={
                        <IconButton id={item.ID} aria-label="close" onClick={(event) => handleMenu(event, item)}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                    />

                    
                    
                    {/* Valikko kortin lisätoiminnoille */}
                    <Menu           
                      anchorEl={anchorElMenu}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={menuOpen}
                      onClose={handleMenuClose}
                    > 
                      
                      
                      <MenuItem onClick={openEdit}>
                        Muokkaa
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={() => openDelete()}>
                        Poista
                      </MenuItem>
                      
                    </Menu>

                    {/* Segmenttikortti sisältää mahdollisen teidon lumivyöryvaarasta,
                    mahdollisen segmentin lisäysnapin tai tiedon siitä, että kyseessä on alasegmentti */}
                    <CardContent>

                      {item.Lumivyöryvaara ? <Typography variant="body1" color="textSecondary" align="left" component="p">Lumivyöryherkkä alue</Typography> : null}

                      <Typography variant="body1" color="textSecondary" align="left" component="p">
                        {item.On_Alasegmentti !== null ? "Segmentin "+ item.On_Alasegmentti +" alasegmentti" : ""}
                      </Typography>

                      {/* Alasegmentin lisäys mahdollinen, jos kyseessä yläsegmentti */}
                      {
                        item.On_Alasegmentti === null 
                          ?                    
                          <AddSegment 
                            id={item.ID} 
                            addSubSegment={true} 
                            token={props.token} 
                            segments={props.segments} 
                            updateSegments={props.updateSegments} 
                            updateWoods={props.updateWoods}
                          />
                          :
                          <div />
                      }

                    </CardContent>
                  </Card>
                  
                </Grid>
              );
            })
          }  
        </Grid>   
      </Box>
    
      {/* Segmentin poistodialogi */}
      <Dialog 
        onClose={closeDelete} 
        open={deleteOpen}
      >
        <DialogTitle id="delete_segment">Poista segmentti?</DialogTitle>
        <Typography>Segmentin poistaminen poistaa segmentin, alasegmentin ja kaikki niihin liittyvät tiedot. Poista?</Typography>
        <DialogActions>
          <Divider />
          <Button id={"deleteClose"} onClick={closeDelete}>Sulje</Button>
          <Button variant="contained" color="primary" id={"delete"} onClick={handleDelete}>Poista</Button>
        </DialogActions>
    
      </Dialog>
    
      {/* Muokkausdialogi (lomake) */}
      <Dialog 
        onClose={closeEdit} 
        open={editOpen}
      >
        <DialogTitle id="edit_segment">Muokkaa segmenttiä</DialogTitle>
        <Typography id="edit_segment_info" variant="caption">Jätä muuttamattomaksi kohdat, joita et aio muokata</Typography>
        <FormControl>  
          <InputLabel htmlFor="name" >Muuta nimeä</InputLabel>
          <Input
            id="name"
            type='text'
            onChange={updateName}
            placeholder={props.shownSegment !== null ? props.shownSegment.Nimi : ""}
          />
        </FormControl>
        <FormControl>  
          <InputLabel htmlFor="terrain" >Muuta maastopohjaa</InputLabel>
          <Input
            id="terrain"
            type='text'
            onChange={updateTerrain}
            placeholder={props.shownSegment !== null ? props.shownSegment.Maasto : ""}
          />
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox            
              checked={danger}
              onChange={updateDanger}
              name="danger"
              color="primary"
            />
          }
          label="Lumivyöryriskialue"
        />

        {
          points !== null 
            ?
            points.map((item, index) => {
              return (
                <Box key={index} className={classes.coordinateInputs}>
                  <FormControl>  
                    <InputLabel htmlFor={"lat"+index} >{item.lat !== null ? item.lat : "Anna koordinaatti"}</InputLabel>
                    <Input
                      id={"lat"+index}
                      type='text'
                      placeholder={item.lat !== null ? item.lat : "Anna koordinaatti"}
                      onChange={(event) => updatePoints(index, "lat", event)}
                    />
                  </FormControl>
                  <FormControl>  
                    <InputLabel htmlFor={"lng"+index} >{item.lng !== null ? item.lng : "Anna koordinaatti"}</InputLabel>
                    <Input
                      id={"lng"+index}
                      type='text'
                      placeholder={item.lng !== null ? item.lng : "Anna koordinaatti"}
                      onChange={(event) => updatePoints(index, "lng", event)}
                    />
                  </FormControl>
            
                  <IconButton id="remove_points" aria-label="remove_points" onClick={() => removeRow(index)}>
                    <RemoveCircleOutlineIcon />
                  </IconButton>

                </Box>
              );})
            :
            <div />
        }

        <Box className={classes.addNewLine}>
          <IconButton id="add_new_points" aria-label="add_new_points" onClick={addNewRow}>
            <AddCircleOutlineIcon />
            <Typography variant="button">Lisää piste</Typography>
          </IconButton>
        </Box>
        <DialogActions>
          <Divider />
          <Button id={"editClose"} onClick={closeEdit}>Sulje</Button>
          <Button variant="contained" color="primary" id={"save_edit"} onClick={handleEdit} >Tallenna muutokset</Button>
        </DialogActions>
      
      </Dialog>
    </div>
  );
}

export default SegmentManage;