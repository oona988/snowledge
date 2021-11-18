/**
Creation of map with maplibre-gl-library

Latest updates:

Emil Calonius 4.11
Create map with maplibre-gl
Setting bounds and max and min zoom levels
Drawing of segments

Emil Calonius 7.11
Segment highlighting
Subsegment filter
segment coloring based on snowtype

Emil Calonius 13.11
Bugfixes and improvements to segment coloring
Added different bounds on mobile and large screen

 **/
import React, { useRef, useEffect, useState, useMemo } from "react";
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

var map;

function PallasMap(props) {
  const mapContainerRef = useRef(null); 
  const styledClasses = useStyles();

  const [data, setData] = useState({type: "FeatureCollection", features: []});
  const [refreshMap, setRefreshMap] = useState(false);
  const [segmentArray, setSegmentArray] = useState([]);

  const center = [24.05, 68.069];
  const bounds = props.isMobile ? [[23.849004, 68.000000], [24.240507, 68.142811]] : [[23.556208, 67.988229], [24.561503, 68.162280]];

  useMemo(() => {
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
    console.log("segments -->");
    console.log(segments);

    function getCoordinates(id) {
      let coordinates = [];
      let segment = segments.find(item => item.ID === id);
      console.log(segment);
      coordinates.push(segment.Points.map(point => {
        return [point.lng, point.lat];
      }));

      if(segment.Nimi === "Metsä") {
        let index = segments.indexOf(segment);
        console.log(index);
        let newSegments = [...segments];
        newSegments.splice(index, 1);
        console.log("new segments -->");
        console.log(newSegments);
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
        console.log("UnifiedSegment -->");
        console.log(unifiedSegment);
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
            "snowId": item.update !== null ? item.update.Lumi.ID : 0
          },
          "id": item.ID
        };
      })
    });
  }, [props.segments]);

  useEffect(() => {
    if((data.features.length > 0 && map === undefined) || refreshMap) {
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: center,
        zoom: props.zoom,
        maxBounds: bounds,
        maxZoom: 15,
        minZoom: 11,
      });
    }

    if(map != undefined) {
      map.on("load", function () {
        // Add geojson as source for layers
        console.log(data);
        if(map.getSource("segments-source") === undefined) {
          map.addSource("segments-source", {
            type: "geojson",
            data: data
          });
        }

        // An array that specifies which color layers paint property needs to paint a certain segment
        const fillColor = ["match", ["get", "snowId"]];
        console.log(props.segmentColors);
        for(let i = 1; i <= props.segmentColors.length-3; i++) {
          fillColor.push(i);
          fillColor.push(props.segmentColors[i].color);
        }
        fillColor.push("#000000");

        // Layer for segment fills
        if(map.getLayer("segments-fills") === undefined) {
          map.addLayer({
            id: "segments-fills",
            source: "segments-source",
            type: "fill",
            layout: {},
            paint: {
              "fill-color": fillColor,
              // Opacity is dependant on the segments hover feature state
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.6,
                0.15
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
              "fill-opacity": 0.6
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

        // Add a scale bar to the bottom right of the map
        const scaleControl = new maplibregl.ScaleControl({ maxWidth: 100, unit: "metric"});
        if(map.hasControl(scaleControl) === false) {
          map.addControl(scaleControl, "bottom-right");
        }

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
        // Add a filter so that only subsegments get rendered
        if(props.subsOnly) {
          map.setFilter("segments-fills", ["==", ["get", "subsegment"], true]);
          map.setFilter("segments-outlines", ["==", ["get", "subsegment"], true]);
        }

        // Remove the filters set above if all segments should be visible
        if(!props.subsOnly) {
          map.setFilter("segments-fills", null);
          map.setFilter("segments-outlines", null);
        }

        // Hide segments-highlighted layer and remove filter from segments-highlight layer if no segment is currently selected
        if(props.shownSegment === null) {
          map.setFilter("segments-selected", ["==", ["get", "segmentId"], 0]);
          if(!props.subsOnly) map.setFilter("segments-fills", null);
        }
      }
      setRefreshMap(false);
    }
  }, [data, props.subsOnly, props.shownSegment, refreshMap]);

  // Ensure that map refreshes when user leaves management view
  useEffect(() => {
    if(data.features.length > 0) {
      setRefreshMap(true);
    }
  }, [props.viewManagement]);

  return (
    <div className={styledClasses.mapContainer} ref={mapContainerRef} />
  );
}

export default PallasMap;