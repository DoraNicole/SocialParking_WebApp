//import axios from 'axios';
import * as React from 'react';
import {MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents} from 'react-leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import Modal from './components/Modal/Modal'
let defaultIcon = L.icon({iconUrl: icon});
let disabledVar = true;

function MapLogic ()
{
  const [pos,setPos] = React.useState(null);
  const [,setState] = React.useState();
  
  useMapEvents({
    click(e)
    {
      disabledVar = false;
        setPos(e.latlng);
        document.getElementById("open-btn").style.display = "block";
        // document.getElementById("main-div").show = true;

        // console.log(disabledVar)
        
    },
  })
  return (pos === null)
        ? null
        : (
          <div>
            <Marker position={pos} icon={defaultIcon}>
            </Marker>
            
          </div>
        
        )
}

function MapLocation()
{
  const [coords,setCoords] = React.useState(null);
  const map = useMapEvents({
    locationfound(e)
    {
      map.flyTo(e.latlng, 18);
      console.log(e);
      setCoords(e.latlng);      
    },
  })
  return (coords === null)
        ? null
        : (
        <Marker position={coords} icon={defaultIcon}>
          <Popup>You are here!</Popup>
        </Marker>
        )
}

class App extends React.Component {

  constructor(props)
  {
    super(props);
    //this.state = {positionList: []}
    this.state = {
      show: true,
      file: '',
      imagePreviewUrl: ''
    }
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
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  showModal = () => {
    console.log('here');
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  /*componentDidMount()
  {
    axios.get("localhost:8085/event/getEvents").then((res)=>this.setState({positionList: res.data}));
  }*/
  onDrop(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  render () {
    let {imagePreviewUrl} = this.state;
    return (
      
      <>
      
      <Modal id="main-div" show={this.state.show} handleClose={this.hideModal}>
          <form className="form">
            <p className="h4 mb-5">Report an event</p>
            <div id="details" className="text-left grey-text">
              <MDBInput id="tag" label="Classify the event"/>
              <MDBInput id="code" label="Type the alert code"/>
              <MDBInput id="description" label="Write a description" type="textarea" rows="5" />
            </div>
            <div id="location">
              <h6 className="text-left dark-grey-text">Location</h6>
            </div>
            <div id="eventImage">
              <h6 className="text-left dark-grey-text">Picture</h6>
              <input type="file" size="sm" onChange={this.onDrop}/>
              <img id="uploaded-image" src={imagePreviewUrl} />   
            </div>
            <MDBBtn id="add-event">Add event</MDBBtn>
          </form>    
        </Modal>       
      <MapContainer id="map-id" center={[0.00, 0.00]} whenCreated={(map) => map.locate()} zoom={12} scrollWheelZoom={true} style={{height: "100vh"}}>
        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapLocation/>
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
        
      </MapContainer>
      <MDBBtn id="open-btn" type="button" color="lime" onClick={this.showModal}>
          Report event
      </MDBBtn>
         

      </>
    );
    }
}

export default App;
