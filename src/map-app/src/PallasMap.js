/**
Creation of map with maplibre-gl-library

Latest updates:

Emil Calonius 15.12
Disable map rotation

Emil Calonius 18.11
Forest segment covers the whole visible map except other segments

Emil Calonius 13.11
Bugfixes and improvements to segment coloring
Added different bounds on mobile and large screen
When a segment is highlighted, subsegments inside it don't get highlighted

Emil Calonius 7.11
Segment highlighting
Subsegment filter
segment coloring based on snowtype

Emil Calonius 4.11
Create map with maplibre-gl
Setting bounds and max and min zoom levels
Drawing of segments

 **/

import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import mapStyle from "./pallas_map";
import { makeStyles } from "@material-ui/core/styles";
import "maplibre-gl/dist/maplibre-gl.css";
import union from "@turf/union";

const useStyles = makeStyles(() => ({
  mapContainer: {
    width: "100%",
    height: "100%",
  },
}));

let map;

function PallasMap(props) {
  const mapContainerRef = useRef(null); 
  const styledClasses = useStyles();

  const [data, setData] = useState({type: "FeatureCollection", features: []});
  const [segmentArray, setSegmentArray] = useState([]);

  const center = [24.05, 68.069];
  const bounds = props.isMobile ? [[23.849004, 68.000000], [24.240507, 68.142811]] : [[23.556208, 67.988229], [24.561503, 68.162280]];

  useEffect(() => {
    // Create an array of the segments so that first comes woods segment, second normal segments and last subsegments
    // This ensures that subsegments get drawn on top of other segments
    let woodsSegments = [];
    let normalSegments = [];
    let subSegments = [];
    props.segments.forEach(segment => {
      if(segment.Nimi === "Metsä") {
        woodsSegments.push(segment);
      } else if(segment.On_Alasegmentti != null) {
        subSegments.push(segment);
      } else {
        normalSegments.push(segment);
      }
    });
    let noWoodsSegments = normalSegments.concat(subSegments);
    let segments = woodsSegments.concat(noWoodsSegments);
    setSegmentArray(segments);

    // Gets the coordinates for the geometry of a segment
    // If segemnts has a subsegment add it as a hole to the segment
    // For forest segment add the union of all other segments as a hole
    function getCoordinates(id) {
      let coordinates = [];
      let segment = segments.find(item => item.ID === id);
      coordinates.push(segment.Points.map(point => {
        return [point.lng, point.lat];
      }));

      if(segment.Nimi === "Metsä") {
        let index = segments.indexOf(segment);
        let newSegments = [...segments];
        newSegments.splice(index, 1);
        let unifiedSegment = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [newSegments[0].Points.map(point => {
              return [point.lng, point.lat];
            })]
          },
          properties: {}
        };
        let otherSegment = {};
        for(let i = 1; i<newSegments.length;i++) {
          otherSegment = {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [newSegments[i].Points.map(point => {
                return [point.lng, point.lat];
              })]
            },
            properties: {}
          };
          unifiedSegment = union(unifiedSegment, otherSegment);
        }
        coordinates.push(unifiedSegment.geometry.coordinates[0]);
      } else {
        if(segment.On_Alasegmentti === null) {
          segments.forEach(item => {
            if(item.On_Alasegmentti === segment.Nimi) {
              coordinates.push(item.Points.map(point => {
                return [point.lng, point.lat];
              }));
            }
          });
        }
      }

      return coordinates;
    }
    // Create a geojson feature collection that the segments are drawn from
    setData({
      "type": "FeatureCollection",
      "features": segments.map(item => {
        return {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": getCoordinates(item.ID)
          },
          "properties": {
            "name": item.Nimi,
            "subsegment": item.On_Alasegmentti === null ? false : true,
            "segmentId": item.ID,
            "snowId1": item.update !== null ? (item.update.Lumi1 !== undefined ? item.update.Lumi1.ID : 0) : 0,
            "snowId2": item.update !== null ? (item.update.Lumi2 !== undefined ? item.update.Lumi2.ID : 0) : 0
          },
          "id": item.ID
        };
      })
    });
  }, [props.segments]);

  useEffect(() => {
    if((data.features.length > 0 && map === undefined)) {
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: center,
        zoom: props.zoom,
        maxBounds: bounds,
        maxZoom: 15,
        minZoom: 11,
        maxPitch: 0,
        dragRotate: false,
      });
    }

    if(map != undefined) {
      map.on("load", function () {
        // Add geojson as source for layers
        if(map.getSource("segments-source") === undefined) {
          map.addSource("segments-source", {
            type: "geojson",
            data: data
          });
        }

        // An array that specifies which color layers paint property needs to paint a certain segment
        const fillColor = ["match", ["get", "snowId1"]];
        for(let i = 0; i <= props.segmentColors.length-1; i++) {
          fillColor.push(i+1);
          fillColor.push(props.segmentColors[i].color);
        }
        fillColor.push("#000000");

        // Layer for segment highlights
        if(map.getLayer("segments-highlights") === undefined) {
          map.addLayer({
            id: "segments-highlights",
            source: "segments-source",
            type: "fill",
            layout: {},
            paint: {
              "fill-color": fillColor,
              // Opacity is dependant on the segments hover or highlight feature state
              "fill-opacity": 0.3
            },
            filter: ["==", ["get", "segmentId"], 0]
          });
        }

        // Layer for segment fills

        if(map.getLayer("segments-fills") === undefined) {
          map.addLayer({
            id: "segments-fills",
            source: "segments-source",
            type: "fill",
            layout: {},
            paint: {
              "fill-color": fillColor,
              // Opacity is dependant on the segments hover or highlight feature state
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.3,
                0
              ]
            }
          });
        }

        // Layer for selected segment
        if(map.getLayer("segments-selected") === undefined) {
          map.addLayer({
            id: "segments-selected",
            source: "segments-source",
            type: "fill",
            layout: {},
            paint: {
              "fill-color": fillColor,
              "fill-opacity": 0.3
            },
            filter: ["==", ["get", "segmentId"], 0]
          });
        }

        // Layer for segment outlines
        if(map.getLayer("segments-outlines") === undefined) {
          map.addLayer({
            id: "segments-outlines",
            source: "segments-source",
            type: "line",
            layout: {},
            paint: {
              "line-color": "#000000",
              "line-width": 1.15
            }
          });
        }

        // Disable map rotation using touch rotation gesture
        map.touchZoomRotate.disableRotation();

        // Add a scale bar to the bottom right of the map
        map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: "metric"}), "bottom-right");

        //Geolocation control
        map.addControl(new maplibregl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }), "bottom-right");

        // When user hovers over a segment, update its hover feature state to true
        var hoveredSegmentId = null;
        map.on("mousemove", "segments-fills", function (e) {
          map.getCanvas().style.cursor = "pointer";
          if (e.features.length > 0) {
            if (hoveredSegmentId) {
              map.setFeatureState(
                { source: "segments-source", id: hoveredSegmentId },
                { hover: false }
              );
            }
            hoveredSegmentId = e.features[0].id;
            map.setFeatureState(
              { source: "segments-source", id: hoveredSegmentId },
              { hover: true }
            );
          }
        });

        // When mouse leaves the segments-fills layer, update hover feature state of latest segment hovered to false
        map.on("mouseleave", "segments-fills", function () {
          map.getCanvas().style.cursor = "";
          if (hoveredSegmentId) {
            map.setFeatureState(
              { source: "segments-source", id: hoveredSegmentId },
              { hover: false }
            );
          }
          hoveredSegmentId = null;
        });

        // When a segment is clicked send it to NewMap.js to update chosen segment and filter segment-highlights layer so that selected segment is shown
        map.on("click", "segments-fills", function (e) {
          props.chosenSegment(segmentArray.find(item => item.ID === e.features[0].id));
          map.setFilter("segments-selected", ["==", ["get", "segmentId"], e.features[0].id]);
          // Filter out the selected segment from segments-fills layer when it is visible in segments-highlight layer
          // If only subsegments should be shown, filter out segments that are not subsegments
          if(map.getFilter("segments-fills") === undefined) {
            map.setFilter("segments-fills", ["!=", ["get", "segmentId"], e.features[0].id]);
          } else {
            if(JSON.stringify(map.getFilter("segments-fills")) === JSON.stringify(["==", ["get", "subsegment"], true]) || 
            map.getFilter("segments-fills")[0] === "all") {
              map.setFilter("segments-fills", ["all", ["!=", ["get", "segmentId"], e.features[0].id], ["==", ["get", "subsegment"], true]]);
            }
            else {
              map.setFilter("segments-fills", ["!=", ["get", "segmentId"], e.features[0].id]);
            }
          }
        });
        
      });

      if(map.isStyleLoaded()) {
        // Add a filter so that only subsegments get highlighted
        if(props.highlightedSnowType === -1) {
          map.setFilter("segments-highlights", ["==", ["get", "subsegment"], true]);
        }

        // Add a filter so that only a certain snowtype gets highlighted
        if(props.highlightedSnowType > -1) {
          map.setFilter("segments-highlights", ["any", ["==", ["get", "snowId1"], props.highlightedSnowType], ["==", ["get", "snowId2"], props.highlightedSnowType]]);
        }

        // Make highligt layer completely visible
        if(props.highlightedSnowType === -2) {
          map.setFilter("segments-highlights", null);
        }

        // Remove the filters set above if all segments should be visible
        if(props.highlightedSnowType === -3) {
          map.setFilter("segments-highlights", ["==", ["get", "segmentId"], 0]);
        }

        // Hide segments-highlighted layer and remove filter from segments-highlight layer if no segment is currently selected
        if(props.shownSegment === null) {
          map.setFilter("segments-selected", ["==", ["get", "segmentId"], 0]);
          if(!props.subsOnly) map.setFilter("segments-fills", null);
        }
      }
    }
  }, [data, props.subsOnly, props.shownSegment, props.highlightedSnowType]);

  return (
    <div className={styledClasses.mapContainer} ref={mapContainerRef} />
  );
}

export default PallasMap;