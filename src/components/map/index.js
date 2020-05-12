import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import "./index.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2hyZXlhcy1iYWxpZ2EiLCJhIjoiY2s3a2w5eXlvMTNxYTNmcDN1cmo0bWZieCJ9.DhiXPgajbp4gd-ZRNDm_Fg";

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      lng: 74.856,
      lat: 12.914,
      zoom: 5
    };
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapRef.current,
      style: "mapbox://styles/haxzie/ck0aryyna2lwq1crp7fwpm5vz",
      center: [lng, lat],
      zoom
    });

    this.props.sightings.forEach(function (sighting) {

      var outer = document.createElement("div");
      // var inner = document.createElement("div");
      outer.className = "outer";
      // inner.className = "inner";
      // outer.appendChild(inner);
      outer.style.backgroundColor = "#FF0033"
      if (sighting.data().accuracy > 0.6)
        outer.style.backgroundColor = "#34E795"
      else if (sighting.data().accuracy > 0.4 && sighting.data().accuracy < 0.59)
        outer.style.backgroundColor = "#FFF23A"

      new mapboxgl.Marker(outer)
        .setLngLat([sighting.data().longitude, sighting.data().latitude])
        .addTo(map);

    });
    if (this.props.sightings.docs.length !== 0) {
      this.setState({
        lng: this.props.sightings.docs[0].data().longitude.toFixed(4),
        lat: this.props.sightings.docs[0].data().latitude.toFixed(4),
        zoom: 5
      });
    }

    map.on("move", () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }

  render() {
    return (
      <div
        className="map_container"
        ref={this.mapRef}
      />

    );
  }
}

export default Map;
