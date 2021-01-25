import * as React from 'react';
import {MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents} from 'react-leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import Modal from './components/Modal/Modal'
let defaultIcon = L.icon({iconUrl: icon});

function MapLogic ()
{
  const [pos,setPos] = React.useState(null);
  
  useMapEvents({
    click(e)
    {
      setPos(e.latlng);
      document.getElementById("open-btn").style.display = "block";
        
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
    this.state = {
      show: false,
      positionList: [],
      file: '',
      imagePreviewUrl: '',
      reportData: {name:'', id:0, alertCode:'', classificationTag:'', location:[], picture:'', timestamp:''}
    }
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.collectData = this.collectData.bind(this);
  }

  showModal = () => {
    
    this.setState({ show: true });
    console.log(this.state.show);
  };

  hideModal = () => {
    this.setState({ show: false });
  };
  collectData = () => {
    this.setState({reportData:{name:'test-web-1', id: 1, alertCode:'medium', classificationTag:'none', location:[], picture:this.state.imagePreviewUrl, timestamp:''}});
    console.log(this.state.reportData)
  }

  componentDidMount()
  {
    fetch("/event/getEvents")
     .then((res)=>res.json().then((res1)=>
     {
       console.log(res1);
       this.setState({positionList: res1})
     }))
  }
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
      
      <Modal id="main-div" handleClose={this.hideModal} show={this.state.show} >
          <form className="form">
            <h2 className="mb-5" id="form-title">Report an event</h2>
            <div id="details" className="text-left">
              <MDBInput id="tag" label="Classify the event"/>
              <MDBInput id="code" label="Type the alert code"/>
              <MDBInput id="description" label="Write a description" type="textarea" rows="5" />
            </div>
            <div id="location">
              <h4 className="text-left dark-grey-text">Location</h4>
            </div>
            <div id="eventImage">
              <h4 className="text-left dark-grey-text">Picture</h4>
              <input type="file" size="sm" onChange={this.onDrop}/>
              <img id="uploaded-image" src={imagePreviewUrl} />   
            </div>
            <MDBBtn id="add-event" onClick={this.collectData}>Add event</MDBBtn>
          </form>    
        </Modal>       
      <MapContainer id="map-id" center={[0.00, 0.00]} whenCreated={(map) => map.locate()} zoom={12} scrollWheelZoom={true} style={{height: "100vh"}}>
        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapLocation/>
          {this.state.positionList.map((position,i) =>
          <Marker key={i} position={[JSON.parse(position.location).latitude,JSON.parse(position.location).longitude]} icon={defaultIcon}>
            <Popup>
              <div>
                  <h4>alertCode: {position.alertCode}</h4>
                  <h4>classificationTag: {position.classificationTag}</h4>
                  <h4>reportingTime:{position.reportingTime}</h4>
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
