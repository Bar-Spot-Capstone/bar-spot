import React from "react";
//import { Modal } from "react-bootstrap";

const ConfirmationPopup: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-body">
            <p>Are you sure you want to delete all items?</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={onConfirm} style={{backgroundColor: '#801F28', borderColor: '#801F28'}}>Yes, Delete All</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;