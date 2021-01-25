import * as React from 'react';
import {MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvents} from 'react-leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png'
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';
import Modal from './components/Modal/Modal'
import ls from 'local-storage'
let defaultIcon = L.icon({iconUrl: icon});

function MapLogic ()
{
  const [pos,setPos] = React.useState(null);
  
  useMapEvents({
    click(e)
    {
      setPos(e.latlng);
      ls.set('location', e.latlng);
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
      // reportData: {name:"", alertCode:"", classificationTag:"", location:{}, picture:"", timestamp:""}
      name: "",
      alertCode: "",
      classificationTag:""
    }
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.collectData = this.collectData.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleCode = this.handleCode.bind(this);
    this.handleClassification = this.handleClassification.bind(this);
  }

  showModal = () => {
    
    this.setState({ show: true });
    console.log(this.state.show);
  };

  hideModal = () => {
    this.setState({ show: false });
  };
  collectData = () => {
    const imgTemp = this.state.imagePreviewUrl
    let imagePath = imgTemp.substring(imgTemp.indexOf(',') + 1)
    const reportData = {name:this.state.name, alertCode:this.state.alertCode, classificationTag:this.state.classificationTag, location:JSON.stringify({latitude:ls.get('location').lat, longitude:ls.get('location').lng}), picture:imagePath, reportingTime:new Date().toISOString()}
    console.log(reportData)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    };
    fetch("/event/saveEvent", requestOptions)
    .then(response => {
    console.log(response)})
  }
  handleName(event) {
    this.setState({name:event.target.value});
    // console.log(this.state.reportData)
  }
  handleCode(event) {
    this.setState({alertCode: event.target.value});
    console.log(this.state.alertCode)
  }
  handleClassification(event) {
    this.setState({classificationTag:event.target.value});
    console.log(this.state.classificationTag)
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
    console.log(this.state.imagePreviewUrl)
  }

  render () {
    let {imagePreviewUrl} = this.state;
    
    return (
      
      <>
      
      <Modal id="main-div" handleClose={this.hideModal} show={this.state.show} >
          <form className="form">
            <h2 className="mb-5" id="form-title">Report an event</h2>
            <div id="details" className="text-left">
              <MDBInput id="name" label="Type the event name" onChange={this.handleName}/>
              <MDBInput id="tag" label="Classify the event" onChange={this.handleClassification}/>
              <MDBInput id="code" label="Type the alert code" onChange={this.handleCode}/>
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
          {this.state.positionList.map((position,i) => {
          if (position.location !== null)
          {
          return(
          <Marker key={i} position={[JSON.parse(position.location).latitude,JSON.parse(position.location).longitude]} icon={defaultIcon}>
            <Popup>
              <div>
                  <h4>alertCode: {position.alertCode}</h4>
                  <h4>classificationTag: {position.classificationTag}</h4>
                  <h4>reportingTime:{position.reportingTime}</h4>
              </div>
            </Popup>
            <Tooltip permanent direction="top">{position.name}</Tooltip>
          </Marker>);
          }
          else
          {
            return null;
          }
        }
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
