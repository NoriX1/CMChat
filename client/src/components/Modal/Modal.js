import React from 'react';
import ReactDOM from 'react-dom';

import './style.scss'

const Modal = props => {
    return ReactDOM.createPortal(
        <div className="modal" onClick={props.onDismiss}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content text-dark">
                    <div className="modal-header">
                        <h5 className="modal-title">{props.title}</h5>
                        <button className="close" onClick={props.onDismiss}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {props.content}
                    </div>
                    <div className="modal-footer">{props.actions}</div>
                </div>
            </div>
        </div>,
        document.querySelector('#modal')
    );
};

export default Modal;