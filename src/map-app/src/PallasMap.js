/**
Creation of map with maplibre-ui-library

Latest updates:

Emil Calonius 4.11
Create map with maplibre-gl
Setting bounds and max and min zoom levels
Drawing of segments

Emil Calonius 7.11
Segment highlighting
Subsegment filter
segment coloring based on snowtype

 **/
import React, { useRef, useEffect, useState, useMemo } from "react";
import maplibregl from "maplibre-gl";
import mapStyle from "./pallas_map";
import { makeStyles } from "@material-ui/core/styles";
import "maplibre-gl/dist/maplibre-gl.css";

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

  const center = [24.05, 68.069];
  const bounds = [[23.556208, 67.988229], [24.561503, 68.162280]];

  useMemo(() => {
    setData({
      "type": "FeatureCollection",
      "features": props.segments.map((item, index) => {
        return {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [item.Points.map(point => {
              return [point.lng, point.lat];
            })]
          },
          "properties": {
            "name": item.Nimi,
            "subsegment": item.On_Alasegmentti === null ? false : true,
            "segmentId": index+1,
            "snowId": item.update !== null ? item.update.Lumi.ID : 0
          },
          "id": index+1
        };
      })
    });
  }, [props.segments]);

  useEffect(() => {
    if(data.features.length > 0 && typeof map === "undefined") {
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

    if(typeof map !== "undefined") {
      map.on("load", function () {
        // Add geojson as source for layers
        map.addSource("segments-source", {
          type: "geojson",
          data: data
        });

        // Layer for segment fills
        map.addLayer({
          id: "segments-fills",
          source: "segments-source",
          type: "fill",
          layout: {},
          paint: {
            "fill-color": [
              "match", ["get", "snowId"],
              1, "#76c4d6",
              2, "#3f7089",
              3, "#3838a0",
              4, "#7a357c",
              5, "#b533b2",
              "#000000"
            ],
            // Opacity is dependant on the segments hover feature state
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.6,
              0.15
            ]
          }
        });

        // Layer for selected segment
        map.addLayer({
          id: "segments-selected",
          source: "segments-source",
          type: "fill",
          layout: {},
          paint: {
            "fill-color": "#000000",
            // Opacity is dependant on the segments hover feature state
            "fill-opacity": 0.6
          },
          filter: ["==", ["get", "segmentId"], 0]
        });

        // Layer for segment outlines
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
          props.chosenSegment(props.segments[e.features[0].id-1]);
          map.setFilter("segments-selected", ["==", ["get", "segmentId"], e.features[0].id]);
          // Filter out the selected segment from segments-fills layer when it is visible in segments-highlight layer
          map.setFilter("segments-fills", ["!=", ["get", "segmentId"], e.features[0].id]);
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
    }
  }, [data, props.subsOnly, props.shownSegment]);

  return (
    <div className={styledClasses.mapContainer} ref={mapContainerRef} />
  );
}

export default PallasMap;