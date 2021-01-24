import React, { Component } from 'react';
import { useState, useRef } from "react";
import ReactDOM from 'react-dom';
import '../AddEvent/AddEvent.css';
import Modal from '../Modal/Modal.js'
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';




class AddEvent extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      currentPosition: [45, 25],
      file: '',
      imagePreviewUrl: ''
    };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    // this.getLocation = this.getLocation.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  getLocation(){
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      this.setState({currentPosition: [position.coords.latitude, position.coords.longitude]});
    });
    
  }
  componentWillMount = () => {
    
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({currentPosition: [position.coords.latitude, position.coords.longitude]});
      console.log("Latitude is :", this.state.currentPosition[0]);
      console.log("Longitude is :", this.state.currentPosition[1]);
        }, err => console.log(err)
    );
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
  /** timp raportare, locatie, cod de alerta, descriere, poza, eticheta de clasificare(tag) */
    render() {
      let {imagePreviewUrl} = this.state;
      const mapStyles = {
        width: '100%',
        height: '400px'
      };
        return(
          <main className="main-div">
            <Modal show={this.state.show} handleClose={this.hideModal}>
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
          </main>
         
        )
      }
}
export default AddEvent