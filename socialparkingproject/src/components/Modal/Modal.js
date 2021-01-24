import './Modal.css';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdbreact';

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
        
      <section className="modal-main">
        <MDBBtn type="button" color="mdb-color" size="sm" id="close-btn" onClick={handleClose}>
          Close
        </MDBBtn>
        {children}
      </section>
    </div>
  );
};
export default Modal