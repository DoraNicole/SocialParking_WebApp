//import axios from 'axios';
import * as React from 'react';
import {MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents} from 'react-leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
let defaultIcon = L.icon({iconUrl: icon});

function MapLogic ()
{
  const [pos,setPos] = React.useState(null);
  useMapEvents({
    click(e)
    {
        setPos(e.latlng);
    }
    
  })
  return (pos === null)
        ? null
        : (
        <Marker position={pos} icon={defaultIcon}>
        </Marker>
        )
}

class App extends React.Component {

  constructor(props)
  {
    super(props);
    //this.state = {positionList: []}
    this.tempList = [
      {
        alertCode: "Vv",
        classificationTag: "Vvv",
        location: {latitude: "51.505",longitude: "-0.09"},
        name: "Event1",
        reportingTime: "2020-09-01T14:00:00.000Z"
      },
      {
        alertCode: "Bb",
        classificationTag: "Bbb",
        location: {latitude: "52.505",longitude: "-1.09"},
        name: "Event2",
        reportingTime: "2020-08-01T16:00:00.000Z"
      }
    ];
  }

  /*componentDidMount()
  {
    axios.get("localhost:8085/event/getEvents").then((res)=>this.setState({positionList: res.data}));
  }*/

  render () {
    return (
      <>
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} style={{height: "100vh"}}>
          <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          {this.tempList.map((position) =>
            <Marker position={[position.location.latitude,position.location.longitude]} icon={defaultIcon}>
              <Popup>
                <div>
                    <h4>alertCode: {position.alertCode}</h4>
                    <h4>classificationTag: {position.classificationTag}</h4>
                    <h4>reportingTime:":{position.reportingTime}</h4>
                </div>
              </Popup>
              <Tooltip permanent direction="top">{position.name}</Tooltip>
            </Marker>
          )}
          <MapLogic/>
          <MapLogic />
        </MapContainer>
      </>
    );
    }
}

export default App;
